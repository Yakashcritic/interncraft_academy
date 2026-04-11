/**
 * Comma-separated list in ADMIN_EMAILS (e.g. "a@x.com,b@y.com").
 * Used to grant Mongo role "admin" so /admin routes and the frontend work.
 */
function parseAdminEmailList() {
  const raw = process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email) {
  if (!email || typeof email !== "string") return false;
  const normalized = email.trim().toLowerCase();
  return parseAdminEmailList().includes(normalized);
}

module.exports = { isAdminEmail, parseAdminEmailList };
