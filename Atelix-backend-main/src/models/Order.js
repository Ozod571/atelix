/**
 * Order — mijoz tikuvchiga yuboradigan buyurtma
 *
 * Status oqimi:
 *   pending  → tikuvchi qabul qilishi kutilyapti
 *   accepted → tikuvchi qabul qildi (narx belgilanadi), ish boshlandi
 *   completed→ tayyor
 *   rejected → tikuvchi rad etdi
 *   cancelled→ mijoz bekor qildi
 *
 * O'lchovlar shu hujjat ichida snapshot sifatida saqlanadi —
 * mijoz keyinchalik o'lchovni o'zgartirsa ham, shu buyurtma o'zgarmaydi.
 */
const mongoose = require("mongoose");
const { MEASUREMENT_KEYS } = require("../config/measurementFields");

// Snapshot sxemasini markazlashgan maydon ro'yxatidan quramiz
const snapshotDef = {};
for (const key of MEASUREMENT_KEYS) snapshotDef[key] = Number;

const measurementSnapshotSchema = new mongoose.Schema(snapshotDef, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    clothingType: {
      type: String,
      enum: {
        values: ["dress", "suit", "pants", "shirt", "other"],
        message: "Kiyim turi noto'g'ri",
      },
      required: [true, "Kiyim turi tanlang"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Izoh juda uzun"],
    },

    // Buyurtma yaratilgan paytdagi o'lchovlar nusxasi
    measurements: {
      type: measurementSnapshotSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },

    // Tikuvchi qabul qilishda belgilaydigan narx (so'm)
    price: {
      type: Number,
      min: [0, "Narx manfiy bo'lolmaydi"],
      max: [100000000, "Narx juda katta"],
    },

    tailorComment: { type: String, trim: true, maxlength: 500 },

    // Tikuvchi yuklaydigan tayyor ish rasmi (data URL)
    resultImage: { type: String },

    // Mijoz buyurtma tugagach sharh qoldirganmi (tez tekshirish uchun)
    reviewed: { type: Boolean, default: false },

    acceptedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ tailor: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
