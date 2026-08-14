"use client";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import { LogoMark } from "@/components/Logo";
import Icon from "@/components/Icon";
import { useAuth } from "@/hooks/useAuth";

const STEPS = [
  {
    title: "O'lchovni saqlang",
    body: "13 ta aniq tana o'lchovini bosqichli forma va tana diagrammasi yordamida bir marta kiriting.",
  },
  {
    title: "Tikuvchini tanlang",
    body: "Reyting, narx va haqiqiy sharhlar asosida o'zingizga mos ustani toping va buyurtma bering.",
  },
  {
    title: "Kuzatib boring",
    body: "Status timeline, jonli suhbat va bildirishnomalar bilan buyurtmani boshidan oxirigacha kuzating.",
  },
];

const FEATURES = [
  {
    icon: "ruler" as const,
    tone: "bg-accent/12 text-accent ring-accent/15",
    title: "Interaktiv o'lchov",
    body: "Tana diagrammasi har bir o'lchovni qayerdan olishni ko'rsatadi — xato qilish qiyin.",
  },
  {
    icon: "star" as const,
    tone: "bg-warning/14 text-warning ring-warning/20",
    title: "Ishonchli tikuvchilar",
    body: "Reyting va tugagan buyurtmalardan keyin qoldirilgan sharhlar asosida tanlang.",
  },
  {
    icon: "chat" as const,
    tone: "bg-info/14 text-info ring-info/20",
    title: "Jonli suhbat",
    body: "Mato, rang va muddat haqida usta bilan bevosita yozishing — telefon kerak emas.",
  },
  {
    icon: "bell" as const,
    tone: "bg-danger/12 text-danger ring-danger/18",
    title: "Bildirishnomalar",
    body: "Buyurtma qabul qilindimi, tayyor bo'ldimi — darhol xabar topasiz.",
  },
  {
    icon: "thread" as const,
    tone: "bg-teal/16 text-teal ring-teal/22",
    title: "Portfolio",
    body: "Tikuvchining ish namunalari, tajribasi va boshlang'ich narxi profilida ko'rinadi.",
  },
  {
    icon: "lock" as const,
    tone: "bg-success/14 text-success ring-success/20",
    title: "Xavfsiz",
    body: "Ma'lumotlaringiz shifrlangan holda saqlanadi, o'lchov faqat siz tanlagan ustaga ko'rinadi.",
  },
];

const MEASURE_PREVIEW = [
  ["Bo'y", "178 sm"],
  ["Ko'krak aylanasi", "98 sm"],
  ["Bel aylanasi", "84 sm"],
  ["Yeng uzunligi", "62 sm"],
  ["Yelka kengligi", "46 sm"],
];

const TAILOR_PREVIEW = [
  { initial: "A", name: "Aziza Atelye", meta: "Chilonzor · 20 yil tajriba", rating: "5.0", selected: true },
  { initial: "E", name: "Elite Suit", meta: "Yunusobod · kostyum ustasi", rating: "4.8", selected: false },
  { initial: "M", name: "Malika Style", meta: "Mirzo Ulug'bek · ayollar kiyimi", rating: "4.9", selected: false },
];

