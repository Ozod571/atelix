"use client";

interface Props {
  withText?: boolean;
  className?: string;
    size?: number;
}

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl bg-accent text-accent-fg shadow-sm"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 19 L16.5 7.5" strokeWidth="1.9" />
        <circle cx="17.6" cy="6.4" r="1.7" strokeWidth="1.4" />
        <path d="M5 19 c-1.7 .6 -1.9 2.7 0 3.1 c1.6 .3 2.4 -1.3 1.2 -2.3" strokeWidth="1.4" opacity="0.9" />
      </svg>
    </span>
  );
}

export default function Logo({ withText = true, className = "", size = 34 }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withText && (
        <span className="font-display text-xl font-semibold tracking-tight text-ink-900">Atelix</span>
      )}
    </span>
  );
}
