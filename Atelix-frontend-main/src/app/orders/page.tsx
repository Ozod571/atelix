"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import { orderApi, errMsg } from "@/lib/api";
import type { Order } from "@/types";
import { STATUS_LABELS, clothingLabel } from "@/lib/constants";
import EmptyState from "@/components/EmptyState";
import toast from "react-hot-toast";

function Content() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.mine();
        setOrders(res.items || []);
      } catch (e) {
        toast.error(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-ink-500 hover:text-ink-900">← Asosiy</Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Mening buyurtmalarim</h1>
          </div>
          <Link href="/orders/new" className="btn-primary">+ Yangi buyurtma</Link>
        </div>

        {loading ? (
          <div className="mt-8 card text-sm text-ink-500">Yuklanmoqda...</div>
        ) : orders.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon="🧵"
              title="Hali buyurtmalar yo'q"
              description="O'lchovingizni tanlab, ishonchli tikuvchiga birinchi buyurtmangizni bering."
              actionLabel="Birinchi buyurtmani berish"
              actionHref="/orders/new"
            />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {orders.map((o) => (
              <Link
                key={o._id}
                href={`/orders/${o._id}`}
                className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:ring-accent/60 transition"
              >
                <div>
                  <h3 className="font-medium text-ink-900">{clothingLabel(o.clothingType)}</h3>
                  <p className="mt-1 text-sm text-ink-500">
                    Tikuvchi: {typeof o.tailor === "object" ? (o.tailor.shopName || o.tailor.name) : "—"}
                  </p>
                  <p className="mt-1 text-xs text-ink-400">
                    {new Date(o.createdAt).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <span className={`badge self-start ${STATUS_LABELS[o.status].color}`}>
                  {STATUS_LABELS[o.status].label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function Page() {
  return (
    <RoleGuard allow={["customer"]}>
      <Content />
    </RoleGuard>
  );
}
