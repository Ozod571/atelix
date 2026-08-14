"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoMark } from "@/components/Logo";

export default function Navbar() {
  const { user, initialized, bootstrap, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const homeHref =
    user?.role === "tailor" ? "/tailor" : user?.role === "customer" ? "/dashboard" : "/";

  const navItem = (href: string, label: string, isActive: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-2 text-[14.5px] font-medium transition duration-200 ease-ios ${
        isActive
          ? "bg-accent/12 text-accent"
          : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ease-ios ${
        scrolled ? "glass border-b border-ink-200/70" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-6">
        <Link href={homeHref} className="group flex items-center gap-2.5">
          <span className="transition duration-300 ease-ios group-hover:scale-105">
            <LogoMark size={34} />
          </span>
          <span className="text-xl font-bold tracking-[-0.03em] text-ink-900">Atelix</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {user && <NotificationBell />}

          <nav className="hidden items-center gap-1 md:flex">
            {user?.role !== "tailor" &&
              navItem("/tailors", "Tikuvchilar", pathname?.startsWith("/tailors") || false)}
            {user ? (
              <>
                {user.role === "customer" && (
                  <>
                    {navItem("/dashboard", "Asosiy", pathname?.startsWith("/dashboard") || false)}
                    {navItem(
                      "/orders",
                      "Buyurtmalar",
                      (pathname?.startsWith("/orders") && !pathname.startsWith("/orders/new")) || false
                    )}
                  </>
                )}
                {user.role === "tailor" &&
                  navItem("/tailor", "Buyurtmalar", pathname?.startsWith("/tailor") || false)}

                <div className="ml-3 flex items-center gap-3 border-l border-ink-200 pl-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-grad flex h-9 w-9 items-center justify-center rounded-[13px] text-[13px] font-bold text-accent-fg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden text-[14.5px] font-medium text-ink-700 lg:inline">
                      {user.name?.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-full border border-ink-200 bg-surface px-4 py-2 text-[14px] font-semibold text-ink-700 shadow-ios transition duration-200 ease-ios hover:-translate-y-0.5 hover:shadow-ios-md"
                  >
                    Chiqish
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-[14.5px] font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-900"
                >
                  Kirish
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-grad ml-1 rounded-full px-5 py-2.5 text-[14.5px] font-semibold text-accent-fg shadow-[0_8px_22px_rgb(var(--accent)/0.35)] transition duration-200 ease-ios hover:-translate-y-0.5"
                >
                  Boshlash
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2.5 text-ink-700 transition hover:bg-ink-100 md:hidden"
            aria-label="Menyu"
            aria-expanded={menuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="glass animate-fade-up border-t border-ink-200/70 md:hidden">
          <div className="mx-auto max-w-content space-y-1 px-5 py-4">
            {user?.role !== "tailor" && (
              <Link
                href="/tailors"
                className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-ink-100"
              >
                Tikuvchilar
              </Link>
            )}
            {user ? (
              <>
                {user.role === "customer" && (
                  <>
                    <Link
                      href="/dashboard"
                      className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-ink-100"
                    >
                      Asosiy
                    </Link>
                    <Link
                      href="/orders"
                      className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-ink-100"
                    >
                      Buyurtmalar
                    </Link>
                  </>
                )}
                {user.role === "tailor" && (
                  <Link
                    href="/tailor"
                    className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-ink-100"
                  >
                    Buyurtmalar
                  </Link>
                )}
                <div className="mt-2 flex items-center justify-between border-t border-ink-200 px-4 pt-3">
                  <span className="text-[14.5px] text-ink-600">{user.name}</span>
                  <button onClick={logout} className="text-[14.5px] font-semibold text-accent">
                    Chiqish
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-ink-700 transition hover:bg-ink-100"
                >
                  Kirish
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-grad block rounded-full px-4 py-3 text-center text-[15px] font-semibold text-accent-fg"
                >
                  Boshlash
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
