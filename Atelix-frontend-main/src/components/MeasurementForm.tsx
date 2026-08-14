"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MEASUREMENT_FIELDS, MeasurementFieldDef, MeasurementKey } from "@/lib/constants";
import { errMsg, measurementApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { Measurement } from "@/types";
import BodyFigure from "@/components/BodyFigure";

type Values = Partial<Record<MeasurementKey, string>>;
type Region = "upper" | "arm" | "lower";

interface StepDef {
  title: string;
  hint: string;
  region: Region;
  keys: MeasurementKey[];
}

const STEPS: StepDef[] = [
  {
    title: "Yuqori tana",
    hint: "Bo'y, ko'krak va yelka o'lchovlari",
    region: "upper",
    keys: ["height", "shoulderWidth", "chest", "chestSpan", "chestLength", "collar"],
  },
  {
    title: "Qo'l va yeng",
    hint: "Yeng uzunligi va kengligi",
    region: "arm",
    keys: ["sleeveLength", "sleeveWidth"],
  },
  {
    title: "Bel va past tana",
    hint: "Bel, bo'ksa va lozim o'lchovlari",
    region: "lower",
    keys: ["waist", "waistLength", "hips", "hipsLength", "pantsWidth"],
  },
];

const FIELD_BY_KEY: Record<string, MeasurementFieldDef> = Object.fromEntries(
  MEASUREMENT_FIELDS.map((f) => [f.key, f])
);

interface Props {
  initial?: Measurement | null;
  onSaved?: (m: Measurement) => void;
  redirectTo?: string;
}

export default function MeasurementForm({ initial, onSaved, redirectTo }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title || "Mening o'lchovim");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(() => {
    const v: Values = {};
    if (initial) for (const f of MEASUREMENT_FIELDS) v[f.key] = String(initial[f.key] ?? "");
    return v;
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: string, val: string) => {
    setValues((s) => ({ ...s, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const filledCount = useMemo(
    () =>
      MEASUREMENT_FIELDS.filter((f) => {
        const raw = values[f.key];
        const num = Number(raw);
        return raw !== undefined && raw !== "" && !Number.isNaN(num) && num >= f.min && num <= f.max;
      }).length,
    [values]
  );

  const validateKeys = (keys: MeasurementKey[]): boolean => {
    const next: Partial<Record<string, string>> = { ...errors };
    let ok = true;
    for (const key of keys) {
      const f = FIELD_BY_KEY[key];
      const raw = values[key];
      if (raw === undefined || raw === "") {
        next[key] = "Ushbu maydonni to'ldiring";
        ok = false;
        continue;
      }
      const num = Number(raw);
      if (Number.isNaN(num)) { next[key] = "Faqat raqam kiriting"; ok = false; continue; }
      if (num < f.min) { next[key] = `Kamida ${f.min} sm`; ok = false; }
      else if (num > f.max) { next[key] = `Ko'pi bilan ${f.max} sm`; ok = false; }
      else next[key] = undefined;
    }
    setErrors(next);
    return ok;
  };

  const goNext = () => {
    if (!validateKeys(STEPS[step].keys)) {
      toast.error("Bosqich maydonlarini to'g'ri to'ldiring");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allKeys = MEASUREMENT_FIELDS.map((f) => f.key);
    if (!validateKeys(allKeys)) {

      const badStep = STEPS.findIndex((st) => st.keys.some((k) => {
        const raw = values[k]; const num = Number(raw);
        return raw === undefined || raw === "" || Number.isNaN(num) || num < FIELD_BY_KEY[k].min || num > FIELD_BY_KEY[k].max;
      }));
      if (badStep >= 0) setStep(badStep);
      toast.error("Iltimos, barcha maydonlarni to'g'ri to'ldiring");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, any> = { title: title.trim() || "Mening o'lchovim", notes: notes.trim() };
      for (const f of MEASUREMENT_FIELDS) payload[f.key] = Number(values[f.key]);

      const res = initial
        ? await measurementApi.update(initial._id, payload)
        : await measurementApi.create(payload);

      toast.success(initial ? "O'lchov yangilandi" : "O'lchov saqlandi");
      onSaved?.(res.item);
      if (redirectTo) router.push(redirectTo);
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setSubmitting(false);
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = Math.round((filledCount / MEASUREMENT_FIELDS.length) * 100);

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="card">
        <label className="label" htmlFor="title">Nom</label>
        <input
          id="title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masalan: Yozgi ko'ylak uchun"
        />
        <p className="helper">Bir nechta o'lchovingiz bo'lsa, ularni nom orqali ajratasiz.</p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-semibold text-ink-900">
            To&apos;ldirilgan: {filledCount}/{MEASUREMENT_FIELDS.length}
          </span>
          <span className="font-medium text-ink-500">{progress}%</span>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="bg-grad h-full rounded-full transition-all duration-500 ease-ios"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="segmented mt-5">
          {STEPS.map((st, i) => (
            <button
              key={st.title}
              type="button"
              onClick={() => setStep(i)}
              data-active={i === step}
              className="segmented-item !text-[13px]"
            >
              {i + 1}. {st.title}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div key={step} className="animate-fade-up grid grid-cols-1 gap-7 md:grid-cols-[160px_1fr]">
          <div className="flex flex-col items-center">
            <BodyFigure active={current.region} className="h-64 w-auto" />
            <div className="mt-4 text-center">
              <div className="text-[15px] font-bold tracking-[-0.02em] text-ink-900">{current.title}</div>
              <div className="mt-0.5 text-[13px] text-ink-500">{current.hint}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {current.keys.map((key) => {
              const f = FIELD_BY_KEY[key];
              return (
                <div key={key}>
                  <label className="label" htmlFor={key}>
                    {f.label} <span className="text-ink-400">(sm)</span>
                  </label>
                  <input
                    id={key}
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min={f.min}
                    max={f.max}
                    className={`input ${errors[key] ? "!border-danger" : ""}`}
                    aria-invalid={!!errors[key]}
                    placeholder={f.placeholder}
                    value={values[key] ?? ""}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                  {errors[key] ? (
                    <p className="mt-1.5 text-[13px] font-medium text-danger">{errors[key]}</p>
                  ) : (
                    <p className="helper">{f.helper} ({f.min}–{f.max} sm)</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-40"
          >
            ← Orqaga
          </button>
          {!isLast ? (
            <button type="button" onClick={goNext} className="btn-primary">
              Keyingi →
            </button>
          ) : (
            <span className="text-[13px] font-medium text-ink-400">Oxirgi bosqich</span>
          )}
        </div>
      </div>

      <div className="card">
        <label className="label" htmlFor="notes">Qo'shimcha izoh (ixtiyoriy)</label>
        <textarea
          id="notes"
          className="input min-h-[90px] resize-y"
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Masalan: Yengni biroz keng qildirsam yaxshiroq..."
        />
        <p className="helper">{notes.length}/500</p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Bekor qilish
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saqlanmoqda..." : initial ? "Yangilash" : "Saqlash"}
        </button>
      </div>
    </form>
  );
}
