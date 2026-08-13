/**
 * /api/notifications — in-app bildirishnomalar
 */
const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();
const isObjId = (s) => mongoose.isValidObjectId(s);

router.use(protect);

// Ro'yxat (oxirgi 50) + o'qilmagan soni
router.get("/", async (req, res, next) => {
  try {
    const [items, unread] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);
    res.json({ success: true, items, unread });
  } catch (err) { next(err); }
});

// Faqat o'qilmagan soni (yengil)
router.get("/unread-count", async (req, res, next) => {
  try {
    const unread = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ success: true, unread });
  } catch (err) { next(err); }
});

// O'qilgan deb belgilash (id berilsa bitta, aks holda hammasi)
router.post("/read", async (req, res, next) => {
  try {
    const { id } = req.body;
    const filter = { user: req.user._id, read: false };
    if (id) {
      if (!isObjId(id)) return res.status(400).json({ error: "ID noto'g'ri" });
      filter._id = id;
    }
    await Notification.updateMany(filter, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
