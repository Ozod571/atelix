/**
 * Measurement — foydalanuvchi qo'lda kiritadigan tana o'lchovlari (cm)
 *
 * Maydonlar markazlashgan config/measurementFields.js dan olinadi,
 * shuning uchun yangi o'lchov qo'shish/olib tashlash uchun faqat
 * o'sha faylni o'zgartirish kifoya.
 */
const mongoose = require("mongoose");
const { MEASUREMENT_FIELDS } = require("../config/measurementFields");

// Yagona maydon validator: number, cm, min/max, majburiy
const cmField = (label, min, max) => ({
  type: Number,
  required: [true, `${label} majburiy`],
  min: [min, `${label} kamida ${min} sm bo'lishi kerak`],
  max: [max, `${label} ko'pi bilan ${max} sm bo'lishi kerak`],
});

const fieldDefs = {};
for (const f of MEASUREMENT_FIELDS) {
  fieldDefs[f.key] = cmField(f.label, f.min, f.max);
}

const measurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Mening o'lchovim",
    },

    ...fieldDefs,

    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

measurementSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Measurement", measurementSchema);
