/**
 * /api/measurements — mijozlar o'lchovlarini boshqaradi
 */
const express = require("express");
const Measurement = require("../models/Measurement");
const { protect, requireRole } = require("../middleware/auth");
const { MEASUREMENT_KEYS } = require("../config/measurementFields");

const router = express.Router();

// Customer-only
router.use(protect, requireRole("customer", "admin"));

// Qabul qilinadigan maydonlar: meta + markazlashgan o'lchovlar
const FIELDS = ["title", ...MEASUREMENT_KEYS, "notes"];

// O'lchov ro'yxati
router.get("/", async (req, res, next) => {
  try {
    const items = await Measurement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
});

// Eng oxirgi o'lchovni olish (forma uchun qulay)
router.get("/latest", async (req, res, next) => {
  try {
    const item = await Measurement.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
});

// Bitta o'lchov
router.get("/:id", async (req, res, next) => {
  try {
    const item = await Measurement.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ error: "O'lchov topilmadi" });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
});

// Yangi o'lchov yaratish
router.post("/", async (req, res, next) => {
  try {
    const data = { user: req.user._id };
    for (const k of FIELDS) if (req.body[k] !== undefined) data[k] = req.body[k];

    const item = await Measurement.create(data);
    res.status(201).json({ success: true, item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0]?.message || "Ma'lumot noto'g'ri";
      return res.status(400).json({ error: first });
    }
    next(err);
  }
});

// Tahrirlash
router.put("/:id", async (req, res, next) => {
  try {
    const item = await Measurement.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ error: "O'lchov topilmadi" });

    for (const k of FIELDS) if (req.body[k] !== undefined) item[k] = req.body[k];
    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0]?.message || "Ma'lumot noto'g'ri";
      return res.status(400).json({ error: first });
    }
    next(err);
  }
});

// O'chirish
router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Measurement.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) return res.status(404).json({ error: "O'lchov topilmadi" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
