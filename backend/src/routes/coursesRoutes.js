const express = require("express");
const router = express.Router();
const { listPublicCourses } = require("../controllers/courseController");

router.get("/", listPublicCourses);

module.exports = router;
