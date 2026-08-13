"use client";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString("uz-UZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

export default function OrderTimeline({ order }: Props) {
  // Terminal (salbiy) holatlar — alohida ko'rsatamiz
  if (order.status === "rejected" || order.status === "cancelled") {
    const rejected = order.status === "rejected";
    return (
      <div className="card">
        <h2 className="text-lg font-semibold">Holat</h2>
        <div className="mt-4 flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${rejected ? "bg-rose-500" : "bg-ink-400"}`}>
            ✕
          </span>
          <div>
            <div className="font-medium text-ink-900">{rejected ? "Rad etildi" : "Bekor qilindi"}</div>
            <div className="text-xs text-ink-500">
              {rejected ? "Tikuvchi buyurtmani qabul qilmadi" : "Mijoz buyurtmani bekor qildi"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = order.status === "pending" ? 0 : order.status === "accepted" ? 1 : 2;
  const steps = [
    { label: "Yuborildi", at: order.createdAt },
    { label: "Qabul qilindi", at: order.acceptedAt },
    { label: "Tayyor", at: order.completedAt },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Buyurtma holati</h2>
      <div className="mt-6 flex items-start">
        {steps.map((s, i) => {
          const done = i <= activeIndex;
          const isLast = i === steps.length - 1;
          return (
            <div key={s.label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="flex flex-1 justify-end">
                  {i > 0 && <span className={`h-0.5 w-full ${i <= activeIndex ? "bg-ink-900" : "bg-ink-200"}`} />}
                </div>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                    done ? "bg-ink-900 text-ink-50" : "bg-ink-100 text-ink-400 ring-1 ring-ink-200"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="flex flex-1 justify-start">
                  {!isLast && <span className={`h-0.5 w-full ${i < activeIndex ? "bg-ink-900" : "bg-ink-200"}`} />}
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${done ? "text-ink-900" : "text-ink-400"}`}>{s.label}</div>
                {s.at && done && <div className="mt-0.5 text-[11px] text-ink-500">{fmt(s.at)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