export default function HomePage() {
  const { initialized, bootstrap } = useAuth();

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  return (
    <div className="overflow-x-hidden">
      <Navbar />

      <section className="relative">
        <div className="glow -top-52 left-[-10%] h-[520px] w-[520px] bg-accent/35" aria-hidden="true" />
        <div className="glow -top-40 right-[-12%] h-[460px] w-[460px] bg-teal/28" aria-hidden="true" />
        <div className="glow top-24 left-[38%] h-[400px] w-[400px] bg-pink/16" aria-hidden="true" />

        <div className="relative mx-auto max-w-content px-5 pb-6 pt-16 text-center sm:pt-24">
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13.5px] font-semibold text-ink-700 shadow-ios ring-1 ring-ink-200/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            O&apos;zbekistondagi tikuvchilar bilan onlayn
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-[clamp(38px,7vw,68px)] font-extrabold text-ink-900">
            O&apos;lchov bir marta.
            <br />
            <span className="text-grad">Mukammal kiyim</span> har safar.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[clamp(16.5px,2.2vw,20px)] leading-relaxed text-ink-500">
            Tana o&apos;lchovlaringizni bir marta saqlang, ishonchli tikuvchini tanlang va
            buyurtmani onlayn kuzating — hammasi bir joyda.
          </p>

          <div className="mx-auto mt-9 flex max-w-sm flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
            <Link href="/auth/register" className="btn-primary px-8">
              Bepul boshlash
            </Link>
            <Link href="/tailors" className="btn-secondary px-8">
              Tikuvchilarni ko&apos;rish
            </Link>
          </div>

          <p className="mt-4 text-[13.5px] text-ink-400">Karta kerak emas · 2 daqiqada tayyor</p>

          <Reveal className="mx-auto mt-14 max-w-4xl" delay={60}>
            <div className="relative">
              <div className="overflow-hidden rounded-[30px] bg-surface shadow-ios-lg ring-1 ring-ink-200/60">
                <div className="flex items-center gap-2 border-b border-ink-200/70 bg-surface-2 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-danger/80" />
                  <span className="h-3 w-3 rounded-full bg-warning/80" />
                  <span className="h-3 w-3 rounded-full bg-success/80" />
                  <span className="ml-3 rounded-lg border border-ink-200/70 bg-surface px-3.5 py-1 text-[12.5px] text-ink-400">
                    atelix.uz/buyurtma
                  </span>
                </div>

                <div className="grid text-left sm:grid-cols-2">
                  <div className="border-ink-200/70 p-6 sm:border-r">
                    <h3 className="text-[14px] font-semibold text-ink-500">Sizning o&apos;lchovingiz</h3>
                    <div className="mt-4">
                      {MEASURE_PREVIEW.map(([label, value]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between border-b border-ink-200/60 py-3 last:border-0"
                        >
                          <span className="text-[14.5px] text-ink-700">{label}</span>
                          <span className="rounded-lg bg-ink-100 px-2.5 py-1 text-[14px] font-bold text-ink-900">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface-2 p-6">
                    <h3 className="text-[14px] font-semibold text-ink-500">Tikuvchi tanlang</h3>
                    <div className="mt-4 space-y-2.5">
                      {TAILOR_PREVIEW.map((t) => (
                        <div
                          key={t.name}
                          className={`flex items-center gap-3 rounded-[18px] bg-surface p-3 ring-1 transition duration-300 ease-ios ${
                            t.selected
                              ? "shadow-[0_0_0_3px_rgb(var(--accent)/0.14)] ring-accent"
                              : "ring-ink-200/70"
                          }`}
                        >
                          <span className="bg-grad flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-[16px] font-bold text-accent-fg">
                            {t.initial}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14.5px] font-semibold text-ink-900">
                              {t.name}
                            </span>
                            <span className="block truncate text-[12.5px] text-ink-500">{t.meta}</span>
                          </span>
                          <span className="shrink-0 text-[13px] font-bold text-warning">★ {t.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass animate-float absolute -bottom-7 -left-7 hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-ios-md ring-1 ring-ink-200/60 lg:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-success/15 text-success">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <span className="text-left">
                  <span className="block text-[13.5px] font-bold text-ink-900">Qabul qilindi</span>
                  <span className="block text-[11.5px] text-ink-500">Aziza Atelye</span>
                </span>
              </div>

              <div
                className="glass animate-float absolute -right-7 -top-7 hidden items-center gap-2.5 rounded-2xl px-4 py-3 shadow-ios-md ring-1 ring-ink-200/60 lg:flex"
                style={{ animationDelay: "1.2s" }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/12 text-accent">
                  <Icon name="chat" className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="text-left">
                  <span className="block text-[13.5px] font-bold text-ink-900">Yangi xabar</span>
                  <span className="block text-[11.5px] text-ink-500">Mato tayyor bo&apos;ldi</span>
                </span>
              </div>
            </div>
          </Reveal>

          <div className="mt-14 flex flex-wrap justify-center gap-3.5">
            {[
              ["13", "o'lchov nuqtasi"],
              ["1 bosish", "buyurtma berish"],
              ["Real-time", "chat va status"],
            ].map(([n, t], i) => (
              <Reveal key={t} delay={i * 80}>
                <div className="card min-w-[160px] px-8 py-6 text-center">
                  <div className="text-grad text-[32px] font-extrabold tracking-[-0.04em]">{n}</div>
                  <div className="mt-0.5 text-[13.5px] font-medium text-ink-500">{t}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-20">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <p className="text-[13.5px] font-bold uppercase tracking-[0.08em] text-accent">Oddiy jarayon</p>
          <h2 className="mt-3 text-[clamp(28px,4.2vw,44px)] font-extrabold text-ink-900">
            Uch qadamda tayyor
          </h2>
          <p className="mt-3.5 text-[17.5px] text-ink-500">
            Ro&apos;yxatdan chiqib ketishga hojat yo&apos;q — hammasi bir platformada.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="card card-hover h-full p-7">
                <div className="bg-grad flex h-12 w-12 items-center justify-center rounded-[16px] text-[19px] font-extrabold text-accent-fg shadow-[0_8px_20px_rgb(var(--accent)/0.35)]">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-[19px] font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 pb-20">
        <Reveal className="mx-auto mb-12 max-w-xl text-center">
          <p className="text-[13.5px] font-bold uppercase tracking-[0.08em] text-accent">Nega Atelix</p>
          <h2 className="mt-3 text-[clamp(28px,4.2vw,44px)] font-extrabold text-ink-900">
            Sizga kerak bo&apos;lgan hamma narsa
          </h2>
          <p className="mt-3.5 text-[17.5px] text-ink-500">O&apos;lchovdan tayyor kiyimgacha.</p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="card card-hover h-full">
                <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-[16px] ring-1 ${f.tone}`}>
                  <Icon name={f.icon} className="h-[26px] w-[26px]" />
                </div>
                <h3 className="mt-4 text-[18px] font-bold text-ink-900">{f.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-500">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 pb-20">
        <Reveal>
          <div className="card-lg mx-auto max-w-3xl text-center">
            <div className="text-[28px] text-warning">★★★★★</div>
            <p className="mx-auto mt-5 max-w-xl text-[clamp(18px,2.6vw,24px)] font-semibold leading-snug tracking-[-0.02em] text-ink-900">
              &ldquo;O&apos;lchovni bir marta kiritdim, keyin har safar bir bosishda buyurtma
              berdim. Ko&apos;ylak aynan o&apos;lchamimda chiqdi.&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="bg-grad flex h-11 w-11 items-center justify-center rounded-[14px] text-[15px] font-bold text-accent-fg">
                D
              </span>
              <span className="text-left">
                <span className="block text-[15px] font-semibold text-ink-900">Dilnoza Yusupova</span>
                <span className="block text-[13px] text-ink-500">Toshkent · mijoz</span>
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-5 pb-24">
        <Reveal>
          <div className="bg-grad relative overflow-hidden rounded-[34px] px-8 py-16 text-center shadow-ios-lg">
            <span className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
            <span className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/10 blur-xl" aria-hidden="true" />

            <h2 className="relative text-[clamp(28px,4.4vw,46px)] font-extrabold text-white">
              Bugun o&apos;lchovingizni saqlang
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[17.5px] text-white/90">
              Bir marta kiriting — keyin har safar bir bosishda buyurtma bering.
            </p>
            <Link
              href="/auth/register"
              className="relative mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-8 text-[16px] font-bold text-accent shadow-[0_14px_34px_rgb(0,0,0,0.2)] transition duration-200 ease-ios hover:-translate-y-0.5"
            >
              Bepul ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-ink-200/70 py-12">
        <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-5 text-center">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="text-lg font-bold tracking-[-0.03em] text-ink-900">Atelix</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-ink-600">
            <Link href="/tailors" className="transition hover:text-accent">
              Tikuvchilar
            </Link>
            <Link href="/auth/login" className="transition hover:text-accent">
              Kirish
            </Link>
            <Link href="/auth/register" className="transition hover:text-accent">
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </div>
          <p className="text-[13px] text-ink-400">
            O&apos;lchov asosida ishlaydigan tikuvchilar platformasi
          </p>
        </div>
      </footer>
    </div>
  );
}
