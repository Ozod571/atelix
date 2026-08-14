"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { errMsg } from "@/lib/api";
import Logo from "@/components/Logo";
import PhoneInput from "@/components/PhoneInput";

type Role = "customer" | "tailor";

const ROLES: { value: Role; title: string; desc: string }[] = [
  { value: "customer", title: "Mijoz", desc: "Kiyim buyurtma qilaman" },
  { value: "tailor", title: "Tikuvchi", desc: "Kiyim tikaman" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [role, setRole] = useState<Role>("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Ismingizni kiriting";
    if (phone.length !== 9) next.phone = "Raqamni to'liq kiriting";
    if (password.length < 6) next.password = "Kamida 6 ta belgi bo'lishi kerak";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="glow -top-40 left-[-15%] h-[460px] w-[460px] bg-accent/40" aria-hidden="true" />
      <div className="glow -bottom-40 right-[-15%] h-[420px] w-[420px] bg-teal/30" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <Logo size={40} />
        </Link>

        <div className="glass animate-fade-up rounded-[30px] p-7 shadow-ios-lg ring-1 ring-ink-200/60">
          <h1 className="text-[26px] font-extrabold tracking-[-0.035em] text-ink-900">Hisob yaratish</h1>
          <p className="mt-1.5 text-[15px] text-ink-500">Telefon raqamingiz bilan bir daqiqada.</p>

          <div className="segmented mt-6" role="tablist">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                role="tab"
                aria-selected={role === r.value}
                data-active={role === r.value}
                onClick={() => setRole(r.value)}
                className="segmented-item"
              >
                {r.title}
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-[13px] text-ink-500">
            {ROLES.find((r) => r.value === role)?.desc}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="label">
                Ism familiya
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ali Karimov"
                autoComplete="name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1.5 text-[13px] font-medium text-danger">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Telefon raqam
              </label>
              <PhoneInput value={phone} onChange={setPhone} autoComplete="tel" />
              {errors.phone ? (
                <p className="mt-1.5 text-[13px] font-medium text-danger">{errors.phone}</p>
              ) : (
                <p className="helper">Shu raqam bilan tizimga kirasiz.</p>
              )}
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
                  placeholder="Kamida 6 ta belgi"
                  autoComplete="new-password"
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
              {isLoading ? "Yaratilmoqda..." : "Hisob yaratish"}
            </button>
          </form>

          {role === "tailor" && (
            <p className="mt-4 rounded-2xl bg-accent/8 px-4 py-3.5 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-accent/15">
              Ro&apos;yxatdan o&apos;tgach, do&apos;kon nomi, narx va ish namunalaringizni profil
              sahifasida qo&apos;shasiz.
            </p>
          )}

          <p className="mt-6 text-center text-[14.5px] text-ink-600">
            Hisobingiz bormi?{" "}
            <Link href="/auth/login" className="font-semibold text-accent">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
