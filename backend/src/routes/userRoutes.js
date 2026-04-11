const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const {
  getProfile,
  completeProfile,
  getEnrollment,
} = require("../controllers/userController");

router.get("/profile", isAuthenticated, getProfile);
router.get("/enrollment", isAuthenticated, getEnrollment);
router.put("/complete-profile", isAuthenticated, completeProfile);

module.exports = router;