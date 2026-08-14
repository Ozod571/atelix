const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Measurement = require("../models/Measurement");
const User = require("../models/User");
const Message = require("../models/Message");
const { protect, requireRole } = require("../middleware/auth");
const { MEASUREMENT_KEYS } = require("../config/measurementFields");
const { createNotification } = require("../notify");

const isParticipant = (order, userId, role) => {
  const uid = userId.toString();
  return order.customer.toString() === uid || order.tailor.toString() === uid || role === "admin";
};

const { isDataImage } = require("../utils/image");

const CLOTHING_LABELS = { dress: "Ko'ylak", suit: "Kostyum", pants: "Shim/Lozim", shirt: "Ko'ylak (erkak)", other: "Buyurtma" };

const router = express.Router();
router.use(protect);

const isObjId = (s) => mongoose.isValidObjectId(s);
const ALLOWED_TYPES = ["dress", "suit", "pants", "shirt", "other"];

router.post("/", requireRole("customer"), async (req, res, next) => {
  try {
    const { tailorId, clothingType, notes, measurementId } = req.body;

    if (!isObjId(tailorId)) return res.status(400).json({ error: "Tikuvchini tanlang" });
    if (!ALLOWED_TYPES.includes(clothingType)) {
      return res.status(400).json({ error: "Kiyim turini to'g'ri tanlang" });
    }
    if (!isObjId(measurementId)) {
      return res.status(400).json({ error: "Avval o'lchov kiriting" });
    }

    const tailor = await User.findOne({ _id: tailorId, role: "tailor", isActive: true });
    if (!tailor) return res.status(404).json({ error: "Tikuvchi topilmadi" });

    const m = await Measurement.findOne({ _id: measurementId, user: req.user._id });
    if (!m) return res.status(404).json({ error: "O'lchov topilmadi" });

    const snapshot = {};
    for (const key of MEASUREMENT_KEYS) snapshot[key] = m[key];

    const order = await Order.create({
      customer: req.user._id,
      tailor: tailor._id,
      clothingType,
      notes: notes?.trim(),
      measurements: snapshot,
    });

    const populated = await order.populate("tailor", "name shopName city phone");

    await createNotification(req.app.get("io"), {
      user: tailor._id,
      type: "order_new",
      title: "Yangi buyurtma",
      body: `${CLOTHING_LABELS[clothingType] || "Buyurtma"} bo'yicha yangi buyurtma keldi`,
      order: order._id,
    });

    res.status(201).json({ success: true, order: populated });
  } catch (err) { next(err); }
});

router.get("/mine", requireRole("customer"), async (req, res, next) => {
  try {
    const items = await Order.find({ customer: req.user._id })
      .populate("tailor", "name shopName city phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) { next(err); }
});

router.get("/tailor/incoming", requireRole("tailor"), async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { tailor: req.user._id };
    if (status && ["pending", "accepted", "completed", "rejected"].includes(status)) {
      query.status = status;
    }
    const items = await Order.find(query)
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) {
      return res.status(400).json({ error: "ID noto'g'ri" });
    }
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("tailor", "name shopName city phone");
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });

    const uid = req.user._id.toString();
    if (order.customer._id.toString() !== uid && order.tailor._id.toString() !== uid && req.user.role !== "admin") {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

async function changeStatus(req, res, next, { allowedFrom, newStatus, allowedRole, ownerField, extra = {}, notify }) {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });

    if (order[ownerField].toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    if (allowedRole && req.user.role !== allowedRole) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    if (!allowedFrom.includes(order.status)) {
      return res.status(400).json({ error: `Bu holatda amalga oshirib bo'lmaydi (${order.status})` });
    }

    order.status = newStatus;
    Object.assign(order, extra);
    if (req.body.tailorComment !== undefined) {
      order.tailorComment = req.body.tailorComment?.toString().trim().slice(0, 500);
    }
    await order.save();

    if (notify) {
      const n = notify(order);
      if (n) await createNotification(req.app.get("io"), { ...n, order: order._id });
    }

    res.json({ success: true, order });
  } catch (err) { next(err); }
}

