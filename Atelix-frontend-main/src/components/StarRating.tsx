"use client";

interface Props {
    value: number;
    count?: number;
  size?: "sm" | "md" | "lg";
    interactive?: boolean;
  onChange?: (v: number) => void;
  className?: string;
}

const SIZES = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

function Star({ fill, className }: { fill: number; className: string }) {

  const id = `star-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="#f59e0b" />
          <stop offset={`${fill * 100}%`} stopColor="#e5e5e5" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M12 17.27l5.18 3.05-1.37-5.87 4.55-3.94-6-.52L12 4.5 9.64 9.99l-6 .52 4.55 3.94-1.37 5.87z"
      />
    </svg>
  );
}

export default function StarRating({
  value,
  count,
  size = "sm",
  interactive = false,
  onChange,
  className = "",
}: Props) {
  const cls = SIZES[size];

  if (interactive) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            className="transition hover:scale-110"
            aria-label={`${n} yulduz`}
          >
            <Star fill={value >= n ? 1 : 0} className={cls} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const fill = Math.max(0, Math.min(1, value - (n - 1)));
          return <Star key={n} fill={fill} className={cls} />;
        })}
      </div>
      {typeof count === "number" && (
        <span className="ml-1 text-xs text-ink-500">
          {value > 0 ? value.toFixed(1) : "—"}
          {count > 0 ? ` (${count})` : " (sharh yo'q)"}
        </span>
      )}
    </div>
  );
}
