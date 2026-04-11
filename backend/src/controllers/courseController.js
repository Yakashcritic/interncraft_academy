const { getPublicCourses } = require("../config/courses");

const listPublicCourses = async (req, res) => {
  try {
    res.json({ success: true, courses: getPublicCourses() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { listPublicCourses };
