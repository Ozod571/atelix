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
    <div className="card flex flex-col items-center py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-2xl text-accent">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-500">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6 btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
