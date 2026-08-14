"use client";
import Link from "next/link";

interface Props {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon = "✦", title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="card-lg flex flex-col items-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-accent/10 text-3xl ring-1 ring-accent/15">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-ink-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-500">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-7">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
