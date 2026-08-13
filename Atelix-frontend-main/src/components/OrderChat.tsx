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

  const senderId = (m: ChatMessage) =>
    typeof m.sender === "object" ? m.sender._id : m.sender;
  const senderName = (m: ChatMessage) =>
    typeof m.sender === "object" ? m.sender.name : "Foydalanuvchi";

  const addMessage = (msg: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
  };

  // Tarixni yuklash
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

  // Socket ulanish
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

  // Yangi xabarda pastga aylantirish
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingName]);

  const send = async () => {
    const clean = text.trim();
    if (!clean) return;
    setText("");

    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("message:send", { orderId, text: clean }, (ack: { ok?: boolean; error?: string; message?: ChatMessage }) => {
        if (ack?.error) {
          toast.error(ack.error);
          setText(clean); // qaytarib qo'yamiz
        } else if (ack?.message) {
          addMessage(ack.message);
        }
      });
    } else {
      // Socket yo'q — REST zaxira
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
    <div className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suhbat</h2>
        <span className="flex items-center gap-1.5 text-xs text-ink-500">
          <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-ink-300"}`} />
          {online ? "Onlayn" : "Ulanmoqda..."}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 h-80 overflow-y-auto rounded-xl bg-ink-50 p-4 space-y-3"
      >
        {loading ? (
          <p className="text-center text-sm text-ink-400 py-8">Yuklanmoqda...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-ink-400 py-8">
            Hali xabarlar yo'q. Mato, rang yoki muddat haqida yozing.
          </p>
        ) : (
          messages.map((m) => {
            const mine = senderId(m) === currentUserId;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  mine ? "bg-ink-900 text-ink-50" : "bg-surface text-ink-900 ring-1 ring-ink-200"
                }`}>
                  {!mine && <div className="mb-0.5 text-xs font-medium text-ink-500">{senderName(m)}</div>}
                  <div className="whitespace-pre-wrap break-words">{m.text}</div>
                  <div className={`mt-1 text-[10px] ${mine ? "text-ink-50/60" : "text-ink-400"}`}>
                    {new Date(m.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {typingName && (
          <div className="text-xs text-ink-400 italic">{typingName} yozmoqda...</div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea
          className="input min-h-[44px] max-h-32 resize-none py-2.5"
          rows={1}
          maxLength={2000}
          placeholder="Xabar yozing..."
          value={text}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button onClick={send} disabled={!text.trim()} className="btn-primary shrink-0">
          Yuborish
        </button>
      </div>
    </div>
  );
}
