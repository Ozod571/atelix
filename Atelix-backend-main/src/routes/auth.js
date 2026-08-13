/**
 * /api/auth — register, login, me
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, JWT_SECRET } = require("../middleware/auth");
const { isDataImage } = require("../utils/image");

const router = express.Router();
const JWT_EXPIRES = process.env.JWT_EXPIRES || "30d";

const sign = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

/** Foydalanuvchi javob formati */
const respond = (res, status, user) =>
  res.status(status).json({
    success: true,
    token: sign(user._id),
    user,
  });

// ─── REGISTER ────────────────────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, role, shopName, city, bio, experienceYears, priceFrom } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Ism, email va parol kiriting" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Parol kamida 6 ta belgi bo'lishi kerak" });
    }

    const requestedRole = role === "tailor" ? "tailor" : "customer";

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const isTailor = requestedRole === "tailor";
    const toNum = (v) => {
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      role: requestedRole,
      shopName: isTailor ? shopName?.trim() : undefined,
      city: isTailor ? city?.trim() : undefined,
      bio: isTailor ? bio?.trim() : undefined,
      experienceYears: isTailor ? toNum(experienceYears) : undefined,
      priceFrom: isTailor ? toNum(priceFrom) : undefined,
    });

    respond(res, 201, user);
  } catch (err) {
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0]?.message || "Ma'lumot noto'g'ri";
      return res.status(400).json({ error: first });
    }
    next(err);
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email va parol kiriting" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Email yoki parol noto'g'ri" });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: "Hisob bloklangan" });
    }

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    respond(res, 200, user);
  } catch (err) {
    next(err);
  }
});

// ─── ME ──────────────────────────────────────────────────────────────────────
router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ─── PROFILNI YANGILASH ───────────────────────────────────────────────────────
router.put("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    const b = req.body;
    const toNum = (v) => { const n = Number(v); return Number.isNaN(n) ? undefined : n; };

    // Barcha foydalanuvchilar uchun
    if (b.name !== undefined) user.name = b.name.toString().trim();
    if (b.phone !== undefined) user.phone = b.phone.toString().trim();
    if (b.avatar !== undefined) {
      if (b.avatar === null || b.avatar === "") user.avatar = undefined;
      else if (isDataImage(b.avatar)) user.avatar = b.avatar;
      else return res.status(400).json({ error: "Avatar rasmi noto'g'ri yoki juda katta" });
    }

    // Faqat tikuvchilar uchun
    if (user.role === "tailor") {
      if (b.shopName !== undefined) user.shopName = b.shopName.toString().trim();
      if (b.city !== undefined) user.city = b.city.toString().trim();
      if (b.bio !== undefined) user.bio = b.bio.toString().trim();
      if (b.experienceYears !== undefined) user.experienceYears = toNum(b.experienceYears);
      if (b.priceFrom !== undefined) user.priceFrom = toNum(b.priceFrom);
      if (Array.isArray(b.portfolio)) {
        const imgs = b.portfolio.filter((s) => isDataImage(s)).slice(0, 12);
        user.portfolio = imgs;
      }
    }

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0]?.message || "Ma'lumot noto'g'ri";
      return res.status(400).json({ error: first });
    }
    next(err);
  }
});

module.exports = router;
