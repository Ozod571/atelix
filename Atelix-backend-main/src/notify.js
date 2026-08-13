/**
 * Bildirishnoma yaratish yordamchisi
 *
 * DB ga yozadi va (io berilgan bo'lsa) `user:<id>` xonasiga real-time
 * yuboradi. Xatolik yuz bersa asosiy oqimni buzmaydi — faqat log qiladi.
 */
const Notification = require("./models/Notification");

async function createNotification(io, { user, type, title, body = "", order }) {
  try {
    if (!user) return null;
    const doc = await Notification.create({ user, type, title, body, order });
    const payload = {
      _id: doc._id.toString(),
      type: doc.type,
      title: doc.title,
      body: doc.body,
      order: order ? order.toString() : undefined,
      read: false,
      createdAt: doc.createdAt,
    };
    if (io) io.to(`user:${user.toString()}`).emit("notification", payload);
    return doc;
  } catch (err) {
    console.error("[notify]", err.message);
    return null;
  }
}

module.exports = { createNotification };
