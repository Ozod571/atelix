import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl font-semibold tracking-tight text-ink-900">404</div>
      <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.035em]">Sahifa topilmadi</h1>
      <p className="mt-2 max-w-md text-ink-600">
        Siz izlagan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">Bosh sahifa</Link>
        <Link href="/tailors" className="btn-secondary">Tikuvchilar katalogi</Link>
      </div>
    </main>
  );
}
