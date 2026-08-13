"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import MeasurementForm from "@/components/MeasurementForm";

function NewMeasurementContent() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-ink-500 hover:text-ink-900">← Asosiy</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Yangi o'lchov</h1>
          <p className="mt-1 text-ink-600">
            O'lchovlarni tasmali metrlar yordamida tananingizdan oling. Barcha qiymatlar santimetrda.
          </p>
        </div>

        <MeasurementForm redirectTo="/dashboard" />
      </main>
    </>
  );
}

export default function NewMeasurementPage() {
  return (
    <RoleGuard allow={["customer"]}>
      <NewMeasurementContent />
    </RoleGuard>
  );
}
