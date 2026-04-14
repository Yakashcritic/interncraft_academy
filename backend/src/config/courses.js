/**
 * Internship tracks and pricing.
 * WhatsApp invite links: set matching WHATSAPP_URL_* in backend .env (full URL).
 */
const COURSE_IDS = [
  "machine-learning",
  "dsa",
  "python",
  "backend-development",
  "accounting",
  "video-editing",
  "digital-marketing",
];

const COURSE_META = {
  "machine-learning": {
    name: "Machine Learning Basics",
    description: "Learn how machines think and build intelligent models from scratch.",
    price: 149,
    strikePrice: 5999,
  },
  dsa: {
    name: "Data Structures & Algorithms",
    description:
      "Master problem-solving and crack technical interviews with confidence.",
    price: 129,
    strikePrice: 5499,
  },
  python: {
    name: "Python Programming",
    description:
      "Build a strong programming foundation with one of the most in-demand languages.",
    price: 99,
    strikePrice: 3999,
  },
  "backend-development": {
    name: "Backend Development",
    description: "Learn to build powerful server-side applications and APIs.",
    price: 129,
    strikePrice: 5499,
  },
  accounting: {
    name: "Accounting",
    description:
      "Understand financial systems, tools, and real-world business accounting.",
    price: 99,
    strikePrice: 3999,
  },
  "digital-marketing": {
    name: "Digital Marketing",
    description: "Master social media, ads, and strategies to grow any business online.",
    price: 119,
    strikePrice: 4999,
  },
  "video-editing": {
    name: "Video Editing",
    description: "Create professional content using modern editing tools and techniques.",
    price: 99,
    strikePrice: 4499,
  },
};

const WHATSAPP_ENV_KEYS = {
  "machine-learning": "WHATSAPP_URL_MACHINE_LEARNING",
  dsa: "WHATSAPP_URL_DSA",
  python: "WHATSAPP_URL_PYTHON",
  "backend-development": "WHATSAPP_URL_BACKEND_DEVELOPMENT",
  accounting: "WHATSAPP_URL_ACCOUNTING",
  "digital-marketing": "WHATSAPP_URL_DIGITAL_MARKETING",
  "video-editing": "WHATSAPP_URL_VIDEO_EDITING",
};

function whatsappUrlFor(courseId) {
  const key = WHATSAPP_ENV_KEYS[courseId];
  if (!key) return "";
  const v = process.env[key];
  return typeof v === "string" ? v.trim() : "";
}

function getPublicCourses() {
  return COURSE_IDS.map((id) => ({
    id,
    name: COURSE_META[id].name,
    description: COURSE_META[id].description,
    price: COURSE_META[id].price,
    strikePrice: COURSE_META[id].strikePrice,
  }));
}

function isValidCourseId(courseId) {
  return typeof courseId === "string" && COURSE_IDS.includes(courseId);
}

function getCourseForUser(courseId) {
  if (!isValidCourseId(courseId)) return null;
  const meta = COURSE_META[courseId];
  return {
    id: courseId,
    name: meta.name,
    description: meta.description,
    price: meta.price,
    strikePrice: meta.strikePrice,
    whatsappUrl: whatsappUrlFor(courseId) || null,
  };
}

function getCoursePrice(courseId) {
  if (!isValidCourseId(courseId)) return null;
  return COURSE_META[courseId].price;
}

module.exports = {
  COURSE_IDS,
  getPublicCourses,
  isValidCourseId,
  getCourseForUser,
  getCoursePrice,
};
