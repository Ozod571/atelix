"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import RoleGuard from "@/components/RoleGuard";
import MeasurementForm from "@/components/MeasurementForm";
import { measurementApi, errMsg } from "@/lib/api";
import type { Measurement } from "@/types";

function Content() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Measurement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await measurementApi.get(id);
        setItem(res.item);
      } catch (e) {
        toast.error(errMsg(e));
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const remove = async () => {
    if (!confirm("Ushbu o'lchovni o'chirishni xohlaysizmi?")) return;
    try {
      await measurementApi.remove(id);
      toast.success("O'chirildi");
      router.push("/dashboard");
    } catch (e) {
      toast.error(errMsg(e));
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent" />
        </div>
      </>
    );
  }

  if (!item) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-ink-500 hover:text-ink-900">← Asosiy</Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">O'lchovni tahrirlash</h1>
            <p className="mt-1 text-ink-600">Maydonlarni o'zgartirib, "Yangilash" tugmasini bosing.</p>
          </div>
          <button onClick={remove} className="btn text-rose-600 hover:bg-rose-50">
            O'chirish
          </button>
        </div>

        <MeasurementForm initial={item} redirectTo="/dashboard" />
      </main>
    </>
  );
}

export default function Page() {
  return (
    <RoleGuard allow={["customer"]}>
      <Content />
    </RoleGuard>
  );
}
