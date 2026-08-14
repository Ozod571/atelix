"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { fileToCompressedDataURL } from "@/lib/image";

interface Props {
    value?: string;
  onChange?: (dataUrl: string | null) => void;
    gallery?: boolean;
  images?: string[];
  onImagesChange?: (imgs: string[]) => void;
  maxImages?: number;
  label?: string;
  shape?: "circle" | "square";
}

export default function ImageUpload({
  value,
  onChange,
  gallery = false,
  images = [],
  onImagesChange,
  maxImages = 8,
  label = "Rasm yuklash",
  shape = "square",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      if (gallery) {
        const room = Math.max(0, maxImages - images.length);
        const chosen = Array.from(files).slice(0, room);
        const encoded = await Promise.all(chosen.map((f) => fileToCompressedDataURL(f)));
        onImagesChange?.([...images, ...encoded]);
        if (files.length > room) toast(`Ko'pi bilan ${maxImages} ta rasm`, { icon: "ℹ️" });
      } else {
        const encoded = await fileToCompressedDataURL(files[0]);
        onChange?.(encoded);
      }
    } catch (e: any) {
      toast.error(e?.message || "Rasmni yuklab bo'lmadi");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={gallery}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {gallery ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-ink-200">
              <img src={src} alt={`Rasm ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onImagesChange?.(images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-ink-900/80 px-2 py-0.5 text-xs text-ink-50 opacity-0 transition group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={pick}
              disabled={busy}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-ink-300 text-ink-400 transition hover:border-ink-900 hover:text-ink-900"
            >
              {busy ? "..." : "＋"}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div
            className={`flex h-20 w-20 items-center justify-center overflow-hidden bg-ink-100 ring-1 ring-ink-200 ${
              shape === "circle" ? "rounded-full" : "rounded-xl"
            }`}
          >
            {value ? (

              <img src={value} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl text-ink-300">🖼️</span>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={pick} disabled={busy} className="btn-secondary">
              {busy ? "Yuklanmoqda..." : label}
            </button>
            {value && (
              <button type="button" onClick={() => onChange?.(null)} className="btn-ghost text-rose-600">
                O'chirish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
