const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("./config");
const { HttpError } = require("./errors");

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const safeEqual = (a, b) => crypto.timingSafeEqual(sha(a), sha(b));

// Public, read-only demo account for the portfolio. Its password is public by design: the demo
// role sees only the sample inquiries from `npm run seed:demo` and every write returns 403.
// It works only when DEMO_LOGIN=true.
const DEMO_EMAIL = "demo@netprogroup.az";
const DEMO_PASSWORD = "demo1234";
const DEMO_WRITE_MESSAGE = "Demo rejimi: dəyişikliklər saxlanmır. Bu hesab yalnız baxış üçündür.";

// One admin account, configured with ADMIN_EMAIL / ADMIN_PASSWORD env vars.
function login(email, password) {
  const mail = String(email || "").trim().toLowerCase();
  if (config.jwtSecret && config.demoLogin && safeEqual(mail, DEMO_EMAIL) && safeEqual(password || "", DEMO_PASSWORD)) {
    return jwt.sign({ sub: DEMO_EMAIL, role: "demo" }, config.jwtSecret, { expiresIn: "2h" });
  }
  if (!config.jwtSecret || !config.adminEmail || !config.adminPassword) {
    throw new HttpError(503, "Admin login is not configured on this server");
  }
  const okEmail = safeEqual(mail, config.adminEmail);
  const okPass = safeEqual(password || "", config.adminPassword);
  if (!okEmail || !okPass) throw new HttpError(401, "Invalid email or password");
  return jwt.sign({ sub: config.adminEmail, role: "admin" }, config.jwtSecret, { expiresIn: "8h" });
}

// Lets in the admin and the read-only demo role (req.isDemo tells them apart).
function requireAdmin(req, _res, next) {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token || !config.jwtSecret) return next(new HttpError(401, "Admin token required"));
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role === "demo" && !config.demoLogin) throw new Error("demo off");
    if (payload.role !== "admin" && payload.role !== "demo") throw new Error("role");
    req.admin = payload;
    req.isDemo = payload.role === "demo";
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

// Put after requireAdmin on every write: the demo role gets a friendly 403 the admin UI shows as a toast.
function blockDemo(req, _res, next) {
  if (req.isDemo) return next(new HttpError(403, DEMO_WRITE_MESSAGE, undefined));
  next();
}

module.exports = { login, requireAdmin, blockDemo, DEMO_EMAIL, DEMO_PASSWORD };
