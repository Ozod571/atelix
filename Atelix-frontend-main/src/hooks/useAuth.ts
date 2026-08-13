/**
 * Zustand auth store
 */
import { create } from "zustand";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean;

  bootstrap: () => void;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string; email: string; password: string;
    phone?: string; role?: "customer" | "tailor";
    shopName?: string; city?: string; bio?: string;
    experienceYears?: number; priceFrom?: number;
  }) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
}

const persist = (token: string, user: User) => {
  localStorage.setItem("atelix_token", token);
  localStorage.setItem("atelix_user", JSON.stringify(user));
};

const clear = () => {
  localStorage.removeItem("atelix_token");
  localStorage.removeItem("atelix_user");
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  initialized: false,

  bootstrap: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("atelix_token");
    const userStr = localStorage.getItem("atelix_user");
    if (token && userStr) {
      try {
        set({ token, user: JSON.parse(userStr), initialized: true });
        // background refresh
        get().refresh().catch(() => {});
        return;
      } catch {
        clear();
      }
    }
    set({ initialized: true });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login({ email, password });
      persist(data.token, data.user);
      set({ user: data.user, token: data.token });
      return data.user;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (form) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register(form);
      persist(data.token, data.user);
      set({ user: data.user, token: data.token });
      return data.user;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    clear();
    set({ user: null, token: null });
    if (typeof window !== "undefined") window.location.href = "/";
  },

  refresh: async () => {
    try {
      const data = await authApi.me();
      localStorage.setItem("atelix_user", JSON.stringify(data.user));
      set({ user: data.user });
    } catch {
      // 401 interceptor o'zi tozalaydi
    }
  },

  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("atelix_user", JSON.stringify(user));
    }
    set({ user });
  },
}));
