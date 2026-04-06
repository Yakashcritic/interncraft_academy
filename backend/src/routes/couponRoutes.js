const express = require("express");
const router = express.Router();

const { validateCoupon } = require("../controllers/couponController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/validate", isAuthenticated, validateCoupon);

module.exports = router;