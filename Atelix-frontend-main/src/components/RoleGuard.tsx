"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

interface Props {
  allow: Role[];
  children: React.ReactNode;
}

/** Faqat berilgan rollardagi userlarga ruxsat beruvchi guard */
export default function RoleGuard({ allow, children }: Props) {
  const { user, initialized, bootstrap } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!allow.includes(user.role)) {
      // Rolga mos joyga yo'naltirish
      if (user.role === "tailor") router.replace("/tailor");
      else if (user.role === "customer") router.replace("/dashboard");
      else router.replace("/");
    }
  }, [initialized, user, allow, router]);

  if (!initialized || !user || !allow.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
