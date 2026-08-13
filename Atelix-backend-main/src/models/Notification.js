/**
 * Notification — foydalanuvchining in-app bildirishnomalari
 *
 * Buyurtma va xabar hodisalarida yaratiladi, socket orqali real-time
 * yetkaziladi va qo'ng'iroq belgisida o'qilmagan soni ko'rsatiladi.
 */
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["order_new", "order_accepted", "order_rejected", "order_completed", "order_cancelled", "message"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
