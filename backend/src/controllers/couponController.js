const Coupon = require("../models/Coupon");
const User = require("../models/User");
const Referral = require("../models/Referral");
const { getCoursePrice, isValidCourseId } = require("../config/courses");

const REFERRAL_DISCOUNT_PERCENT = 20;

const validateCoupon = async (req, res) => {
  try {
    const { code, courseId } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!courseId || !isValidCourseId(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid course before applying coupon/referral.",
      });
    }

    const programPrice = getCoursePrice(courseId);
    const normalizedCode = code.toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: normalizedCode });

    if (coupon) {
      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive",
        });
      }

      if (coupon.expiresAt && new Date() > coupon.expiresAt) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      let discountAmount = 0;

      if (coupon.discountType === "flat") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "percentage") {
        discountAmount = (programPrice * coupon.discountValue) / 100;

        if (coupon.maxDiscount > 0) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      }

      const finalAmount = Math.max(programPrice - discountAmount, 0);

      return res.json({
        success: true,
        message: "Coupon applied successfully",
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        },
        pricing: {
          originalAmount: programPrice,
          discountAmount,
          finalAmount,
        },
      });
    }

    const referralOwner = await User.findOne({ referralCode: normalizedCode }).select(
      "_id referralCode"
    );
    if (!referralOwner) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon or referral code",
      });
    }

    if (referralOwner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot use your own referral code",
      });
    }

    const alreadyCompleted = await Referral.findOne({
      referrerUserId: referralOwner._id,
      referredUserId: req.user._id,
      status: "completed",
    }).select("_id");
    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Referral already used for this account",
      });
    }

    const discountAmount = Math.round(
      (programPrice * REFERRAL_DISCOUNT_PERCENT) / 100
    );
    const finalAmount = Math.max(programPrice - discountAmount, 0);

    return res.json({
      success: true,
      message: "Referral code applied successfully",
      coupon: {
        code: referralOwner.referralCode,
        discountType: "percentage",
        discountValue: REFERRAL_DISCOUNT_PERCENT,
      },
      pricing: {
        originalAmount: programPrice,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon",
      error: error.message,
    });
  }
};

module.exports = {
  validateCoupon,
};