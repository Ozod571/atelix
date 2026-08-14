"use client";

interface Props {
  value: string;
  onChange: (digits: string) => void;
  id?: string;
  autoComplete?: string;
  required?: boolean;
}

const groupDigits = (d: string) => {
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
};

export default function PhoneInput({
  value,
  onChange,
  id = "phone",
  autoComplete = "tel",
  required,
}: Props) {
  const digits = value.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);

  const handle = (raw: string) => {
    const next = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
    onChange(next);
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-ink-500">
        +998
      </span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        className="input pl-[68px] tracking-[0.02em]"
        value={groupDigits(digits)}
        onChange={(e) => handle(e.target.value)}
        placeholder="90 123 45 67"
        autoComplete={autoComplete}
        required={required}
        aria-label="Telefon raqam"
      />
    </div>
  );
}
