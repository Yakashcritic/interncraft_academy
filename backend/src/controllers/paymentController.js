const Payment = require("../models/Payment");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const { isValidCourseId } = require("../config/courses");
const CashfreeClass = require("../config/cashfree");
const Cashfree = new CashfreeClass();

const PROGRAM_PRICE = 999;

const calculatePricing = async (couponCode) => {
  let originalAmount = PROGRAM_PRICE;
  let discountAmount = 0;
  let finalAmount = PROGRAM_PRICE;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

    if (
      coupon &&
      coupon.isActive &&
      (!coupon.expiresAt || new Date() <= coupon.expiresAt) &&
      (coupon.usageLimit === 0 || coupon.usedCount < coupon.usageLimit)
    ) {
      if (coupon.discountType === "flat") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "percentage") {
        discountAmount = (PROGRAM_PRICE * coupon.discountValue) / 100;
        if (coupon.maxDiscount > 0) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      }

      finalAmount = Math.max(PROGRAM_PRICE - discountAmount, 0);
      appliedCoupon = coupon;
    }
  }

  return {
    originalAmount,
    discountAmount,
    finalAmount,
    appliedCoupon,
  };
};

const createOrder = async (req, res) => {
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

    const { originalAmount, discountAmount, finalAmount, appliedCoupon } =
      await calculatePricing(couponCode);

    const orderId = `order_${Date.now()}`;

    const request = {
      order_amount: finalAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_name: user.fullName,
        customer_email: user.email,
        customer_phone: user.phone || "9999999999",
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/dashboard?order_id={order_id}`,
      },
    };

    const cashfreeResponse = await Cashfree.PGCreateOrder("2023-08-01", request);

    await Payment.create({
      userId: user._id,
      orderId,
      gatewayOrderId: cashfreeResponse.data.cf_order_id,
      originalAmount,
      finalAmount,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      courseId,
      paymentStatus: "pending",
    });

    const cashfreeMode =
      process.env.CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox";

    res.json({
      success: true,
      message: "Payment order created successfully",
      paymentSessionId: cashfreeResponse.data.payment_session_id,
      orderId,
      cashfreeMode,
    });
  } catch (error) {
    console.error("Create Order Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.response?.data || error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const cashfreeResponse = await Cashfree.PGFetchOrder("2023-08-01", orderId);
    const orderData = cashfreeResponse.data;

    if (orderData.order_status === "PAID") {
      if (payment.paymentStatus !== "success") {
        payment.paymentStatus = "success";
        payment.paidAt = new Date();
        await payment.save();

        await User.findByIdAndUpdate(payment.userId, {
          paymentStatus: "paid",
          enrolledCourseId: payment.courseId || "",
        });

        if (payment.couponCode) {
          await Coupon.findOneAndUpdate(
            { code: payment.couponCode },
            { $inc: { usedCount: 1 } }
          );
        }
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

    payment.paymentStatus = "failed";
    await payment.save();

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
  try {
    const data = req.body;

    const orderId = data?.data?.order?.order_id;
    const orderStatus = data?.data?.order?.order_status;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing in webhook",
      });
    }

    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (orderStatus === "PAID" && payment.paymentStatus !== "success") {
      payment.paymentStatus = "success";
      payment.paidAt = new Date();
      await payment.save();

      await User.findByIdAndUpdate(payment.userId, {
        paymentStatus: "paid",
        enrolledCourseId: payment.courseId || "",
      });

      if (payment.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: payment.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  cashfreeWebhook,
};