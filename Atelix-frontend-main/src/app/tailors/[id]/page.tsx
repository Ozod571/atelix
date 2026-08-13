"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { tailorApi, errMsg } from "@/lib/api";
import { formatPrice } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import type { Tailor, Review } from "@/types";

export default function TailorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, initialized, bootstrap } = useAuth();

  const [tailor, setTailor] = useState<Tailor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  useEffect(() => {
    (async () => {
      try {
        const res = await tailorApi.get(id);
        setTailor(res.tailor);
        setReviews(res.reviews || []);
      } catch (e) {
        toast.error(errMsg(e));
        router.push("/tailors");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

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
  if (!tailor) return null;

  const canOrder = user?.role === "customer";
  const orderHref = user ? "/orders/new" : "/auth/register";

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <Link href="/tailors" className="text-sm text-ink-500 hover:text-ink-900">← Katalog</Link>

        {/* Sarlavha */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-5">
          {tailor.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tailor.avatar} alt={tailor.shopName || tailor.name} className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-ink-200" />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-white text-2xl font-semibold">
              {(tailor.shopName || tailor.name).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight">{tailor.shopName || tailor.name}</h1>
            <p className="mt-1 text-ink-600">
              {tailor.name}{tailor.city ? ` · ${tailor.city}` : ""}
            </p>
            <div className="mt-2">
              <StarRating value={tailor.ratingAvg || 0} count={tailor.ratingCount || 0} size="md" />
            </div>
          </div>
        </div>

        {/* Ma'lumot kartalari */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Info label="Tajriba" value={tailor.experienceYears ? `${tailor.experienceYears} yil` : "—"} />
          <Info label="Boshlang'ich narx" value={tailor.priceFrom ? formatPrice(tailor.priceFrom) : "Kelishiladi"} />
          <Info label="Sharhlar" value={String(tailor.ratingCount || 0)} />
        </div>

        {tailor.bio && (
          <div className="mt-6 card">
            <h2 className="text-lg font-semibold">Usta haqida</h2>
            <p className="mt-2 text-ink-700 whitespace-pre-wrap">{tailor.bio}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {user?.role === "tailor" ? null : (
            <Link href={orderHref} className="btn-primary">
              {canOrder ? "Buyurtma berish" : "Buyurtma berish uchun ro'yxatdan o'ting"}
            </Link>
          )}
          {tailor.phone && canOrder && (
            <a href={`tel:${tailor.phone}`} className="btn-secondary">📞 {tailor.phone}</a>
          )}
        </div>

        {/* Portfolio */}
        {tailor.portfolio && tailor.portfolio.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Ish namunalari</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tailor.portfolio.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square overflow-hidden rounded-xl ring-1 ring-ink-200 transition hover:opacity-90"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Namuna ${i + 1}`} className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Sharhlar */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Mijozlar sharhlari</h2>
          {reviews.length === 0 ? (
            <div className="mt-4 card text-center py-10 text-ink-500">
              Hali sharhlar yo'q. Birinchi bo'ling!
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {reviews.map((r) => {
                const cname = typeof r.customer === "object" ? r.customer.name : "Mijoz";
                return (
                  <div key={r._id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-ink-900">{cname}</div>
                      <StarRating value={r.rating} size="sm" />
                    </div>
                    {r.comment && <p className="mt-2 text-ink-700 whitespace-pre-wrap">{r.comment}</p>}
                    <p className="mt-2 text-xs text-ink-400">
                      {new Date(r.createdAt).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-ink-900">{value}</div>
    </div>
  );
}
