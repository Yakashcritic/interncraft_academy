const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const { isValidCourseId } = require("../config/courses");
const Cashfree = require("../config/cashfree");

// Cashfree SDK v5 uses direct static methods, no constructor needed

// Constants
const CASHFREE_API_VERSION = "2023-08-01";
const PROGRAM_PRICE = 999;
const WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET;

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

const calculatePricing = async (couponCode) => {
  // Use paise for precision
  let originalAmountPaise = toPaise(PROGRAM_PRICE);
  let discountAmountPaise = 0;
  let finalAmountPaise = toPaise(PROGRAM_PRICE);
  let appliedCoupon = null;

  if (couponCode) {
    const normalizedCode = couponCode.toUpperCase().trim();

    // Atomic check: validate coupon and check usage limit in one query
    const coupon = await Coupon.findOne({
      code: normalizedCode,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: new Date() } },
      ],
      $or: [
        { usageLimit: 0 },
        { usageLimit: { $exists: false } },
        { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
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
    }
  }

  return {
    originalAmount: toRupees(originalAmountPaise),
    discountAmount: toRupees(discountAmountPaise),
    finalAmount: toRupees(finalAmountPaise),
    appliedCoupon,
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
        message: "Choose one of the six program tracks before paying.",
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
      const cashfreeMode =
        process.env.CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox";

      return res.json({
        success: true,
        message: "Existing payment order found",
        paymentSessionId: existingPayment.paymentSessionId,
        orderId: existingPayment.orderId,
        cashfreeMode,
        isExisting: true,
      });
    }

    const { originalAmount, discountAmount, finalAmount, appliedCoupon } =
      await calculatePricing(couponCode);

    // Check if user already paid for this course
    if (user.paymentStatus === "paid" && user.enrolledCourseId === courseId) {
      return res.status(400).json({
        success: false,
        message: "You have already paid for this course.",
      });
    }

    const orderId = `order_${Date.now()}_${user._id.toString().slice(-6)}`;

    const request = {
      order_amount: finalAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.fullName,
        customer_email: user.email,
        customer_phone: user.phone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/dashboard?order_id={order_id}`,
      },
    };

    const cashfreeResponse = await Cashfree.PGCreateOrder(
      request,
      CASHFREE_API_VERSION
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
            courseId,
            paymentStatus: "pending",
          },
        ],
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
    console.error("Create Order Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.response?.data || error.message,
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
      orderId,
      CASHFREE_API_VERSION
    );
    const orderData = cashfreeResponse.data;

    if (orderData.order_status === "PAID") {
      let transactionResult = false;

      await session.withTransaction(async () => {
        // Re-check status inside transaction to handle race conditions
        const currentPayment = await Payment.findOne(
          { orderId },
          null,
          { session, lock: { mode: "exclusive" } }
        );

        if (!currentPayment || currentPayment.paymentStatus === "success") {
          transactionResult = true;
          return;
        }

        // Update payment status
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

        // Atomically increment coupon with usage limit check
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
            // Coupon limit exceeded - log warning but don't fail payment
            console.warn(
              `Coupon ${payment.couponCode} limit exceeded for order ${orderId}`
            );
          }
        }

        transactionResult = true;
      });

      if (!transactionResult) {
        throw new Error("Transaction failed");
      }

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