"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { errMsg } from "@/lib/api";
import Logo from "@/components/Logo";

type Role = "customer" | "tailor";

const ROLES: { value: Role; title: string; desc: string; icon: string }[] = [
  { value: "customer", title: "Mijoz", desc: "Kiyim buyurtma qilaman", icon: "🧍" },
  { value: "tailor", title: "Tikuvchi", desc: "Kiyim tikaman", icon: "✂️" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Ismingizni kiriting");
    if (!phone.trim()) return toast.error("Telefon raqamingizni kiriting");
    if (password.length < 6) return toast.error("Parol kamida 6 ta belgi bo'lishi kerak");

    try {
      const user = await register({ name, phone, password, role });
      if (user.role === "tailor") {
        toast.success("Xush kelibsiz! Endi profilingizni to'ldiring.");
        router.push("/tailor/profile");
      } else {
        toast.success("Hisob yaratildi!");
        router.push("/dashboard");
      }
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo size={40} />
        </Link>

        <div className="card">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Hisob yaratish</h1>
          <p className="mt-1 text-sm text-ink-500">Telefon raqamingiz bilan bir daqiqada.</p>

          {/* Rol tanlash — katta, tushunarli kartalar */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  role === r.value
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-ink-200 hover:border-ink-400"
                }`}
              >
                <div className="text-2xl">{r.icon}</div>
                <div className="mt-2 font-semibold text-ink-900">{r.title}</div>
                <div className="text-xs text-ink-500">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Ism familiya</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Karimov"
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className="label">Telefon raqam</label>
              <input
                type="tel"
                inputMode="tel"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                autoComplete="tel"
                required
              />
              <p className="helper">Shu raqam bilan tizimga kirasiz.</p>
            </div>

            <div>
              <label className="label">Parol</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="input pr-16"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink-500 hover:text-ink-900"
                >
                  {showPw ? "Yashirish" : "Ko'rsatish"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? "Yaratilmoqda..." : "Hisob yaratish"}
            </button>
          </form>

          {role === "tailor" && (
            <p className="mt-4 rounded-xl bg-ink-100 px-4 py-3 text-xs text-ink-600">
              Ro'yxatdan o'tgach, do'kon nomi, narx va ish namunalaringizni profil sahifasida qo'shasiz.
            </p>
          )}

          <p className="mt-6 text-center text-sm text-ink-600">
            Hisobingiz bormi?{" "}
            <Link href="/auth/login" className="font-medium text-accent underline underline-offset-2">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