router.post("/:id/accept", requireRole("tailor"), (req, res, next) => {
  const extra = { acceptedAt: new Date() };
  const price = Number(req.body.price);
  if (!Number.isNaN(price) && price > 0) {
    extra.price = Math.min(Math.round(price), 100000000);
  }
  return changeStatus(req, res, next, {
    allowedFrom: ["pending"],
    newStatus: "accepted",
    allowedRole: "tailor",
    ownerField: "tailor",
    extra,
    notify: (order) => ({
      user: order.customer,
      type: "order_accepted",
      title: "Buyurtma qabul qilindi",
      body: order.price ? `Tikuvchi narx belgiladi: ${order.price.toLocaleString("ru-RU")} so'm` : "Tikuvchi buyurtmangizni qabul qildi",
    }),
  });
});

router.post("/:id/reject", requireRole("tailor"), (req, res, next) =>
  changeStatus(req, res, next, {
    allowedFrom: ["pending"],
    newStatus: "rejected",
    allowedRole: "tailor",
    ownerField: "tailor",
    notify: (order) => ({
      user: order.customer,
      type: "order_rejected",
      title: "Buyurtma rad etildi",
      body: order.tailorComment || "Tikuvchi buyurtmani rad etdi",
    }),
  })
);

router.post("/:id/complete", requireRole("tailor"), (req, res, next) =>
  changeStatus(req, res, next, {
    allowedFrom: ["accepted"],
    newStatus: "completed",
    allowedRole: "tailor",
    ownerField: "tailor",
    extra: { completedAt: new Date() },
    notify: (order) => ({
      user: order.customer,
      type: "order_completed",
      title: "Buyurtma tayyor! 🎉",
      body: "Tikuvchi buyurtmangizni tayyor deb belgiladi",
    }),
  })
);

router.post("/:id/cancel", requireRole("customer"), (req, res, next) =>
  changeStatus(req, res, next, {
    allowedFrom: ["pending"],
    newStatus: "cancelled",
    allowedRole: "customer",
    ownerField: "customer",
    notify: (order) => ({
      user: order.tailor,
      type: "order_cancelled",
      title: "Buyurtma bekor qilindi",
      body: "Mijoz buyurtmani bekor qildi",
    }),
  })
);

router.get("/:id/messages", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });
    const order = await Order.findById(req.params.id).select("customer tailor");
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
    if (!isParticipant(order, req.user._id, req.user.role)) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    const items = await Message.find({ order: order._id })
      .populate("sender", "name role")
      .sort({ createdAt: 1 })
      .limit(500);
    res.json({ success: true, items });
  } catch (err) { next(err); }
});

router.post("/:id/messages", async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });
    const clean = (req.body.text || "").toString().trim().slice(0, 2000);
    if (!clean) return res.status(400).json({ error: "Bo'sh xabar" });

    const order = await Order.findById(req.params.id).select("customer tailor");
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
    if (!isParticipant(order, req.user._id, req.user.role)) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }

    const msg = await Message.create({ order: order._id, sender: req.user._id, text: clean });
    const payload = {
      _id: msg._id.toString(),
      order: order._id.toString(),
      text: clean,
      sender: { _id: req.user._id.toString(), name: req.user.name, role: req.user.role },
      createdAt: msg.createdAt,
    };

    const io = req.app.get("io");
    if (io) io.to(`order:${order._id}`).emit("message:new", payload);

    const recipient = order.customer.toString() === req.user._id.toString() ? order.tailor : order.customer;
    await createNotification(io, {
      user: recipient,
      type: "message",
      title: "Yangi xabar",
      body: `${req.user.name}: ${clean.slice(0, 60)}`,
      order: order._id,
    });

    res.status(201).json({ success: true, message: payload });
  } catch (err) { next(err); }
});

router.post("/:id/result", requireRole("tailor"), async (req, res, next) => {
  try {
    if (!isObjId(req.params.id)) return res.status(400).json({ error: "ID noto'g'ri" });
    if (!isDataImage(req.body.image)) {
      return res.status(400).json({ error: "Rasm noto'g'ri yoki juda katta (max ~3MB)" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Buyurtma topilmadi" });
    if (order.tailor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Ruxsat yo'q" });
    }
    if (!["accepted", "completed"].includes(order.status)) {
      return res.status(400).json({ error: "Faqat qabul qilingan buyurtmaga rasm qo'shish mumkin" });
    }
    order.resultImage = req.body.image;
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
});

module.exports = router;
