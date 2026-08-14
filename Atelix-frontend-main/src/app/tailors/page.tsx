"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import EmptyState from "@/components/EmptyState";
import Reveal from "@/components/Reveal";
import { ListSkeleton } from "@/components/Skeleton";
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

  useEffect(() => {
    const timer = setTimeout(async () => {
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
    }, 300);
    return () => clearTimeout(timer);
  }, [q, city, sort]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(30px,4.6vw,42px)] font-extrabold text-ink-900">
            Tikuvchilar katalogi
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-ink-500">
            Tajribali ustalarni reyting, narx va shahar bo&apos;yicha tanlang.
            O&apos;lchovlaringizni yuboring — qolganini usta hal qiladi.
          </p>
        </div>

        <div className="glass sticky top-16 z-30 -mx-5 mt-8 border-y border-ink-200/60 px-5 py-4 sm:mx-0 sm:rounded-[24px] sm:border sm:px-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              className="input"
              placeholder="Nom yoki atelye bo'yicha qidirish..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tikuvchi qidirish"
            />
            <input
              className="input sm:w-48"
              placeholder="Shahar"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Shahar bo'yicha filtr"
            />
            <select
              className="input sm:w-52"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Saralash"
            >
              {TAILOR_SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <ListSkeleton count={6} />
          ) : tailors.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Hech qanday tikuvchi topilmadi"
              description="Qidiruv shartlarini yoki shahar filtrini o'zgartirib ko'ring."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tailors.map((t, i) => (
                <Reveal key={t._id} delay={(i % 3) * 70}>
                  <Link
                    href={`/tailors/${t._id}`}
                    className="card card-hover flex h-full flex-col hover:ring-accent/50"
                  >
                    <div className="flex items-start gap-3.5">
                      {t.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.avatar}
                          alt={t.shopName || t.name}
                          className="h-12 w-12 shrink-0 rounded-[16px] object-cover ring-1 ring-ink-200"
                        />
                      ) : (
                        <div className="bg-grad flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] text-[17px] font-bold text-accent-fg">
                          {(t.shopName || t.name).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[16.5px] font-bold tracking-[-0.02em] text-ink-900">
                          {t.shopName || t.name}
                        </h3>
                        <p className="truncate text-[13.5px] text-ink-500">
                          {t.name}
                          {t.city ? ` · ${t.city}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3.5">
                      <StarRating value={t.ratingAvg || 0} count={t.ratingCount || 0} />
                    </div>

                    {t.bio && (
                      <p className="mt-3 line-clamp-2 flex-1 text-[14.5px] leading-relaxed text-ink-600">
                        {t.bio}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-ink-200/70 pt-3.5">
                      <span className="text-[13px] text-ink-500">
                        {t.experienceYears ? `${t.experienceYears} yil tajriba` : "Yangi usta"}
                      </span>
                      <span className="text-[14.5px] font-bold text-ink-900">
                        {t.priceFrom ? `${formatPrice(t.priceFrom)} dan` : "Kelishiladi"}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
