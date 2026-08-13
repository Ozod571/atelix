"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { errMsg } from "@/lib/api";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email va parolni kiriting");
      return;
    }
    try {
      const user = await login(email, password);
      toast.success("Xush kelibsiz!");
      router.push(user.role === "tailor" ? "/tailor" : "/dashboard");
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo size={40} />
        </Link>

        <div className="card">
          <h1 className="text-2xl font-semibold tracking-tight">Tizimga kirish</h1>
          <p className="mt-1 text-sm text-ink-500">Email va parolingiz bilan kiring.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Parol</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Hisobingiz yo'qmi?{" "}
            <Link href="/auth/register" className="font-medium text-ink-900 underline underline-offset-2">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
