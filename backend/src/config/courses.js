/**
 * Six program tracks — edit names/descriptions here.
 * WhatsApp invite links: set matching WHATSAPP_URL_* in backend .env (full URL).
 */
const COURSE_IDS = [
  "ai-ml",
  "digital-marketing",
  "video-editing",
  "business",
  "fullstack-dev",
  "data-analytics",
];

const COURSE_META = {
  "ai-ml": {
    name: "AI & Machine Learning",
    description: "Practical AI tools, prompts, and small projects with mentor support.",
  },
  "digital-marketing": {
    name: "Digital Marketing",
    description: "Social media, ads, analytics, and campaign basics for real brands.",
  },
  "video-editing": {
    name: "Video Editing",
    description: "Editing workflow, storytelling, and portfolio-ready cuts.",
  },
  business: {
    name: "Business & Entrepreneurship",
    description: "Ideas, pitching, operations basics, and internship-ready mindset.",
  },
  "fullstack-dev": {
    name: "Full Stack Web Development",
    description: "Frontend + backend foundations with hands-on builds.",
  },
  "data-analytics": {
    name: "Data Analytics",
    description: "Spreadsheets to dashboards — patterns, charts, and insights.",
  },
};

const WHATSAPP_ENV_KEYS = {
  "ai-ml": "WHATSAPP_URL_AI_ML",
  "digital-marketing": "WHATSAPP_URL_DIGITAL_MARKETING",
  "video-editing": "WHATSAPP_URL_VIDEO_EDITING",
  business: "WHATSAPP_URL_BUSINESS",
  "fullstack-dev": "WHATSAPP_URL_FULLSTACK_DEV",
  "data-analytics": "WHATSAPP_URL_DATA_ANALYTICS",
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
    whatsappUrl: whatsappUrlFor(courseId) || null,
  };
}

module.exports = {
  COURSE_IDS,
  getPublicCourses,
  isValidCourseId,
  getCourseForUser,
};
