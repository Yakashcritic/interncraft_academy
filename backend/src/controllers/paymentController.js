const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Referral = require("../models/Referral");
const { isValidCourseId, getCoursePrice } = require("../config/courses");
const Cashfree = require("../config/cashfree");

// Cashfree SDK v5 uses direct static methods, no constructor needed

// Constants
const CASHFREE_API_VERSION = "2023-08-01";
const WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET;
const REFERRAL_DISCOUNT_PERCENT = 20;
const REFERRAL_REWARD_AMOUNT = 150;

// Currency handling - using paise (INR smallest unit) to avoid floating point errors
const toPaise = (rupees) => Math.round(rupees * 100);
const toRupees = (paise) => paise / 100;

/**
 * Verify Cashfree webhook signature
 * @param {Object} payload - Request body
 * @param {string} signature - x-webhook-signature header
 * @param {string} secret - Webhook secret
 * @returns {boolean}
 */
const verifyWebhookSignature = (payload, signature, secret) => {
  if (!signature || !secret) return false;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(computed, "base64"),
    Buffer.from(signature, "base64")
  );
};

const calculatePricing = async ({ couponCode, courseId, userId }) => {
  const basePrice = getCoursePrice(courseId);
  if (!basePrice) {
    throw new Error("Invalid course selected for pricing.");
  }

  // Use paise for precision
  let originalAmountPaise = toPaise(basePrice);
  let discountAmountPaise = 0;
  let finalAmountPaise = toPaise(basePrice);
  let appliedCoupon = null;
  let referralData = null;

  if (couponCode) {
    const normalizedCode = couponCode.toUpperCase().trim();

    // Atomic check: validate coupon and check usage limit in one query
    // Use $and to combine multiple $or conditions
    const coupon = await Coupon.findOne({
      code: normalizedCode,
      isActive: true,
      $and: [
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gte: new Date() } },
          ],
        },
        {
          $or: [
            { usageLimit: 0 },
            { usageLimit: { $exists: false } },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
          ],
        },
      ],
    });

    if (coupon) {
      if (coupon.discountType === "flat") {
        discountAmountPaise = toPaise(coupon.discountValue);
      } else if (coupon.discountType === "percentage") {
        // Calculate percentage with paise precision
        discountAmountPaise = Math.round(
          (originalAmountPaise * coupon.discountValue) / 100
        );
        if (coupon.maxDiscount > 0) {
          const maxDiscountPaise = toPaise(coupon.maxDiscount);
          discountAmountPaise = Math.min(discountAmountPaise, maxDiscountPaise);
        }
      }

      finalAmountPaise = Math.max(originalAmountPaise - discountAmountPaise, 0);
      appliedCoupon = coupon;
    } else {
      const referralOwner = await User.findOne({
        referralCode: normalizedCode,
      }).select("_id referralCode");

      if (!referralOwner) {
        throw new Error("Invalid coupon or referral code.");
      }

      if (referralOwner._id.toString() === userId.toString()) {
        throw new Error("You cannot use your own referral code.");
      }

      const alreadyCompleted = await Referral.findOne({
        referrerUserId: referralOwner._id,
        referredUserId: userId,
        status: "completed",
      }).select("_id");

      if (alreadyCompleted) {
        throw new Error("Referral reward already used for this account.");
      }

      discountAmountPaise = Math.round(
        (originalAmountPaise * REFERRAL_DISCOUNT_PERCENT) / 100
      );
      finalAmountPaise = Math.max(originalAmountPaise - discountAmountPaise, 0);
      referralData = {
        referrerUserId: referralOwner._id,
        referralCode: referralOwner.referralCode,
      };
    }
  }

  return {
    originalAmount: toRupees(originalAmountPaise),
    discountAmount: toRupees(discountAmountPaise),
    finalAmount: toRupees(finalAmountPaise),
    appliedCoupon,
    referralData,
  };
};

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { couponCode, courseId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!courseId || !isValidCourseId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please choose a valid internship program before paying.",
      });
    }

    // Validate phone number - reject if not provided
    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required for payment. Please update your profile.",
      });
    }

    // Idempotency check: If user has a pending payment for same course within last 30 min, return existing
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingPayment = await Payment.findOne({
      userId: user._id,
      courseId,
      paymentStatus: "pending",
      createdAt: { $gte: thirtyMinutesAgo },
    }).sort({ createdAt: -1 });

    if (existingPayment) {
      try {
        const existingOrder = await Cashfree.PGFetchOrder(
          CASHFREE_API_VERSION,
          existingPayment.orderId
        );
        const orderStatus = existingOrder?.data?.order_status;
        const activeSessionId =
          existingOrder?.data?.payment_session_id || existingPayment.paymentSessionId;

        if (orderStatus === "PAID") {
          await processPaymentSuccess(existingPayment, existingPayment.orderId);
          return res.status(400).json({
            success: false,
            message:
              "Payment is already completed for this track. Open dashboard to continue.",
          });
        }

        if (orderStatus === "ACTIVE" && activeSessionId) {
          const cashfreeMode =
            process.env.CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox";

          return res.json({
            success: true,
            message: "Existing payment order found",
            paymentSessionId: activeSessionId,
            orderId: existingPayment.orderId,
            cashfreeMode,
            isExisting: true,
          });
        }

        await Payment.updateOne(
          { _id: existingPayment._id },
          { $set: { paymentStatus: "failed" } }
        );
      } catch (existingOrderError) {
        console.error(
          `Failed to validate existing order ${existingPayment.orderId}:`,
          existingOrderError?.response?.data || existingOrderError.message
        );
        await Payment.updateOne(
          { _id: existingPayment._id },
          { $set: { paymentStatus: "failed" } }
        );
      }
    }

    let pricingResult;
    try {
      pricingResult = await calculatePricing({
        couponCode,
        courseId,
        userId: user._id,
      });
    } catch (pricingError) {
      return res.status(400).json({
        success: false,
        message: pricingError.message || "Invalid coupon/referral code.",
      });
    }

    const {
      originalAmount,
      discountAmount,
      finalAmount,
      appliedCoupon,
      referralData,
    } = pricingResult;

    // Validate pricing - ensure amount is positive
    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. The discount cannot exceed the original price.",
      });
    }

    // Check if user already paid for this course
    if (user.paymentStatus === "paid" && user.enrolledCourseId === courseId) {
      return res.status(400).json({
        success: false,
        message: "You have already paid for this course.",
      });
    }

    const orderId = `order_${Date.now()}_${user._id.toString().slice(-6)}`;

    // Validate all required fields before sending to Cashfree
    if (!user.fullName || !user.email || !user.phone) {
      return res.status(400).json({
        success: false,
        message: "Profile incomplete. Name, email, and phone are required.",
      });
    }

    const request = {
      order_amount: finalAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.fullName.trim(),
        customer_email: user.email.trim(),
        customer_phone: user.phone.trim(),
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/dashboard?order_id={order_id}`,
      },
    };

    const cashfreeResponse = await Cashfree.PGCreateOrder(
      CASHFREE_API_VERSION,
      request
    );

    await session.withTransaction(async () => {
      await Payment.create(
        [
          {
            userId: user._id,
            orderId,
            gatewayOrderId: cashfreeResponse.data.cf_order_id,
            paymentSessionId: cashfreeResponse.data.payment_session_id,
            originalAmount,
            finalAmount,
            discountAmount,
            couponCode: appliedCoupon ? appliedCoupon.code : "",
            referrerUserId: referralData ? referralData.referrerUserId : null,
            referralCodeApplied: referralData ? referralData.referralCode : "",
            referralRewardStatus: referralData ? "pending" : "none",
            courseId,
            paymentStatus: "pending",
          },
        ],
        { session }
      );

      if (referralData) {
        await Referral.updateOne(
          {
            referrerUserId: referralData.referrerUserId,
            referredUserId: user._id,
          },
          {
            $set: {
              referralCode: referralData.referralCode,
              orderId,
              rewardAmount: REFERRAL_REWARD_AMOUNT,
              status: "pending",
              completedAt: null,
            },
          },
          { upsert: true, session }
        );
      }

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            paymentStatus: "pending",
            enrolledCourseId: courseId,
          },
        },
        { session }
      );
    });

    const cashfreeMode =
      process.env.CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox";

    res.json({
      success: true,
      message: "Payment order created successfully",
      paymentSessionId: cashfreeResponse.data.payment_session_id,
      orderId,
      cashfreeMode,
      isExisting: false,
    });
  } catch (error) {
    console.error("Create Order Error Details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack,
    });

    // Return detailed error info to frontend for debugging
    const errorDetail = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      "Failed to create payment order";

    res.status(500).json({
      success: false,
      message: errorDetail,
      error: error.response?.data || { message: error.message },
    });
  } finally {
    await session.endSession();
  }
};

const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // If already processed, return cached status
    if (payment.paymentStatus === "success") {
      return res.json({
        success: true,
        message: "Payment verified successfully",
        paymentStatus: "success",
      });
    }

    const cashfreeResponse = await Cashfree.PGFetchOrder(
      CASHFREE_API_VERSION,
      orderId
    );
    const orderData = cashfreeResponse.data;

    if (orderData.order_status === "PAID") {
      await processPaymentSuccess(payment, orderId);

      return res.json({
        success: true,
        message: "Payment verified successfully",
        paymentStatus: "success",
      });
    }

    if (orderData.order_status === "ACTIVE") {
      return res.json({
        success: true,
        message: "Payment is still pending",
        paymentStatus: "pending",
      });
    }

    // Failed status
    if (payment.paymentStatus !== "failed") {
      await Payment.updateOne(
        { orderId },
        { $set: { paymentStatus: "failed" } }
      );
    }

    return res.json({
      success: false,
      message: "Payment failed",
      paymentStatus: "failed",
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.response?.data || error.message,
    });
  } finally {
    await session.endSession();
  }
};

const getPaymentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const latestPayment = await Payment.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      paymentStatus: user.paymentStatus,
      latestPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: error.message,
    });
  }
};

const cashfreeWebhook = async (req, res) => {
  // STEP 1: Verify signature immediately (security critical)
  const signature = req.headers["x-webhook-signature"];

  if (!signature) {
    return res.status(401).json({
      success: false,
      message: "Missing webhook signature",
    });
  }

  if (!verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET)) {
    console.error("Invalid webhook signature received");
    return res.status(401).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  // STEP 2: Acknowledge webhook immediately (must be within 5 seconds)
  // Process asynchronously to avoid Cashfree retries
  res.status(200).json({
    success: true,
    message: "Webhook received",
  });

  // STEP 3: Process in background
  try {
    const data = req.body;
    const orderId = data?.data?.order?.order_id;
    const orderStatus = data?.data?.order?.order_status;

    if (!orderId || !orderStatus) {
      console.error("Webhook missing required fields:", { orderId, orderStatus });
      return;
    }

    // Only process PAID status
    if (orderStatus !== "PAID") {
      console.log(`Webhook: Order ${orderId} status is ${orderStatus}, skipping`);
      return;
    }

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      console.error(`Webhook: Payment not found for order ${orderId}`);
      return;
    }

    // Skip if already processed
    if (payment.paymentStatus === "success") {
      console.log(`Webhook: Order ${orderId} already processed`);
      return;
    }

    // Process payment with transaction
    await processPaymentSuccess(payment, orderId);
  } catch (error) {
    console.error("Webhook Processing Error:", error.message);
    // Log for manual intervention if needed
  }
};

/**
 * Process payment success with transaction
 * Separate function for reusability between verifyPayment and webhook
 */
const processPaymentSuccess = async (payment, orderId) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Re-check status inside transaction
      const currentPayment = await Payment.findOne(
        { orderId },
        null,
        { session }
      );

      if (!currentPayment || currentPayment.paymentStatus === "success") {
        return;
      }

      // Update payment
      await Payment.updateOne(
        { orderId },
        {
          $set: {
            paymentStatus: "success",
            paidAt: new Date(),
          },
        },
        { session }
      );

      // Update user
      await User.findByIdAndUpdate(
        payment.userId,
        {
          paymentStatus: "paid",
          enrolledCourseId: payment.courseId || "",
        },
        { session }
      );

      // Increment coupon with limit check
      if (payment.couponCode) {
        const couponUpdate = await Coupon.findOneAndUpdate(
          {
            code: payment.couponCode,
            $or: [
              { usageLimit: 0 },
              { usageLimit: { $exists: false } },
              { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
            ],
          },
          { $inc: { usedCount: 1 } },
          { session, new: true }
        );

        if (!couponUpdate) {
          console.warn(
            `Webhook: Coupon ${payment.couponCode} limit exceeded for order ${orderId}`
          );
        }
      }

      if (payment.referrerUserId && payment.referralRewardStatus === "pending") {
        const existingCompletedReferral = await Referral.findOne({
          referrerUserId: payment.referrerUserId,
          referredUserId: payment.userId,
          status: "completed",
        }).session(session);

        if (!existingCompletedReferral) {
          await User.updateOne(
            { _id: payment.referrerUserId },
            {
              $inc: {
                walletBalance: REFERRAL_REWARD_AMOUNT,
                totalReferralEarnings: REFERRAL_REWARD_AMOUNT,
                totalReferrals: 1,
              },
            },
            { session }
          );
        }

        await Referral.updateOne(
          {
            referrerUserId: payment.referrerUserId,
            referredUserId: payment.userId,
          },
          {
            $set: {
              referralCode: payment.referralCodeApplied,
              orderId,
              rewardAmount: REFERRAL_REWARD_AMOUNT,
              status: "completed",
              completedAt: new Date(),
            },
          },
          { upsert: true, session }
        );

        await Payment.updateOne(
          { orderId },
          { $set: { referralRewardStatus: "completed" } },
          { session }
        );
      }
    });

    console.log(`Webhook: Successfully processed order ${orderId}`);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  cashfreeWebhook,
};