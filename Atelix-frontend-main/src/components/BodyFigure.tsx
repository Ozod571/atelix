"use client";

type Region = "upper" | "arm" | "lower";

interface Props {
  active: Region;
  className?: string;
}

export default function BodyFigure({ active, className = "" }: Props) {
  const on = "rgb(var(--accent))";
  const off = "rgb(var(--ink-200))";
  const soft = "rgb(var(--ink-100))";

  const upper = active === "upper";
  const arm = active === "arm";
  const lower = active === "lower";

  return (
    <svg viewBox="0 0 120 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="24" r="16" stroke={off} strokeWidth="2.5" fill={soft} />

      <rect x="54" y="38" width="12" height="10" rx="4" fill={soft} stroke={off} strokeWidth="2" />

      <path
        d="M40 50 Q60 44 80 50 L84 120 Q60 128 36 120 Z"
        fill={upper ? "rgb(var(--accent) / 0.12)" : soft}
        stroke={upper ? on : off}
        strokeWidth={upper ? 3 : 2}
      />

      <path
        d="M40 54 L26 66 L20 118 L28 120 L36 74 Z"
        fill={arm ? "rgb(var(--accent) / 0.12)" : soft}
        stroke={arm ? on : off}
        strokeWidth={arm ? 3 : 2}
      />
      <path
        d="M80 54 L94 66 L100 118 L92 120 L84 74 Z"
        fill={arm ? "rgb(var(--accent) / 0.12)" : soft}
        stroke={arm ? on : off}
        strokeWidth={arm ? 3 : 2}
      />

      <path
        d="M38 120 Q60 128 82 120 L80 150 L70 250 L58 250 L60 168 L52 250 L40 250 L40 150 Z"
        fill={lower ? "rgb(var(--accent) / 0.12)" : soft}
        stroke={lower ? on : off}
        strokeWidth={lower ? 3 : 2}
      />
    </svg>
  );
}
