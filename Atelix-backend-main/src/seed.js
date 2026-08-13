/**
 * Sample data seed
 * Foydalanish: node src/seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Measurement = require("./models/Measurement");
const Order = require("./models/Order");
const Review = require("./models/Review");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/atelix";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB ulandi");

  await User.deleteMany({});
  await Measurement.deleteMany({});
  await Order.deleteMany({});
  await Review.deleteMany({});
  console.log("🧹 Eski ma'lumotlar tozalandi");

  // Mijozlar (telefon — asosiy identifikator, 998XXXXXXXXX)
  const ali = await User.create({
    name: "Ali Karimov",
    phone: "998901112233",
    password: "parol123",
    role: "customer",
  });

  const dilnoza = await User.create({
    name: "Dilnoza Yusupova",
    phone: "998904445566",
    password: "parol123",
    role: "customer",
  });

  // Tikuvchilar
  const aziza = await User.create({
    name: "Aziza opa",
    phone: "998907778899",
    password: "parol123",
    role: "tailor",
    shopName: "Aziza Atelye",
    city: "Toshkent, Chilonzor",
    bio: "20 yillik tajribaga ega ayollar kiyimi tikuvchisi.",
    experienceYears: 20,
    priceFrom: 250000,
  });

  const sherzod = await User.create({
    name: "Sherzod aka",
    phone: "998901234567",
    password: "parol123",
    role: "tailor",
    shopName: "Elite Suit",
    city: "Toshkent, Yunusobod",
    bio: "Erkaklar kostyumi va klassik ko'ylaklar bo'yicha mutaxassis.",
    experienceYears: 12,
    priceFrom: 500000,
  });

  // Admin
  await User.create({
    name: "Admin",
    phone: "998900000000",
    password: "admin123",
    role: "admin",
  });

  // Ali uchun o'lchov (13 maydon, sm)
  const aliMeasurement = await Measurement.create({
    user: ali._id,
    title: "Asosiy o'lchovim",
    height: 178,
    chest: 98, chestSpan: 20, chestLength: 24,
    waist: 84, waistLength: 44,
    collar: 40,
    sleeveLength: 62, sleeveWidth: 20,
    hips: 100, hipsLength: 22,
    shoulderWidth: 46,
    pantsWidth: 24,
    notes: "Standart ko'ylak uchun",
  });

  // Dilnoza uchun o'lchov
  const dilnozaMeasurement = await Measurement.create({
    user: dilnoza._id,
    title: "Ko'ylak uchun",
    height: 165,
    chest: 88, chestSpan: 18, chestLength: 26,
    waist: 70, waistLength: 40,
    collar: 34,
    sleeveLength: 58, sleeveWidth: 16,
    hips: 96, hipsLength: 20,
    shoulderWidth: 38,
    pantsWidth: 22,
  });

  const snap = (m) => {
    const o = m.toObject();
    delete o._id;
    delete o.user;
    delete o.title;
    delete o.notes;
    delete o.createdAt;
    delete o.updatedAt;
    delete o.__v;
    return o;
  };

  // Sample orders
  await Order.create({
    customer: ali._id,
    tailor: sherzod._id,
    clothingType: "suit",
    notes: "Klassik qora kostyum, to'y uchun. 2 hafta ichida kerak.",
    measurements: snap(aliMeasurement),
    status: "pending",
  });

  const completedOrder = await Order.create({
    customer: dilnoza._id,
    tailor: aziza._id,
    clothingType: "dress",
    notes: "Uzun, oqshom uchun ko'ylak. Mato o'zimda bor.",
    measurements: snap(dilnozaMeasurement),
    status: "completed",
    price: 450000,
    acceptedAt: new Date(Date.now() - 6 * 864e5),
    completedAt: new Date(Date.now() - 1 * 864e5),
    reviewed: true,
  });

  // Sample review
  await Review.create({
    tailor: aziza._id,
    customer: dilnoza._id,
    order: completedOrder._id,
    rating: 5,
    comment: "Juda chiroyli tikildi, o'lchamlar aniq to'g'ri keldi. Rahmat!",
  });
  await Review.recomputeTailorRating(aziza._id);

  console.log("\n✅ Sample ma'lumotlar yaratildi (telefon + parol):\n");
  console.log("👤 Mijozlar:");
  console.log("   +998 90 111 22 33 / parol123");
  console.log("   +998 90 444 55 66 / parol123");
  console.log("✂️  Tikuvchilar:");
  console.log("   +998 90 777 88 99 / parol123");
  console.log("   +998 90 123 45 67 / parol123");
  console.log("👑 Admin:");
  console.log("   +998 90 000 00 00 / admin123\n");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed xatosi:", err);
  process.exit(1);
});
