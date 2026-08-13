"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import OrderChat from "@/components/OrderChat";
import OrderTimeline from "@/components/OrderTimeline";
import ImageUpload from "@/components/ImageUpload";
import { orderApi, reviewApi, errMsg } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Order, User, Review } from "@/types";
import { STATUS_LABELS, clothingLabel, formatPrice, MEASUREMENT_FIELDS } from "@/lib/constants";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, initialized, bootstrap } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  // Qabul qilish (narx) paneli
  const [showAccept, setShowAccept] = useState(false);
  const [priceInput, setPriceInput] = useState("");

  // Sharh
  const [review, setReview] = useState<Review | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    (async () => {
      try {
        const res = await orderApi.get(id);
        setOrder(res.order);
        if (res.order?.status === "completed") {
          try {
            const rv = await reviewApi.forOrder(id);
            setReview(rv.review || null);
          } catch { /* sharh yo'q — muammo emas */ }
        }
      } catch (e) {
        toast.error(errMsg(e));
        router.push(user.role === "tailor" ? "/tailor" : "/orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, initialized, user, router]);

  const reload = async () => {
    const res = await orderApi.get(id);
    setOrder(res.order);
  };

  const action = async (fn: () => Promise<any>, successMsg: string) => {
    setActing(true);
    try {
      await fn();
      toast.success(successMsg);
      await reload();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  const confirmAccept = async () => {
    const price = Number(priceInput);
    if (priceInput && (Number.isNaN(price) || price < 0)) {
      return toast.error("Narxni to'g'ri kiriting");
    }
    await action(() => orderApi.accept(order!._id, price > 0 ? price : undefined), "Qabul qilindi");
    setShowAccept(false);
    setPriceInput("");
  };

  const onResultImage = async (dataUrl: string | null) => {
    if (!dataUrl) return;
    setActing(true);
    try {
      const res = await orderApi.uploadResult(id, dataUrl);
      setOrder(res.order);
      toast.success("Ish rasmi yuklandi");
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  const submitReview = async () => {
    if (reviewRating < 1) return toast.error("Bahoni tanlang");
    setActing(true);
    try {
      const res = await reviewApi.create({ orderId: id, rating: reviewRating, comment: reviewComment.trim() });
      setReview(res.review);
      toast.success("Sharhingiz uchun rahmat!");
      await reload();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setActing(false);
    }
  };

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent" />
        </div>
      </>
    );
  }
  if (!order) return null;

  const isCustomer = user.role === "customer";
  const isTailor = user.role === "tailor";

  const customer = typeof order.customer === "object" ? (order.customer as User) : null;
  const tailor = typeof order.tailor === "object" ? (order.tailor as User) : null;

  const backHref = isTailor ? "/tailor" : "/orders";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <Link href={backHref} className="text-sm text-ink-500 hover:text-ink-900">← Orqaga</Link>
          <span className={`badge ${STATUS_LABELS[order.status].color}`}>
            {STATUS_LABELS[order.status].label}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{clothingLabel(order.clothingType)}</h1>
            <p className="mt-1 text-ink-500">{new Date(order.createdAt).toLocaleString("uz-UZ")}</p>
          </div>
          {order.price ? (
            <div className="text-right">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Narx</div>
              <div className="text-2xl font-semibold text-ink-900">{formatPrice(order.price)}</div>
            </div>
          ) : null}
        </div>

        {/* Parties */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Mijoz</div>
            <div className="mt-2 font-semibold">{customer?.name || "—"}</div>
            {customer?.phone && <div className="mt-1 text-sm text-ink-600">📞 {customer.phone}</div>}
            {customer?.email && <div className="text-sm text-ink-600">{customer.email}</div>}
          </div>
          <div className="card">
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Tikuvchi</div>
            <div className="mt-2 font-semibold">{tailor?.shopName || tailor?.name || "—"}</div>
            {tailor?.shopName && <div className="mt-1 text-sm text-ink-600">{tailor.name}</div>}
            {tailor?.city && <div className="text-sm text-ink-600">{tailor.city}</div>}
            {tailor?.phone && <div className="text-sm text-ink-600">📞 {tailor.phone}</div>}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <OrderTimeline order={order} />
        </div>

        {/* Tayyor ish rasmi */}
        {(order.resultImage || (isTailor && (order.status === "accepted" || order.status === "completed"))) && (
          <div className="mt-6 card">
            <h2 className="text-lg font-semibold">Tayyor ish rasmi</h2>
            {order.resultImage && (
              <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-ink-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.resultImage} alt="Tayyor ish" className="w-full object-cover" />
              </div>
            )}
            {isTailor && (order.status === "accepted" || order.status === "completed") && (
              <div className="mt-4">
                <ImageUpload
                  value={order.resultImage}
                  onChange={onResultImage}
                  label={order.resultImage ? "Rasmni almashtirish" : "Ish rasmini yuklash"}
                />
                <p className="helper">Mijoz tayyor ishingiz rasmini ko'radi.</p>
              </div>
            )}
          </div>
        )}

        {/* Measurements */}
        <div className="mt-6 card">
          <h2 className="text-lg font-semibold">O'lchovlar</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key} className="rounded-xl bg-ink-50 p-3">
                <div className="text-xs text-ink-500">{f.label}</div>
                <div className="mt-1 text-lg font-semibold text-ink-900">
                  {(order.measurements as any)[f.key] ?? "—"} <span className="text-sm font-normal text-ink-500">sm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-6 card">
            <h2 className="text-lg font-semibold">Mijoz izohi</h2>
            <p className="mt-2 text-ink-700 whitespace-pre-wrap">{order.notes}</p>
          </div>
        )}

        {order.tailorComment && (
          <div className="mt-6 card">
            <h2 className="text-lg font-semibold">Tikuvchi izohi</h2>
            <p className="mt-2 text-ink-700 whitespace-pre-wrap">{order.tailorComment}</p>
          </div>
        )}

        {/* ─── REAL-TIME CHAT (ishtirokchilar uchun) ──────────────── */}
        {order.status !== "cancelled" && order.status !== "rejected" && (
          <div className="mt-6">
            <OrderChat orderId={order._id} currentUserId={user._id} />
          </div>
        )}

        {/* ─── SHARH (mijoz, tayyor buyurtma) ─────────────────────── */}
        {order.status === "completed" && (
          <div className="mt-6 card">
            <h2 className="text-lg font-semibold">Sharh</h2>
            {review ? (
              <div className="mt-3">
                <StarRating value={review.rating} size="md" />
                {review.comment && <p className="mt-2 text-ink-700 whitespace-pre-wrap">{review.comment}</p>}
                <p className="mt-2 text-xs text-ink-400">Sharhingiz saqlangan. Rahmat!</p>
              </div>
            ) : isCustomer ? (
              <div className="mt-3 space-y-4">
                <p className="text-sm text-ink-600">Tikuvchi ishini baholang:</p>
                <StarRating value={reviewRating} size="lg" interactive onChange={setReviewRating} />
                <textarea
                  className="input min-h-[90px] resize-y"
                  maxLength={500}
                  placeholder="Ish sifati haqida fikringiz (ixtiyoriy)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
                <button onClick={submitReview} disabled={acting} className="btn-primary">
                  {acting ? "Yuborilmoqda..." : "Sharh qoldirish"}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-500">Mijoz hali sharh qoldirmagan.</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          {isTailor && order.status === "pending" && !showAccept && (
            <>
              <button onClick={() => setShowAccept(true)} disabled={acting} className="btn-primary">
                Qabul qilish
              </button>
              <button
                onClick={() => {
                  const c = prompt("Rad etish sababi (ixtiyoriy):") || undefined;
                  action(() => orderApi.reject(order._id, c), "Rad etildi");
                }}
                disabled={acting}
                className="btn text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
              >
                Rad etish
              </button>
            </>
          )}

          {isTailor && order.status === "pending" && showAccept && (
            <div className="w-full card">
              <label className="label" htmlFor="price">Narx (so'm) — ixtiyoriy, keyin ham kelishish mumkin</label>
              <input
                id="price"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                className="input"
                placeholder="Masalan: 350000"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
              <div className="mt-4 flex gap-3">
                <button onClick={confirmAccept} disabled={acting} className="btn-primary">
                  {acting ? "..." : "Tasdiqlash va qabul qilish"}
                </button>
                <button onClick={() => setShowAccept(false)} disabled={acting} className="btn-secondary">
                  Bekor qilish
                </button>
              </div>
            </div>
          )}

          {isTailor && order.status === "accepted" && (
            <button
              onClick={() => action(() => orderApi.complete(order._id), "Buyurtma tayyor deb belgilandi")}
              disabled={acting}
              className="btn-primary"
            >
              Tayyor deb belgilash
            </button>
          )}

          {isCustomer && order.status === "pending" && (
            <button
              onClick={() => {
                if (confirm("Buyurtmani bekor qilasizmi?")) {
                  action(() => orderApi.cancel(order._id), "Bekor qilindi");
                }
              }}
              disabled={acting}
              className="btn-secondary"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </main>
    </>
  );
}
