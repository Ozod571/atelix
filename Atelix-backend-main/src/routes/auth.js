/**
 * /api/auth — register, login, me
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, JWT_SECRET } = require("../middleware/auth");
const { isDataImage } = require("../utils/image");
const { normalizePhone, isValidUzPhone } = require("../utils/phone");

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

// ─── REGISTER (telefon + parol) ───────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, password, phone, role, email } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: "Ism, telefon va parol kiriting" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Parol kamida 6 ta belgi bo'lishi kerak" });
    }

    const nphone = normalizePhone(phone);
    if (!isValidUzPhone(nphone)) {
      return res.status(400).json({ error: "Telefon raqamini to'g'ri kiriting (masalan +998 90 123 45 67)" });
    }

    const requestedRole = role === "tailor" ? "tailor" : "customer";

    const exists = await User.findOne({ phone: nphone });
    if (exists) {
      return res.status(409).json({ error: "Bu telefon raqami allaqachon ro'yxatdan o'tgan" });
    }

    const user = await User.create({
      name: name.trim(),
      phone: nphone,
      password,
      role: requestedRole,
      email: email ? email.toLowerCase().trim() : undefined,
      // Tikuvchi qo'shimcha ma'lumotlarni keyin profil sahifasida to'ldiradi
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

// ─── LOGIN (telefon + parol; email bilan ham ishlaydi) ─────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { phone, email, password } = req.body;
    const identifier = phone || email;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Telefon va parol kiriting" });
    }

    // '@' bo'lsa email, aks holda telefon
    const query = String(identifier).includes("@")
      ? { email: String(identifier).toLowerCase().trim() }
      : { phone: normalizePhone(identifier) };

    const user = await User.findOne(query).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Telefon yoki parol noto'g'ri" });
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
