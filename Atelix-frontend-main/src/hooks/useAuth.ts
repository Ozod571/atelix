import { create } from "zustand";
import { authApi } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  initialized: boolean;

  bootstrap: () => void;
  login: (phone: string, password: string) => Promise<User>;
  register: (data: {
    name: string; phone: string; password: string;
    role?: "customer" | "tailor"; email?: string;
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

        get().refresh().catch(() => {});
        return;
      } catch {
        clear();
      }
    }
    set({ initialized: true });
  },

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login({ phone, password });
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

    }
  },

  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("atelix_user", JSON.stringify(user));
    }
    set({ user });
  },
}));
