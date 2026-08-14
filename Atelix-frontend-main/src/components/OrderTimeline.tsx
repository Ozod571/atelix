"use client";
import type { Order } from "@/types";

interface Props {
  order: Order;
}

const fmt = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("uz-UZ", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export default function OrderTimeline({ order }: Props) {
  if (order.status === "rejected" || order.status === "cancelled") {
    const rejected = order.status === "rejected";
    return (
      <div className="card">
        <h2 className="text-[17px] font-bold tracking-[-0.03em]">Holat</h2>
        <div className="mt-5 flex items-center gap-3.5">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-[15px] text-lg text-accent-fg ${
              rejected ? "bg-danger" : "bg-ink-400"
            }`}
          >
            ✕
          </span>
          <div>
            <div className="text-[15.5px] font-semibold text-ink-900">
              {rejected ? "Rad etildi" : "Bekor qilindi"}
            </div>
            <div className="text-[13px] text-ink-500">
              {rejected ? "Tikuvchi buyurtmani qabul qilmadi" : "Mijoz buyurtmani bekor qildi"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = order.status === "pending" ? 0 : order.status === "accepted" ? 1 : 2;

  const steps = [
    { label: "Yuborildi", hint: "Buyurtma tikuvchiga yetkazildi", at: order.createdAt },
    { label: "Qabul qilindi", hint: "Tikuvchi ishni boshladi", at: order.acceptedAt },
    { label: "Tayyor", hint: "Kiyim topshirishga tayyor", at: order.completedAt },
  ];

  return (
    <div className="card">
      <h2 className="text-[17px] font-bold tracking-[-0.03em]">Buyurtma holati</h2>

      <ol className="mt-6 space-y-1">
        {steps.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          const isLast = i === steps.length - 1;

          return (
            <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[17px] top-9 h-full w-[2px] rounded-full transition-colors duration-500 ease-ios ${
                    done ? "bg-accent" : "bg-ink-200"
                  }`}
                  aria-hidden="true"
                />
              )}

              <span
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition duration-300 ease-ios ${
                  done
                    ? "bg-grad text-accent-fg"
                    : current
                      ? "animate-ring bg-grad text-accent-fg"
                      : "bg-ink-100 text-ink-400 ring-1 ring-ink-200"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>

              <div className="min-w-0 pt-1">
                <div
                  className={`text-[15.5px] font-semibold ${
                    done || current ? "text-ink-900" : "text-ink-400"
                  }`}
                >
                  {s.label}
                </div>
                <div className="mt-0.5 text-[13px] text-ink-500">
                  {s.at && (done || current) ? fmt(s.at) : s.hint}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
