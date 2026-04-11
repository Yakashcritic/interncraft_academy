const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden: Admin only" });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { isAdmin };
