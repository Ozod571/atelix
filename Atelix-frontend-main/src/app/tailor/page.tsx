"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import { orderApi, errMsg } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Order, User } from "@/types";
import { STATUS_LABELS, clothingLabel } from "@/lib/constants";
import toast from "react-hot-toast";

const FILTERS: { value: string; label: string }[] = [
  { value: "",          label: "Barchasi" },
  { value: "pending",   label: "Yangi" },
  { value: "accepted",  label: "Bajarilmoqda" },
  { value: "completed", label: "Tayyor" },
  { value: "rejected",  label: "Rad etilgan" },
];

function Content() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (status: string) => {
    setLoading(true);
    try {
      const res = await orderApi.incoming(status || undefined);
      setOrders(res.items || []);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(filter); }, [filter]);

  const stats = {
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Tikuvchi paneli</h1>
            <p className="mt-1 text-ink-600">
              {user?.shopName || user?.name} · Kelgan buyurtmalar
            </p>
          </div>
          <div className="flex gap-2">
            {user?._id && <Link href={`/tailors/${user._id}`} className="btn-secondary">Profilim</Link>}
            <Link href="/tailor/profile" className="btn-primary">Profilni tahrirlash</Link>
          </div>
        </div>

        {/* Stats */}
        {filter === "" && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            <StatCard label="Yangi" value={stats.pending} />
            <StatCard label="Bajarilmoqda" value={stats.accepted} />
            <StatCard label="Tayyor" value={stats.completed} />
          </div>
        )}

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ring-1 ${
                filter === f.value
                  ? "bg-ink-900 text-ink-50 ring-ink-900"
                  : "bg-surface text-ink-700 ring-ink-200 hover:bg-ink-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-6">
          {loading ? (
            <div className="card text-sm text-ink-500">Yuklanmoqda...</div>
          ) : orders.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-ink-600">
                {filter === "" ? "Hali buyurtmalar yo'q" : "Bu kategoriyada buyurtma yo'q"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const c = typeof o.customer === "object" ? (o.customer as User) : null;
                return (
                  <Link
                    key={o._id}
                    href={`/orders/${o._id}`}
                    className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:ring-accent/60 transition"
                  >
                    <div>
                      <h3 className="font-semibold text-ink-900">{clothingLabel(o.clothingType)}</h3>
                      <p className="mt-1 text-sm text-ink-600">
                        Mijoz: {c?.name || "—"}{c?.phone ? ` · ${c.phone}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-ink-400">
                        {new Date(o.createdAt).toLocaleString("uz-UZ")}
                      </p>
                    </div>
                    <span className={`badge self-start ${STATUS_LABELS[o.status].color}`}>
                      {STATUS_LABELS[o.status].label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

export default function TailorPage() {
  return (
    <RoleGuard allow={["tailor"]}>
      <Content />
    </RoleGuard>
  );
}
