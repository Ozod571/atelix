/**
 * /api/tailors — tikuvchilar katalogi (OCHIQ, autentifikatsiyasiz)
 *
 * Storefront: mehmonlar ham tikuvchilarni ko'rib, qidira oladi.
 * Buyurtma berish esa avvalgidek tizimga kirishni talab qiladi.
 */
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const Review = require("../models/Review");

const router = express.Router();
const isObjId = (s) => mongoose.isValidObjectId(s);
const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Ro'yxatda portfolio (og'ir base64) yubormaymiz — faqat avatar
const LIST_FIELDS = "name shopName city bio phone experienceYears priceFrom ratingAvg ratingCount avatar createdAt";
const PROFILE_FIELDS = LIST_FIELDS + " portfolio";

// ─── RO'YXAT (qidiruv, shahar filtri, saralash) ────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const { q, city, sort } = req.query;
    const query = { role: "tailor", isActive: true };

    if (city && city.toString().trim()) {
      query.city = new RegExp(escapeRx(city.toString().trim()), "i");
    }
    if (q && q.toString().trim()) {
      const rx = new RegExp(escapeRx(q.toString().trim()), "i");
      query.$or = [{ name: rx }, { shopName: rx }, { bio: rx }];
    }

    let sortSpec;
    switch (sort) {
      case "price":  sortSpec = { priceFrom: 1, ratingAvg: -1 }; break;
      case "new":    sortSpec = { createdAt: -1 }; break;
      case "rating":
      default:       sortSpec = { ratingAvg: -1, ratingCount: -1, createdAt: -1 };
    }

    const items = await User.find(query)
      .select(LIST_FIELDS)
      .sort(sortSpec)
      .limit(100);

    res.json({ success: true, items });
  } catch (err) { next(err); }
});

// ─── BITTA TIKUVCHI PROFILI + oxirgi sharhlar ──────────────────────────
router.get("/:id", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });

    const tailor = await User.findOne({ _id: req.params.id, role: "tailor", isActive: true })
      .select(PROFILE_FIELDS);
    if (!tailor) return res.status(404).json({ error: "Tikuvchi topilmadi" });

    const reviews = await Review.find({ tailor: tailor._id })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, tailor, reviews });
  } catch (err) { next(err); }
});

module.exports = router;
