const mongoose = require("mongoose");
const User = require("../models/User");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const search = (req.query.search || "").trim();

    const filter =
      search.length > 0
        ? {
            $or: [
              { email: new RegExp(escapeRegex(search), "i") },
              { fullName: new RegExp(escapeRegex(search), "i") },
            ],
          }
        : {};

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-googleId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      users,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { role, paymentStatus, profileCompleted } = req.body;
    const adminId = req.user._id.toString();

    if (
      role === undefined &&
      paymentStatus === undefined &&
      profileCompleted === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one of: role, paymentStatus, profileCompleted",
      });
    }

    if (role !== undefined) {
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
      }
      if (id === adminId && role === "user") {
        return res.status(400).json({
          success: false,
          message: "You cannot remove your own admin access",
        });
      }
      user.role = role;
    }

    if (paymentStatus !== undefined) {
      if (!["unpaid", "pending", "paid", "failed"].includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }
      user.paymentStatus = paymentStatus;
    }

    if (profileCompleted !== undefined) {
      if (typeof profileCompleted !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "profileCompleted must be a boolean",
        });
      }
      user.profileCompleted = profileCompleted;
    }

    await user.save();

    const updated = await User.findById(id).select("-googleId").lean();
    res.json({ success: true, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { listUsers, updateUser };
