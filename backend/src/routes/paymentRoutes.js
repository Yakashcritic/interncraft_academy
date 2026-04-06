const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  cashfreeWebhook,
} = require("../controllers/paymentController");

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verifyPayment);
router.get("/status", isAuthenticated, getPaymentStatus);
router.post("/webhook", cashfreeWebhook);

module.exports = router;