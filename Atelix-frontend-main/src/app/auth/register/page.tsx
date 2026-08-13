"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { errMsg } from "@/lib/api";
import Logo from "@/components/Logo";

type Role = "customer" | "tailor";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [priceFrom, setPriceFrom] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Barcha asosiy maydonlarni to'ldiring");
      return;
    }
    if (password.length < 6) {
      toast.error("Parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }
    try {
      const user = await register({
        name, email, password, phone, role,
        ...(role === "tailor"
          ? {
              shopName, city, bio,
              experienceYears: experienceYears ? Number(experienceYears) : undefined,
              priceFrom: priceFrom ? Number(priceFrom) : undefined,
            }
          : {}),
      });
      toast.success("Hisob muvaffaqiyatli yaratildi");
      router.push(user.role === "tailor" ? "/tailor" : "/dashboard");
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
          <h1 className="text-2xl font-semibold tracking-tight">Hisob yaratish</h1>
          <p className="mt-1 text-sm text-ink-500">Kim sifatida ro'yxatdan o'tasiz?</p>

          {/* Role selector */}
          <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-ink-100 p-1">
            {(["customer", "tailor"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  role === r ? "bg-surface text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-900"
                }`}
              >
                {r === "customer" ? "Mijoz" : "Tikuvchi"}
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
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label">Telefon (ixtiyoriy)</label>
              <input
                type="tel"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div>
              <label className="label">Parol</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 6 ta belgi"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {role === "tailor" && (
              <>
                <div>
                  <label className="label">Atelye nomi</label>
                  <input
                    className="input"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Aziza Atelye"
                  />
                </div>
                <div>
                  <label className="label">Shahar / manzil</label>
                  <input
                    className="input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Toshkent, Chilonzor"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Tajriba (yil)</label>
                    <input
                      type="number"
                      min={0}
                      max={80}
                      className="input"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="Masalan: 10"
                    />
                  </div>
                  <div>
                    <label className="label">Narx (so'mdan)</label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      className="input"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      placeholder="Masalan: 250000"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Qisqacha ma'lumot (bio)</label>
                  <textarea
                    className="input min-h-[80px] resize-y"
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Qanday kiyimlar tikasiz, mutaxassisligingiz..."
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
              {isLoading ? "Yaratilmoqda..." : "Hisob yaratish"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600">
            Hisobingiz bormi?{" "}
            <Link href="/auth/login" className="font-medium text-ink-900 underline underline-offset-2">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
