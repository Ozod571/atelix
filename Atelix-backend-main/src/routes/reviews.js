const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Order = require("../models/Order");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();
const isObjId = (s) => mongoose.isValidObjectId(s);

router.get("/tailor/:id", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });
    const reviews = await Review.find({ tailor: req.params.id })
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, items: reviews });
  } catch (err) { next(err); }
});

router.use(protect);

router.get("/order/:id", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });
    const review = await Review.findOne({ order: req.params.id }).populate("customer", "name");
    res.json({ success: true, review: review || null });
  } catch (err) { next(err); }
});

router.post("/", requireRole("customer"), async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!isObjId(orderId)) return res.status(400).json({ error: "Buyurtma noto'g'ri" });
    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ error: "Bahoni 1 dan 5 gacha tanlang" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Bu buyurtma sizga tegishli emas" });
    }
    if (order.status !== "completed") {
      return res.status(400).json({ error: "Faqat tayyor bo'lgan buyurtmaga sharh qoldirish mumkin" });
    }

    const exists = await Review.findOne({ order: order._id });
    if (exists) return res.status(409).json({ error: "Bu buyurtmaga allaqachon sharh qoldirilgan" });

    const review = await Review.create({
      tailor: order.tailor,
      customer: req.user._id,
      order: order._id,
      rating: r,
      comment: comment?.toString().trim().slice(0, 500),
    });

    order.reviewed = true;
    await order.save({ validateBeforeSave: false });

    await Review.recomputeTailorRating(order.tailor);

    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Bu buyurtmaga allaqachon sharh qoldirilgan" });
    }
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors)[0]?.message || "Ma'lumot noto'g'ri";
      return res.status(400).json({ error: first });
    }
    next(err);
  }
});

module.exports = router;
