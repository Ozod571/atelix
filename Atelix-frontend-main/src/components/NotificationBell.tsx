"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { notificationApi, errMsg } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import type { AppNotification } from "@/types";

const ICONS: Record<string, string> = {
  order_new: "📥",
  order_accepted: "✅",
  order_rejected: "❌",
  order_completed: "🎉",
  order_cancelled: "🚫",
  message: "💬",
};

export default function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const res = await notificationApi.list();
      setItems(res.items || []);
      setUnread(res.unread || 0);
    } catch {
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const onNotif = (n: AppNotification) => {
      setItems((prev) => [n, ...prev].slice(0, 50));
      setUnread((u) => u + 1);
      toast(`${ICONS[n.type] || "🔔"} ${n.title}`, { duration: 4000 });
    };
    socket.on("notification", onNotif);
    return () => {
      socket.off("notification", onNotif);
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      try {
        await notificationApi.markRead();
      } catch (e) {
        toast.error(errMsg(e));
      }
    }
  };

  const openItem = (n: AppNotification) => {
    setOpen(false);
    if (n.order) router.push(`/orders/${n.order}`);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative rounded-full p-2.5 text-ink-600 transition duration-200 ease-ios hover:bg-ink-100 hover:text-ink-900 active:scale-90"
        aria-label="Bildirishnomalar"
        aria-expanded={open}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10.5px] font-bold text-white ring-2 ring-surface">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="glass animate-fade-up absolute right-0 z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[24px] shadow-ios-lg ring-1 ring-ink-200/70">
          <div className="flex items-center justify-between border-b border-ink-200/70 px-5 py-3.5">
            <span className="text-[15px] font-bold tracking-[-0.02em] text-ink-900">Bildirishnomalar</span>
            {items.length > 0 && (
              <span className="text-[12.5px] font-medium text-ink-500">{items.length}</span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <span className="text-2xl">🔔</span>
                <p className="mt-2.5 text-[14px] text-ink-500">Hali bildirishnoma yo&apos;q</p>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n._id}
                  onClick={() => openItem(n)}
                  className={`flex w-full items-start gap-3 border-b border-ink-200/50 px-5 py-3.5 text-left transition last:border-0 hover:bg-ink-100/60 ${
                    n.read ? "" : "bg-accent/[0.06]"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-ink-100 text-base">
                    {ICONS[n.type] || "🔔"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-semibold text-ink-900">{n.title}</div>
                    {n.body && <div className="mt-0.5 line-clamp-2 text-[13px] text-ink-500">{n.body}</div>}
                    <div className="mt-1 text-[11.5px] text-ink-400">
                      {new Date(n.createdAt).toLocaleString("uz-UZ")}
                    </div>
                  </div>
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
