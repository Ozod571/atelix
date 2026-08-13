"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import { measurementApi, orderApi, errMsg } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Measurement, Order } from "@/types";
import { STATUS_LABELS, clothingLabel } from "@/lib/constants";
import toast from "react-hot-toast";

function DashboardContent() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [m, o] = await Promise.all([measurementApi.list(), orderApi.mine()]);
        setMeasurements(m.items || []);
        setOrders(o.items || []);
      } catch (e) {
        toast.error(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recentOrders = orders.slice(0, 3);
  const hasMeasurements = measurements.length > 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Salom, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-ink-600">Mijoz paneli</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/measurements/new"
            className="card hover:ring-accent/60 transition group flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">O'lchov qo'shish</h3>
              <p className="mt-1 text-sm text-ink-600">
                Tana o'lchovlaringizni kiritib, saqlang.
              </p>
            </div>
            <span className="text-2xl text-ink-400 group-hover:text-ink-900">→</span>
          </Link>

          <Link
            href={hasMeasurements ? "/orders/new" : "/measurements/new"}
            className="card hover:ring-accent/60 transition group flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">Yangi buyurtma</h3>
              <p className="mt-1 text-sm text-ink-600">
                {hasMeasurements ? "Tikuvchini tanlab, buyurtma yuboring." : "Avval o'lchov kiritishingiz kerak."}
              </p>
            </div>
            <span className="text-2xl text-ink-400 group-hover:text-ink-900">→</span>
          </Link>
        </div>

        {/* Measurements */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Mening o'lchovlarim</h2>
            <Link href="/measurements/new" className="text-sm text-ink-600 hover:text-ink-900">
              + Yangi
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 card text-sm text-ink-500">Yuklanmoqda...</div>
          ) : measurements.length === 0 ? (
            <div className="mt-4 card text-center py-10">
              <p className="text-ink-600">Hali o'lchovlar yo'q</p>
              <Link href="/measurements/new" className="mt-4 inline-flex btn-primary">
                Birinchi o'lchovni kiritish
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurements.map((m) => (
                <Link
                  key={m._id}
                  href={`/measurements/${m._id}`}
                  className="card hover:ring-accent/60 transition"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold">{m.title}</h3>
                    <span className="text-xs text-ink-400">
                      {new Date(m.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                    <Stat label="Ko'krak" v={m.chest} />
                    <Stat label="Bel" v={m.waist} />
                    <Stat label="Bo'ksa" v={m.hips} />
                    <Stat label="Yelka" v={m.shoulderWidth} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent orders */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Yaqinda yuborilgan buyurtmalar</h2>
            <Link href="/orders" className="text-sm text-ink-600 hover:text-ink-900">
              Barchasi →
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 card text-sm text-ink-500">Yuklanmoqda...</div>
          ) : recentOrders.length === 0 ? (
            <div className="mt-4 card text-center py-10">
              <p className="text-ink-600">Hali buyurtmalar yo'q</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((o) => (
                <Link
                  key={o._id}
                  href={`/orders/${o._id}`}
                  className="card flex items-center justify-between hover:ring-accent/60 transition"
                >
                  <div>
                    <h3 className="font-medium">{clothingLabel(o.clothingType)}</h3>
                    <p className="mt-1 text-sm text-ink-500">
                      Tikuvchi: {typeof o.tailor === "object" ? (o.tailor.shopName || o.tailor.name) : "—"}
                    </p>
                  </div>
                  <span className={`badge ${STATUS_LABELS[o.status].color}`}>
                    {STATUS_LABELS[o.status].label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="text-ink-500">{label}</div>
      <div className="font-semibold text-ink-900">{v} sm</div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard allow={["customer"]}>
      <DashboardContent />
    </RoleGuard>
  );
}
