const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./middleware/auth");
const User = require("./models/User");
const Order = require("./models/Order");
const Message = require("./models/Message");
const { createNotification } = require("./notify");

function isParticipant(order, userId, role) {
  const uid = userId.toString();
  return (
    order.customer.toString() === uid ||
    order.tailor.toString() === uid ||
    role === "admin"
  );
}

function initSocket(io) {

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Avtorizatsiya talab qilinadi"));

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select("name role isActive");
      if (!user || !user.isActive) return next(new Error("Ruxsat yo'q"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Token noto'g'ri yoki muddati tugagan"));
    }
  });

  io.on("connection", (socket) => {
    const room = (orderId) => `order:${orderId}`;

    socket.join(`user:${socket.user._id.toString()}`);

    socket.on("order:join", async (orderId, cb) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) return cb?.({ error: "Buyurtma topilmadi" });
        if (!isParticipant(order, socket.user._id, socket.user.role)) {
          return cb?.({ error: "Bu suhbatga ruxsatingiz yo'q" });
        }
        socket.join(room(orderId));
        cb?.({ ok: true });
      } catch (err) {
        cb?.({ error: "Xonaga qo'shilib bo'lmadi" });
      }
    });

    socket.on("message:send", async ({ orderId, text } = {}, cb) => {
      try {
        const clean = (text || "").toString().trim().slice(0, 2000);
        if (!clean) return cb?.({ error: "Bo'sh xabar" });

        const order = await Order.findById(orderId);
        if (!order) return cb?.({ error: "Buyurtma topilmadi" });
        if (!isParticipant(order, socket.user._id, socket.user.role)) {
          return cb?.({ error: "Bu suhbatga ruxsatingiz yo'q" });
        }

        const msg = await Message.create({
          order: orderId,
          sender: socket.user._id,
          text: clean,
        });

        const payload = {
          _id: msg._id.toString(),
          order: orderId.toString(),
          text: clean,
          sender: { _id: socket.user._id.toString(), name: socket.user.name, role: socket.user.role },
          createdAt: msg.createdAt,
        };

        io.to(room(orderId)).emit("message:new", payload);
        cb?.({ ok: true, message: payload });

        const recipient = order.customer.toString() === socket.user._id.toString() ? order.tailor : order.customer;
        createNotification(io, {
          user: recipient,
          type: "message",
          title: "Yangi xabar",
          body: `${socket.user.name}: ${clean.slice(0, 60)}`,
          order: orderId,
        });
      } catch (err) {
        cb?.({ error: "Xabar yuborilmadi" });
      }
    });

    socket.on("typing", ({ orderId } = {}) => {
      if (!orderId) return;
      socket.to(room(orderId)).emit("typing", { name: socket.user.name });
    });
  });
}

module.exports = { initSocket, isParticipant };
