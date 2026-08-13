/**
 * User model — customer | tailor | admin
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ism majburiy"],
      trim: true,
      minlength: [2, "Ism kamida 2 ta belgi bo'lishi kerak"],
      maxlength: [80, "Ism juda uzun"],
    },
    email: {
      type: String,
      required: [true, "Email majburiy"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email noto'g'ri formatda"],
    },
    password: {
      type: String,
      required: [true, "Parol majburiy"],
      minlength: [6, "Parol kamida 6 ta belgi bo'lishi kerak"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "tailor", "admin"],
      default: "customer",
      index: true,
    },
    // Tikuvchilar uchun qo'shimcha profil
    shopName: { type: String, trim: true, maxlength: 120 },
    city: { type: String, trim: true, maxlength: 60 },
    bio: { type: String, trim: true, maxlength: 500 },
    experienceYears: { type: Number, min: 0, max: 80 },
    priceFrom: { type: Number, min: 0, max: 100000000 }, // boshlang'ich narx (so'm)

    // Rasmlar (data URL sifatida saqlanadi — demo uchun; kengaytirilganda obyekt xotira)
    avatar: { type: String }, // profil rasmi
    portfolio: {
      type: [String],
      default: [],
      validate: [(arr) => arr.length <= 12, "Ko'pi bilan 12 ta rasm"],
    },

    // Reyting agregatsiyasi (sharhlardan hisoblanadi)
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// Parolni saqlashdan oldin shifrlash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Parol tekshirish
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// JSON ga aylanganda parolni olib tashlash
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
