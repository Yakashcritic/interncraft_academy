const User = require("../models/User");
const { getCourseForUser } = require("../config/courses");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const completeProfile = async (req, res) => {
  try {
    const { phone, collegeName, courseDegree, year } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        phone,
        collegeName,
        courseDegree,
        year,
        profileCompleted: true,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete profile",
      error: error.message,
    });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "fullName email phone collegeName courseDegree year profilePicture paymentStatus enrolledCourseId profileCompleted createdAt referralCode walletBalance totalReferralEarnings totalReferrals"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.paymentStatus !== "paid") {
      return res.status(403).json({
        success: false,
        message: "Complete payment to open your student dashboard.",
      });
    }

    const course = getCourseForUser(user.enrolledCourseId);

    res.json({
      success: true,
      user,
      course,
      referral: {
        referralCode: user.referralCode || "",
        walletBalance: user.walletBalance || 0,
        totalEarnings: user.totalReferralEarnings || 0,
        totalReferrals: user.totalReferrals || 0,
        referralLink: user.referralCode
          ? `https://learnmythos.app?ref=${user.referralCode}`
          : "",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load enrollment",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  completeProfile,
  getEnrollment,
};