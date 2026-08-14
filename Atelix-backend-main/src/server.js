const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const measurementRoutes = require("./routes/measurements");
const orderRoutes = require("./routes/orders");
const tailorRoutes = require("./routes/tailors");
const reviewRoutes = require("./routes/reviews");
const notificationRoutes = require("./routes/notifications");
const { initSocket } = require("./socket");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/atelix";
const CLIENT_URL = process.env.CLIENT_URL || "*";
const corsOrigin = CLIENT_URL === "*" ? true : CLIENT_URL.split(",");

app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Juda ko'p so'rov yuborildi. Biroz kuting." },
}));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Atelix API",
    version: "2.0.0",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tailors", tailorRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((req, res) => res.status(404).json({ error: "Sahifa topilmadi" }));

app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  if (err.name === "ValidationError") {
    const first = Object.values(err.errors)[0]?.message || "Ma'lumot xatosi";
    return res.status(400).json({ error: first });
  }
  if (err.name === "CastError") return res.status(400).json({ error: "ID noto'g'ri" });
  res.status(500).json({ error: "Server xatosi" });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: corsOrigin, credentials: true },
});
app.set("io", io);
initSocket(io);

async function start(uri = MONGODB_URI, port = PORT) {
  await mongoose.connect(uri);
  console.log("MongoDB ulandi");

  try {
    await mongoose.connection.collection("users").dropIndex("email_1");
    console.log("Eski email indeksi olib tashlandi");
  } catch (e) {
      }
  await new Promise((resolve) => {
    server.listen(port, "0.0.0.0", () => {
      console.log(`Atelix API + WebSocket: http://localhost:${port}`);
      resolve();
    });
  });
  return { app, server, io };
}

if (require.main === module) {
  start().catch((err) => {
    console.error("MongoDB xatosi:", err.message);
    process.exit(1);
  });
}

module.exports = { app, server, io, start };
