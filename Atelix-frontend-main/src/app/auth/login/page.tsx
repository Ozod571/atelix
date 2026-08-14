"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { errMsg } from "@/lib/api";
import Logo from "@/components/Logo";
import PhoneInput from "@/components/PhoneInput";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (phone.length !== 9) next.phone = "Raqamni to'liq kiriting";
    if (!password) next.password = "Parolni kiriting";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const user = await login(phone, password);
      toast.success("Xush kelibsiz!");
      router.push(user.role === "tailor" ? "/tailor" : "/dashboard");
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="glow -top-40 left-[-15%] h-[460px] w-[460px] bg-accent/40" aria-hidden="true" />
      <div className="glow -bottom-40 right-[-15%] h-[420px] w-[420px] bg-teal/30" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo size={40} />
        </Link>

        <div className="glass animate-fade-up rounded-[30px] p-7 shadow-ios-lg ring-1 ring-ink-200/60">
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-ink-900">Tizimga kirish</h1>
          <p className="mt-1.5 text-[15px] text-ink-500">Telefon raqamingiz bilan kiring.</p>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="phone" className="label">
                Telefon raqam
              </label>
              <PhoneInput value={phone} onChange={setPhone} autoComplete="tel" />
              {errors.phone && <p className="mt-1.5 text-[13px] font-medium text-danger">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Parol
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  className="input pr-24"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                >
                  {showPw ? "Yashirish" : "Ko'rsatish"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-[13px] font-medium text-danger">{errors.password}</p>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>

          <p className="mt-6 text-center text-[14.5px] text-ink-600">
            Hisobingiz yo&apos;qmi?{" "}
            <Link href="/auth/register" className="font-semibold text-accent">
              Ro&apos;yxatdan o&apos;ting
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
