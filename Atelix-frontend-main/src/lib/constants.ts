import type { ClothingType, OrderStatus } from "@/types";

export const CLOTHING_TYPES: { value: ClothingType; label: string }[] = [
  { value: "dress", label: "Ko'ylak (ayollar)" },
  { value: "suit", label: "Kostyum" },
  { value: "pants", label: "Shim / Lozim" },
  { value: "shirt", label: "Erkaklar ko'ylagi" },
  { value: "other", label: "Boshqa" },
];

export const clothingLabel = (t: ClothingType) =>
  CLOTHING_TYPES.find((x) => x.value === t)?.label || t;

export const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: "Kutilmoqda",      color: "bg-amber-100 text-amber-800 ring-amber-200" },
  accepted:  { label: "Qabul qilindi",   color: "bg-blue-100 text-blue-800 ring-blue-200" },
  completed: { label: "Tayyor",          color: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  rejected:  { label: "Rad etildi",      color: "bg-rose-100 text-rose-800 ring-rose-200" },
  cancelled: { label: "Bekor qilindi",   color: "bg-neutral-100 text-neutral-700 ring-neutral-200" },
};

export type MeasurementKey =
  | "height"
  | "chest"
  | "chestSpan"
  | "chestLength"
  | "waist"
  | "waistLength"
  | "collar"
  | "sleeveLength"
  | "sleeveWidth"
  | "hips"
  | "hipsLength"
  | "shoulderWidth"
  | "pantsWidth";

export interface MeasurementFieldDef {
  key: MeasurementKey;
  label: string;
  helper: string;
  min: number;
  max: number;
  placeholder: string;
}

export const MEASUREMENT_FIELDS: MeasurementFieldDef[] = [
  { key: "height",        label: "Bo'y (umumiy uzunlik)", helper: "Tik turgan holda boshdan tovongacha", min: 100, max: 220, placeholder: "Masalan: 175" },
  { key: "chest",         label: "Ko'krak aylanasi",       helper: "Ko'krakning eng keng joyini o'lchang", min: 40,  max: 200, placeholder: "Masalan: 96" },
  { key: "chestSpan",     label: "Ko'krak oralig'i",       helper: "Ikki ko'krak nuqtasi orasidagi masofa", min: 10,  max: 60,  placeholder: "Masalan: 20" },
  { key: "chestLength",   label: "Ko'krakgacha uzunlik",   helper: "Yelkadan ko'krak nuqtasigacha",         min: 15,  max: 90,  placeholder: "Masalan: 24" },
  { key: "waist",         label: "Bel aylanasi",           helper: "Belning eng tor joyini o'lchang",       min: 40,  max: 200, placeholder: "Masalan: 80" },
  { key: "waistLength",   label: "Belgacha uzunlik",       helper: "Yelkadan belgacha masofa",              min: 20,  max: 110, placeholder: "Masalan: 42" },
  { key: "collar",        label: "Yoqa (bo'yin aylanasi)", helper: "Bo'yin asosining aylanasi",             min: 20,  max: 70,  placeholder: "Masalan: 40" },
  { key: "sleeveLength",  label: "Yeng uzunligi",          helper: "Yelkadan bilakka qadar",                min: 20,  max: 100, placeholder: "Masalan: 62" },
  { key: "sleeveWidth",   label: "Yeng kengligi",          helper: "Yengning eng keng qismi",               min: 8,   max: 60,  placeholder: "Masalan: 20" },
  { key: "hips",          label: "Bo'ksa aylanasi",        helper: "Sonning eng keng joyini o'lchang",      min: 40,  max: 200, placeholder: "Masalan: 100" },
  { key: "hipsLength",    label: "Bo'ksagacha uzunlik",    helper: "Beldan bo'ksa nuqtasigacha",            min: 15,  max: 100, placeholder: "Masalan: 22" },
  { key: "shoulderWidth", label: "Yelka kengligi",         helper: "Bir yelka cheti — ikkinchi yelka cheti", min: 20,  max: 80,  placeholder: "Masalan: 46" },
  { key: "pantsWidth",    label: "Lozim/bryuk kengligi",   helper: "Lozim pochasining kengligi",            min: 8,   max: 80,  placeholder: "Masalan: 24" },
];

export const formatPrice = (v?: number | null): string => {
  if (v === undefined || v === null || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("uz-UZ").format(v) + " so'm";
};

export const TAILOR_SORTS: { value: string; label: string }[] = [
  { value: "rating", label: "Reyting bo'yicha" },
  { value: "price",  label: "Arzon narx" },
  { value: "new",    label: "Yangi qo'shilgan" },
];
