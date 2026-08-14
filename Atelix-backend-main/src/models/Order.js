const mongoose = require("mongoose");
const { MEASUREMENT_KEYS } = require("../config/measurementFields");

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

    price: {
      type: Number,
      min: [0, "Narx manfiy bo'lolmaydi"],
      max: [100000000, "Narx juda katta"],
    },

    tailorComment: { type: String, trim: true, maxlength: 500 },

    resultImage: { type: String },

    reviewed: { type: Boolean, default: false },

    acceptedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ tailor: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
