import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://atelix.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Atelix — O'lchov asosida tikuvchilar platformasi",
    template: "%s · Atelix",
  },
  description:
    "O'lchovlaringizni bir marta kiriting va O'zbekistondagi eng yaxshi tikuvchilarga buyurtma bering. Reyting, narx va sharhlar asosida ustani tanlang.",
  keywords: ["tikuvchi", "atelye", "o'lchov", "buyurtma", "kiyim tikish", "Atelix", "O'zbekiston"],
  applicationName: "Atelix",
  authors: [{ name: "Atelix" }],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: "Atelix",
    title: "Atelix — O'lchov asosida tikuvchilar platformasi",
    description:
      "O'lchovlaringizni kiriting va ishonchli tikuvchilarga buyurtma bering. Reyting, narx va sharhlar bir joyda.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelix — Tikuvchilar platformasi",
    description: "O'lchov asosida ishonchli tikuvchilarga buyurtma bering.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f2f2f7" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('atelix_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-ink-50 text-ink-900 antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: "18px",
              fontSize: "14.5px",
              fontWeight: 500,
              padding: "12px 16px",
              background: "rgb(var(--surface) / 0.82)",
              backdropFilter: "saturate(180%) blur(22px)",
              WebkitBackdropFilter: "saturate(180%) blur(22px)",
              color: "rgb(var(--ink-900))",
              border: "1px solid rgb(var(--ink-200) / 0.8)",
              boxShadow: "var(--shadow-2)",
            },
          }}
        />
      </body>
    </html>
  );
}
