"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import EmptyState from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import Icon from "@/components/Icon";
import { measurementApi, orderApi, errMsg } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Measurement, Order } from "@/types";
import { STATUS_LABELS, clothingLabel } from "@/lib/constants";
import toast from "react-hot-toast";

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-2xl bg-ink-100/70 px-3 py-2.5">
      <div className="text-[11.5px] font-medium text-ink-500">{label}</div>
      <div className="text-[15px] font-bold text-ink-900">{v} sm</div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  body,
  icon,
  tone,
}: {
  href: string;
  title: string;
  body: string;
  icon: "ruler" | "thread";
  tone: string;
}) {
  return (
    <Link href={href} className="card card-hover group flex items-center gap-4">
      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] ring-1 ${tone}`}>
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17.5px] font-bold tracking-[-0.025em] text-ink-900">{title}</span>
        <span className="mt-0.5 block text-[14px] leading-snug text-ink-500">{body}</span>
      </span>
      <span className="shrink-0 text-[20px] text-ink-300 transition duration-300 ease-ios group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </Link>
  );
}

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
  const activeCount = orders.filter((o) => o.status === "pending" || o.status === "accepted").length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-5 pb-16 pt-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(28px,4.4vw,38px)] font-extrabold text-ink-900">
              Salom, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1.5 text-[16px] text-ink-500">
              {activeCount > 0
                ? `${activeCount} ta buyurtmangiz jarayonda`
                : "Bugun nima tikdiramiz?"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ActionCard
            href="/measurements/new"
            title="O'lchov qo'shish"
            body="Tana o'lchovlaringizni kiritib, saqlang."
            icon="ruler"
            tone="bg-accent/12 text-accent ring-accent/15"
          />
          <ActionCard
            href={hasMeasurements ? "/orders/new" : "/measurements/new"}
            title="Yangi buyurtma"
            body={
              hasMeasurements
                ? "Tikuvchini tanlab, buyurtma yuboring."
                : "Avval o'lchov kiritishingiz kerak."
            }
            icon="thread"
            tone="bg-teal/16 text-teal ring-teal/22"
          />
        </div>

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-ink-900">
              Mening o&apos;lchovlarim
            </h2>
            <Link href="/measurements/new" className="text-[14.5px] font-semibold text-accent">
              + Yangi
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          ) : measurements.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon="📐"
                title="Hali o'lchovlar yo'q"
                description="Birinchi o'lchovingizni kiriting — keyin har safar bir bosishda buyurtma berasiz."
                actionLabel="O'lchov kiritish"
                actionHref="/measurements/new"
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {measurements.map((m) => (
                <Link
                  key={m._id}
                  href={`/measurements/${m._id}`}
                  className="card card-hover hover:ring-accent/50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate text-[16.5px] font-bold tracking-[-0.02em] text-ink-900">
                      {m.title}
                    </h3>
                    <span className="shrink-0 text-[12.5px] text-ink-400">
                      {new Date(m.createdAt).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>
                  <div className="mt-3.5 grid grid-cols-4 gap-2">
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

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-ink-900">
              So&apos;nggi buyurtmalar
            </h2>
            <Link href="/orders" className="text-[14.5px] font-semibold text-accent">
              Barchasi →
            </Link>
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon="🧵"
                title="Hali buyurtmalar yo'q"
                description="Tikuvchilar katalogidan o'zingizga mos ustani tanlang."
                actionLabel="Tikuvchilarni ko'rish"
                actionHref="/tailors"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((o) => (
                <Link
                  key={o._id}
                  href={`/orders/${o._id}`}
                  className="card card-hover flex items-center justify-between gap-4 hover:ring-accent/50"
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-semibold text-ink-900">
                      {clothingLabel(o.clothingType)}
                    </h3>
                    <p className="mt-0.5 truncate text-[13.5px] text-ink-500">
                      Tikuvchi:{" "}
                      {typeof o.tailor === "object" ? o.tailor.shopName || o.tailor.name : "—"}
                    </p>
                  </div>
                  <span className={`badge shrink-0 ${STATUS_LABELS[o.status].color}`}>
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

export default function DashboardPage() {
  return (
    <RoleGuard allow={["customer"]}>
      <DashboardContent />
    </RoleGuard>
  );
}
