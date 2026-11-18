require("dotenv").config();

const list = (v, fallback) =>
  (v || fallback)
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);

const config = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  adminEmail: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || "",
  // Public read-only demo login (demo@netprogroup.az / demo1234) for the portfolio admin demo.
  demoLogin: process.env.DEMO_LOGIN === "true",
  corsOrigins: list(process.env.CORS_ORIGINS, "https://codelady-ship.github.io,http://localhost:3000,http://localhost:5173,http://127.0.0.1:5500"),
};

module.exports = config;
