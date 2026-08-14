"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { orderApi, errMsg } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";

interface Props {
  orderId: string;
  currentUserId: string;
}

export default function OrderChat({ orderId, currentUserId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const senderId = (m: ChatMessage) => (typeof m.sender === "object" ? m.sender._id : m.sender);
  const senderName = (m: ChatMessage) => (typeof m.sender === "object" ? m.sender.name : "Foydalanuvchi");

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.messages(orderId);
        setMessages(res.items || []);
      } catch (e) {
        toast.error(errMsg(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      setOnline(true);
      socket.emit("order:join", orderId, (ack: { ok?: boolean; error?: string }) => {
        if (ack?.error) toast.error(ack.error);
      });
    };
    const onDisconnect = () => setOnline(false);
    const onNew = (msg: ChatMessage) => {
      if (msg.order === orderId) {
        addMessage(msg);
        setTypingName(null);
      }
    };
    const onTyping = ({ name }: { name: string }) => {
      setTypingName(name);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTypingName(null), 2500);
    };

    if (socket.connected) onConnect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message:new", onNew);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message:new", onNew);
      socket.off("typing", onTyping);
    };
  }, [orderId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingName]);

  const send = async () => {
    const clean = text.trim();
    if (!clean) return;
    setText("");

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit(
        "message:send",
        { orderId, text: clean },
        (ack: { ok?: boolean; error?: string; message?: ChatMessage }) => {
          if (ack?.error) {
            toast.error(ack.error);
            setText(clean);
          } else if (ack?.message) {
            addMessage(ack.message);
          }
        }
      );
    } else {
      try {
        const res = await orderApi.sendMessage(orderId, clean);
        if (res.message) addMessage(res.message);
      } catch (e) {
        toast.error(errMsg(e));
        setText(clean);
      }
    }
  };

  const onInput = (v: string) => {
    setText(v);
    const socket = getSocket();
    if (socket && socket.connected) socket.emit("typing", { orderId });
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold tracking-[-0.03em]">Suhbat</h2>
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              online ? "bg-success shadow-[0_0_0_4px_rgb(var(--green)/0.18)]" : "bg-ink-300"
            }`}
          />
          {online ? "Onlayn" : "Ulanmoqda..."}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 h-80 space-y-2.5 overflow-y-auto rounded-3xl bg-ink-50 p-4"
      >
        {loading ? (
          <div className="space-y-3 py-2">
            <div className="skeleton h-9 w-2/5 rounded-3xl" />
            <div className="skeleton ml-auto h-9 w-1/2 rounded-3xl" />
            <div className="skeleton h-9 w-1/3 rounded-3xl" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="text-3xl">💬</span>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
              Hali xabarlar yo&apos;q. Mato, rang yoki muddat haqida yozing.
            </p>
          </div>
        ) : (
          messages.map((m, i) => {
            const mine = senderId(m) === currentUserId;
            const prev = messages[i - 1];
            const grouped = prev && senderId(prev) === senderId(m);

            return (
              <div
                key={m._id}
                className={`animate-fade-up flex ${mine ? "justify-end" : "justify-start"} ${
                  grouped ? "mt-0.5" : "mt-3"
                }`}
              >
                <div className={`max-w-[78%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                  {!mine && !grouped && (
                    <span className="mb-1 px-3 text-[12px] font-semibold text-ink-500">
                      {senderName(m)}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 text-[15px] leading-snug ${
                      mine
                        ? "bg-grad text-accent-fg"
                        : "bg-surface text-ink-900 ring-1 ring-ink-200/80"
                    }`}
                    style={{
                      borderRadius: 20,
                      borderBottomRightRadius: mine ? 6 : 20,
                      borderBottomLeftRadius: mine ? 20 : 6,
                    }}
                  >
                    <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  </div>
                  <span className="mt-1 px-3 text-[11px] text-ink-400">
                    {new Date(m.createdAt).toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {typingName && (
          <div className="flex items-center gap-2 pl-1 pt-1">
            <span className="flex items-center gap-1 rounded-full bg-surface px-3.5 py-2.5 ring-1 ring-ink-200/80">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-ink-400"
                  style={{ animation: `bounce-dot 1.2s ${d * 0.15}s infinite ease-in-out` }}
                />
              ))}
            </span>
            <span className="text-[12.5px] text-ink-400">{typingName} yozmoqda</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          className="input max-h-32 resize-none"
          rows={1}
          maxLength={2000}
          placeholder="Xabar yozing..."
          aria-label="Xabar matni"
          value={text}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          aria-label="Xabarni yuborish"
          className="bg-grad flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full text-accent-fg transition duration-200 ease-ios disabled:opacity-35 enabled:hover:-translate-y-0.5 enabled:active:scale-95"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
