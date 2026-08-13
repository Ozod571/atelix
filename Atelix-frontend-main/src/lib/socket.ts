/**
 * Socket.io client — bitta ulanish butun sessiya davomida qayta ishlatiladi
 */
import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("atelix_token");
  if (!token) return null;

  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(API_BASE, {
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  } else {
    // Token yangilangan bo'lishi mumkin
    socket.auth = { token };
    if (!socket.connected) socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
