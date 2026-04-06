const User = require("../models/User");

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

module.exports = {
  getProfile,
  completeProfile,
};