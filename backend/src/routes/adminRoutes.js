const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminAuth");
const { listUsers, updateUser } = require("../controllers/adminUserController");

// All admin routes must be protected and restricted to Admin role
router.use(isAuthenticated, isAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Paginated user list with optional search
 */
router.get("/users", listUsers);

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user role, payment status, or profile flag
 */
router.patch("/users/:id", updateUser);

/**
 * @route   GET /api/admin/coupons
 * @desc    Fetch all coupons
 */
router.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/admin/coupons
 * @desc    Create a new coupon
 */
router.post("/coupons", async (req, res) => {
  try {
    const { code, discountType, discountValue, maxDiscount, usageLimit, expiresAt } = req.body;

    const rawCode = typeof code === "string" ? code.trim() : "";
    if (!rawCode) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }
    if (!["flat", "percentage"].includes(discountType)) {
      return res.status(400).json({ success: false, message: "Invalid discount type" });
    }
    const valueNum = Number(discountValue);
    if (!Number.isFinite(valueNum) || valueNum <= 0) {
      return res.status(400).json({ success: false, message: "Discount value must be a positive number" });
    }
    if (discountType === "percentage" && valueNum > 100) {
      return res.status(400).json({ success: false, message: "Percentage cannot exceed 100" });
    }

    const existingCoupon = await Coupon.findOne({ code: rawCode.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const newCoupon = await Coupon.create({
      code: rawCode.toUpperCase(),
      discountType,
      discountValue: valueNum,
      maxDiscount: maxDiscount || 0,
      usageLimit: usageLimit || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/admin/coupons/:id
 * @desc    Toggle coupon active status
 */
router.put("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({ success: true, coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/coupons/:id
 * @desc    Delete a coupon
 */
router.delete("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    await coupon.deleteOne();
    res.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user and their payments
 */
router.delete("/users/:id", async (req, res) => {
  try {
    const User = require("../models/User");
    const Payment = require("../models/Payment");
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Delete user's payments
    await Payment.deleteMany({ userId: user._id });
    
    // Delete user
    await user.deleteOne();
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
