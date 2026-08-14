import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("atelix_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ error?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("atelix_token");
      localStorage.removeItem("atelix_user");
      const path = window.location.pathname;
      if (!path.startsWith("/auth") && path !== "/") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export const errMsg = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    return e.response?.data?.error || e.message || "Server xatosi";
  }
  return e instanceof Error ? e.message : "Xato yuz berdi";
};

export const authApi = {
  register: (d: {
    name: string; phone: string; password: string;
    role?: "customer" | "tailor"; email?: string;
  }) => api.post("/auth/register", d).then((r) => r.data),

  login: (d: { phone: string; password: string }) =>
    api.post("/auth/login", d).then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),

  updateMe: (d: Record<string, any>) => api.put("/auth/me", d).then((r) => r.data),
};

export const notificationApi = {
  list: () => api.get("/notifications").then((r) => r.data),
  unreadCount: () => api.get("/notifications/unread-count").then((r) => r.data),
  markRead: (id?: string) => api.post("/notifications/read", id ? { id } : {}).then((r) => r.data),
};

export const measurementApi = {
  list: () => api.get("/measurements").then((r) => r.data),
  latest: () => api.get("/measurements/latest").then((r) => r.data),
  get: (id: string) => api.get(`/measurements/${id}`).then((r) => r.data),
  create: (d: Record<string, any>) => api.post("/measurements", d).then((r) => r.data),
  update: (id: string, d: Record<string, any>) =>
    api.put(`/measurements/${id}`, d).then((r) => r.data),
  remove: (id: string) => api.delete(`/measurements/${id}`).then((r) => r.data),
};

export const tailorApi = {
  list: (params?: { q?: string; city?: string; sort?: string }) =>
    api.get("/tailors", { params }).then((r) => r.data),
  get: (id: string) => api.get(`/tailors/${id}`).then((r) => r.data),
};

export const reviewApi = {
  forTailor: (tailorId: string) => api.get(`/reviews/tailor/${tailorId}`).then((r) => r.data),
  forOrder: (orderId: string) => api.get(`/reviews/order/${orderId}`).then((r) => r.data),
  create: (d: { orderId: string; rating: number; comment?: string }) =>
    api.post("/reviews", d).then((r) => r.data),
};

export const orderApi = {
    tailors: (params?: { q?: string; city?: string; sort?: string }) =>
    api.get("/tailors", { params }).then((r) => r.data),
  create: (d: { tailorId: string; clothingType: string; notes?: string; measurementId: string }) =>
    api.post("/orders", d).then((r) => r.data),
  mine: () => api.get("/orders/mine").then((r) => r.data),
  incoming: (status?: string) =>
    api.get("/orders/tailor/incoming", { params: status ? { status } : {} }).then((r) => r.data),
  get: (id: string) => api.get(`/orders/${id}`).then((r) => r.data),
  accept: (id: string, price?: number) =>
    api.post(`/orders/${id}/accept`, price ? { price } : {}).then((r) => r.data),
  reject: (id: string, tailorComment?: string) =>
    api.post(`/orders/${id}/reject`, { tailorComment }).then((r) => r.data),
  complete: (id: string) => api.post(`/orders/${id}/complete`).then((r) => r.data),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`).then((r) => r.data),

  messages: (id: string) => api.get(`/orders/${id}/messages`).then((r) => r.data),
  sendMessage: (id: string, text: string) =>
    api.post(`/orders/${id}/messages`, { text }).then((r) => r.data),

  uploadResult: (id: string, image: string) =>
    api.post(`/orders/${id}/result`, { image }).then((r) => r.data),
};
