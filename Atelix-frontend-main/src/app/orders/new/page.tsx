"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import { measurementApi, orderApi, tailorApi, errMsg } from "@/lib/api";
import type { Measurement, Tailor } from "@/types";
import { CLOTHING_TYPES, formatPrice } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import StarRating from "@/components/StarRating";

function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [loading, setLoading] = useState(true);

  const [measurementId, setMeasurementId] = useState("");
  const [tailorId, setTailorId] = useState(searchParams.get("tailor") || "");
  const [tailorQuery, setTailorQuery] = useState("");
  const [clothingType, setClothingType] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [m, t] = await Promise.all([measurementApi.list(), tailorApi.list({ sort: "rating" })]);
        const mList: Measurement[] = m.items || [];
        const tList: Tailor[] = t.items || [];
        setMeasurements(mList);
        setTailors(tList);
        if (mList[0]) setMeasurementId(mList[0]._id);
      } catch (e) {
        toast.error(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredTailors = tailors.filter((t) => {
    const q = tailorQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (t.shopName || "").toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      (t.city || "").toLowerCase().includes(q)
    );
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!measurementId) return toast.error("O'lchovni tanlang");
    if (!tailorId) return toast.error("Tikuvchini tanlang");
    if (!clothingType) return toast.error("Kiyim turini tanlang");

    setSubmitting(true);
    try {
      const res = await orderApi.create({ tailorId, clothingType, notes: notes.trim(), measurementId });
      toast.success("Buyurtma yuborildi!");
      router.push(`/orders/${res.order._id}`);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent" />
        </div>
      </>
    );
  }

  if (measurements.length === 0) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
          <div className="card text-center py-12">
            <h2 className="text-xl font-semibold">Avval o'lchov kiriting</h2>
            <p className="mt-2 text-ink-600">Buyurtma berish uchun kamida bitta o'lchov bo'lishi kerak.</p>
            <Link href="/measurements/new" className="mt-6 inline-flex btn-primary">
              O'lchov kiritish
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-ink-500 hover:text-ink-900">← Asosiy</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Yangi buyurtma</h1>
          <p className="mt-1 text-ink-600">Tikuvchi va kiyim turini tanlang.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between gap-3">
              <label className="label mb-0">Tikuvchi</label>
              <Link href="/tailors" className="text-xs text-ink-500 hover:text-ink-900">Katalogni ochish →</Link>
            </div>
            {tailors.length === 0 ? (
              <p className="text-sm text-ink-500 mt-2">Hozircha tizimda tikuvchilar yo'q.</p>
            ) : (
              <>
                <input
                  className="input mt-3"
                  placeholder="Tikuvchini nomi yoki shahri bo'yicha qidiring..."
                  value={tailorQuery}
                  onChange={(e) => setTailorQuery(e.target.value)}
                />
                <div className="mt-3 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {filteredTailors.length === 0 ? (
                    <p className="text-sm text-ink-500 py-4 text-center">Mos tikuvchi topilmadi.</p>
                  ) : (
                    filteredTailors.map((t) => (
                      <label
                        key={t._id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                          tailorId === t._id ? "border-ink-900 bg-ink-50" : "border-ink-200 hover:border-ink-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tailor"
                          value={t._id}
                          checked={tailorId === t._id}
                          onChange={() => setTailorId(t._id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium truncate">{t.shopName || t.name}</div>
                            <span className="shrink-0 text-sm font-medium text-ink-900">
                              {t.priceFrom ? `${formatPrice(t.priceFrom)} dan` : ""}
                            </span>
                          </div>
                          <div className="text-sm text-ink-500">{t.name}{t.city ? ` · ${t.city}` : ""}</div>
                          <div className="mt-1 flex items-center gap-3">
                            <StarRating value={t.ratingAvg || 0} count={t.ratingCount || 0} />
                            {t.experienceYears ? (
                              <span className="text-xs text-ink-400">{t.experienceYears} yil tajriba</span>
                            ) : null}
                          </div>
                          {t.bio && <div className="mt-1 text-xs text-ink-500 line-clamp-1">{t.bio}</div>}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <div className="card">
            <label className="label">Kiyim turi</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CLOTHING_TYPES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setClothingType(c.value)}
                  className={`rounded-xl border p-3 text-sm font-medium transition ${
                    clothingType === c.value ? "border-ink-900 bg-ink-900 text-ink-50" : "border-ink-200 hover:border-ink-400"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label htmlFor="measurement" className="label">O'lchov</label>
            <select
              id="measurement"
              className="input"
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
            >
              {measurements.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.title} · {new Date(m.createdAt).toLocaleDateString("uz-UZ")}
                </option>
              ))}
            </select>
            <p className="helper">Tanlangan o'lchov buyurtmaga biriktiriladi (snapshot saqlanadi).</p>
          </div>

          <div className="card">
            <label htmlFor="notes" className="label">Izoh (ixtiyoriy)</label>
            <textarea
              id="notes"
              className="input min-h-[100px] resize-y"
              maxLength={1000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Mato turi, rang, qo'shimcha xohishlar..."
            />
            <p className="helper">{notes.length}/1000</p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Bekor qilish
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Yuborilmoqda..." : "Buyurtma yuborish"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default function Page() {
  return (
    <RoleGuard allow={["customer"]}>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent" /></div>}>
        <Content />
      </Suspense>
    </RoleGuard>
  );
}
