const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: [true, "Baho majburiy"],
      min: [1, "Baho 1 dan 5 gacha bo'lishi kerak"],
      max: [5, "Baho 1 dan 5 gacha bo'lishi kerak"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Sharh juda uzun"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ tailor: 1, createdAt: -1 });

reviewSchema.statics.recomputeTailorRating = async function (tailorId) {
  const User = mongoose.model("User");
  const agg = await this.aggregate([
    { $match: { tailor: new mongoose.Types.ObjectId(tailorId) } },
    { $group: { _id: "$tailor", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const { avg = 0, count = 0 } = agg[0] || {};
  await User.findByIdAndUpdate(tailorId, {
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
};

module.exports = mongoose.model("Review", reviewSchema);
