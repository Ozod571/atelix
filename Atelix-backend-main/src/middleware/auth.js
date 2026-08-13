/**
 * JWT auth + role middleware
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "atelix-dev-secret-change-me";

/** Token majburiy: faqat tizimga kirgan foydalanuvchilar */
async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Avval tizimga kiring" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Foydalanuvchi topilmadi" });
    if (!user.isActive) return res.status(403).json({ error: "Hisob bloklangan" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Sessiya muddati tugagan, qayta kiring" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token noto'g'ri" });
    }
    next(err);
  }
}

/** Faqat ma'lum rollarga ruxsat */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Bu amal uchun ruxsat yo'q" });
    }
    next();
  };
}

module.exports = { protect, requireRole, JWT_SECRET };
