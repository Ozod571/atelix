/**
 * Message — buyurtma ichidagi mijoz ↔ tikuvchi yozishuvi
 *
 * Har bir xabar bitta buyurtmaga bog'liq. Faqat o'sha buyurtmaning
 * mijozi va tikuvchisi (va admin) yozishuvni ko'ra/yubora oladi.
 */
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Xabar bo'sh bo'lmasligi kerak"],
      trim: true,
      maxlength: [2000, "Xabar juda uzun"],
    },
  },
  { timestamps: true }
);

messageSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
