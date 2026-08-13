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

  const homeHref =
    user?.role === "tailor" ? "/tailor"
    : user?.role === "customer" ? "/dashboard"
    : "/";

  const navItem = (href: string, label: string, isActive: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm transition ${
        isActive
          ? "bg-accent/10 text-accent font-medium"
          : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "border-b border-ink-200/70 bg-surface/80 backdrop-blur-lg"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href={homeHref} className="flex items-center gap-2.5 group">
          <span className="transition group-hover:scale-105">
            <LogoMark size={34} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink-900">Atelix</span>
        </Link>

        {/* O'ng klaster */}
        <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        {user && <NotificationBell />}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user?.role !== "tailor" &&
            navItem("/tailors", "Tikuvchilar", pathname?.startsWith("/tailors") || false)}
          {user ? (
            <>
              {user.role === "customer" && (
                <>
                  {navItem("/dashboard", "Asosiy", pathname?.startsWith("/dashboard") || false)}
                  {navItem("/orders", "Buyurtmalar", pathname?.startsWith("/orders") && !pathname.startsWith("/orders/new") || false)}
                </>
              )}
              {user.role === "tailor" && navItem("/tailor", "Buyurtmalar", pathname?.startsWith("/tailor") || false)}

              <div className="ml-3 flex items-center gap-3 border-l border-ink-200 pl-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-ink-50 text-xs font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-ink-700 font-medium hidden lg:inline">
                    {user.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-ink-200 bg-surface px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
                >
                  Chiqish
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-full px-4 py-1.5 text-sm text-ink-700 hover:text-ink-900 hover:bg-ink-50 transition">
                Kirish
              </Link>
              <Link
                href="/auth/register"
                className="ml-1 rounded-full bg-ink-900 px-5 py-1.5 text-sm font-medium text-ink-50 transition hover:bg-ink-700"
              >
                Boshlash
              </Link>
            </>
          )}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden rounded-lg p-2 text-ink-700 hover:bg-ink-100"
          aria-label="Menyu"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-200 bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-4 space-y-1">
            {user?.role !== "tailor" && (
              <Link href="/tailors" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                Tikuvchilar
              </Link>
            )}
            {user ? (
              <>
                {user.role === "customer" && (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                      Asosiy
                    </Link>
                    <Link href="/orders" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                      Buyurtmalar
                    </Link>
                  </>
                )}
                {user.role === "tailor" && (
                  <Link href="/tailor" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                    Buyurtmalar
                  </Link>
                )}
                <div className="border-t border-ink-100 pt-2 mt-2 flex items-center justify-between px-4 py-2">
                  <span className="text-sm text-ink-600">{user.name}</span>
                  <button onClick={logout} className="text-sm font-medium text-ink-900">Chiqish</button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block rounded-lg px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                  Kirish
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-medium text-ink-50 text-center">
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