"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import EmptyState from "@/components/EmptyState";
import { tailorApi, errMsg } from "@/lib/api";
import { formatPrice, TAILOR_SORTS } from "@/lib/constants";
import type { Tailor } from "@/types";
import toast from "react-hot-toast";

export default function TailorsPage() {
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [sort, setSort] = useState("rating");

  const load = async () => {
    setLoading(true);
    try {
      const res = await tailorApi.list({
        q: q.trim() || undefined,
        city: city.trim() || undefined,
        sort,
      });
      setTailors(res.items || []);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);

  }, [q, city, sort]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Tikuvchilar katalogi</h1>
          <p className="mt-2 text-ink-600">
            Tajribali tikuvchilarni reyting, narx va shahar bo'yicha tanlang. O'lchovlaringizni yuboring — qolganini usta hal qiladi.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3">
          <input
            className="input"
            placeholder="Nom yoki atelye bo'yicha qidirish..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="input sm:w-48"
            placeholder="Shahar (masalan: Toshkent)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <select className="input sm:w-52" value={sort} onChange={(e) => setSort(e.target.value)}>
            {TAILOR_SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-44 bg-ink-50" />
              ))}
            </div>
          ) : tailors.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Hech qanday tikuvchi topilmadi"
              description="Qidiruv shartlarini yoki shahar filtrini o'zgartirib ko'ring."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tailors.map((t) => (
                <Link
                  key={t._id}
                  href={`/tailors/${t._id}`}
                  className="card group flex flex-col transition hover:ring-accent/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink-900 truncate">{t.shopName || t.name}</h3>
                      <p className="text-sm text-ink-500 truncate">
                        {t.name}{t.city ? ` · ${t.city}` : ""}
                      </p>
                    </div>
                    {t.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatar} alt={t.shopName || t.name} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-ink-200" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white text-sm font-semibold">
                        {(t.shopName || t.name).charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <StarRating value={t.ratingAvg || 0} count={t.ratingCount || 0} />
                  </div>

                  {t.bio && <p className="mt-3 text-sm text-ink-600 line-clamp-2">{t.bio}</p>}

                  <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
                    <span className="text-xs text-ink-500">
                      {t.experienceYears ? `${t.experienceYears} yil tajriba` : "Yangi usta"}
                    </span>
                    <span className="text-sm font-medium text-ink-900">
                      {t.priceFrom ? `${formatPrice(t.priceFrom)} dan` : "Narx kelishiladi"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
