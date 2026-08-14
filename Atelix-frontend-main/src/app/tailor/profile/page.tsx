"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import ImageUpload from "@/components/ImageUpload";
import { authApi, errMsg } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

function Content() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    setShopName(user.shopName || "");
    setCity(user.city || "");
    setBio(user.bio || "");
    setExperienceYears(user.experienceYears != null ? String(user.experienceYears) : "");
    setPriceFrom(user.priceFrom != null ? String(user.priceFrom) : "");
    setAvatar(user.avatar || null);
    setPortfolio(user.portfolio || []);
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.updateMe({
        name, phone, shopName, city, bio,
        experienceYears: experienceYears ? Number(experienceYears) : null,
        priceFrom: priceFrom ? Number(priceFrom) : null,
        avatar: avatar || "",
        portfolio,
      });
      setUser(res.user);
      toast.success("Profil yangilandi");
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link href="/tailor" className="text-sm text-ink-500 hover:text-ink-900">← Panel</Link>
          <h1 className="mt-3 text-[clamp(28px,4.4vw,38px)] font-extrabold tracking-[-0.035em]">Profilni tahrirlash</h1>
          <p className="mt-1 text-ink-600">Bu ma'lumotlar katalogda mijozlarga ko'rinadi.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="card">
            <h2 className="text-base font-semibold">Profil rasmi</h2>
            <p className="mt-1 text-sm text-ink-500">Katalogda va profilingizda ko'rinadi.</p>
            <div className="mt-4">
              <ImageUpload value={avatar || undefined} onChange={setAvatar} shape="circle" label="Avatar tanlash" />
            </div>
          </div>

          <div className="card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Ism familiya</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="label">Telefon</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
              </div>
              <div>
                <label className="label">Atelye nomi</label>
                <input className="input" value={shopName} onChange={(e) => setShopName(e.target.value)} />
              </div>
              <div>
                <label className="label">Shahar / manzil</label>
                <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Toshkent, Chilonzor" />
              </div>
              <div>
                <label className="label">Tajriba (yil)</label>
                <input type="number" min={0} max={80} className="input" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} />
              </div>
              <div>
                <label className="label">Narx (so'mdan)</label>
                <input type="number" min={0} step={1000} className="input" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea className="input min-h-[90px] resize-y" maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Mutaxassisligingiz, qanday kiyimlar tikasiz..." />
              <p className="helper">{bio.length}/500</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-semibold">Ish namunalari (portfolio)</h2>
            <p className="mt-1 text-sm text-ink-500">Tikkan kiyimlaringiz rasmlari — mijozlar ishonchini oshiradi (max 12 ta).</p>
            <div className="mt-4">
              <ImageUpload gallery images={portfolio} onImagesChange={setPortfolio} maxImages={12} />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default function Page() {
  return (
    <RoleGuard allow={["tailor"]}>
      <Content />
    </RoleGuard>
  );
}
