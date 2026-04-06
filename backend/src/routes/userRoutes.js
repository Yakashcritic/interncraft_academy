const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { getProfile, completeProfile } = require("../controllers/userController");

router.get("/profile", isAuthenticated, getProfile);
router.put("/complete-profile", isAuthenticated, completeProfile);

module.exports = router;