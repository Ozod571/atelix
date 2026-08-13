"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ishlab chiqarishda bu yerga xatolik monitoringi (Sentry va h.k.) ulanadi
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl">⚠️</div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Nimadir xato ketdi</h1>
      <p className="mt-2 max-w-md text-ink-600">
        Kutilmagan xatolik yuz berdi. Iltimos, sahifani qayta yuklab ko'ring.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn-primary">Qayta urinish</button>
        <Link href="/" className="btn-secondary">Bosh sahifa</Link>
      </div>
    </main>
  );
}
