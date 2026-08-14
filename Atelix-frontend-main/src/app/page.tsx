"use client";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { initialized, bootstrap } = useAuth();

  useEffect(() => {
    if (!initialized) bootstrap();
  }, [initialized, bootstrap]);

  return (
    <div className="bg-surface">
      <Navbar />

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 50%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 50%, transparent 100%)",
          }}
        />
        <div className="absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200/40 via-violet-200/30 to-sky-200/40 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-32 sm:pt-32 sm:pb-44 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-surface/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-ink-700 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            O'zbekistondagi tikuvchilar uchun yangi avlod platforma
          </div>

          <h1 className="mt-8 text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tighter text-ink-900 leading-[0.95]">
            O'lchov oling.<br />
            <span className="bg-gradient-to-r from-ink-900 via-ink-700 to-ink-900 bg-clip-text text-transparent">
              Buyurtma yuboring.
            </span>
            <br />
            <span className="italic font-light text-ink-500">— shu xolos.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-ink-600 leading-relaxed">
            Atelix — bu tikuvchilar va mijozlarni bog'laydigan eng oddiy va ishonchli yo'l.
            Tana o'lchovlaringizni bir marta saqlang va istalgan tikuvchiga bir bosishda yuboring.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-fg shadow-lg shadow-accent/25 transition hover:bg-accent-600 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
            >
              Bepul boshlash
              <svg className="h-4 w-4 transition group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/tailors"
              className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-surface px-8 py-4 text-base font-medium text-ink-900 transition hover:bg-ink-50 hover:-translate-y-0.5"
            >
              Tikuvchilarni ko'rish
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-ink-500">
            <div className="flex items-center gap-2"><Check />Ro'yxatdan o'tish bepul</div>
            <div className="flex items-center gap-2"><Check />Komissiyasiz</div>
            <div className="flex items-center gap-2"><Check />O'zbek tilida</div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-12 pb-20">
          <div className="relative rounded-3xl border border-ink-200/70 bg-surface shadow-2xl shadow-ink-900/5 overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-ink-100 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-xs text-ink-400 font-mono">atelix.uz/dashboard</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-ink-100">
              <Stat label="Ko'krak"  value="98" />
              <Stat label="Bel"       value="84" />
              <Stat label="Bo'ksa"    value="100" />
              <Stat label="Yelka"     value="46" />
              <Stat label="Yeng"      value="62" />
              <Stat label="Uzunlik"   value="75" />
            </div>
            <div className="bg-neutral-900 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-xs text-ink-400 font-medium uppercase tracking-wider">Buyurtma yuboriladi</div>
                <div className="text-white font-medium mt-0.5">Aziza Atelye · Toshkent</div>
              </div>
              <button className="self-start sm:self-auto rounded-full bg-white px-5 py-2 text-sm font-medium text-neutral-900">
                Yuborish →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-24 sm:py-32 bg-ink-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-ink-500 uppercase tracking-wider">Nima uchun Atelix</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-ink-900">
              Hech qanday ortiqcha narsa.<br />
              <span className="text-ink-500">Faqat kerakli funksiyalar.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature icon={<RulerIcon />}  title="8 ta o'lchov"               desc="Ko'krak, bel, bo'ksa, yelka, yeng — barchasi standart formada. Bir marta kiritasiz, doimiy saqlanadi." />
            <Feature icon={<UsersIcon />}  title="Tasdiqlangan tikuvchilar"   desc="Toshkent, Samarqand, Buxoro va boshqa shaharlardagi professional tikuvchilar bilan ishlang." />
            <Feature icon={<BoltIcon />}   title="Bir bosishda yuborish"      desc="O'lchov tayyor — kiyim turini tanlang, izoh yozing, yuboring. Tikuvchi to'liq ma'lumotni oladi." />
            <Feature icon={<ShieldIcon />} title="Ma'lumotlar xavfsiz"        desc="Har bir buyurtma uchun o'lchovlar nusxasi saqlanadi. Keyin o'zgartirsangiz ham, eski buyurtma o'zgarmaydi." />
            <Feature icon={<PhoneIcon />}  title="Mobil uchun moslashtirilgan" desc="Telefondan ham, kompyuterdan ham bir xil tezlikda ishlaydi. Hech qanday o'rnatish kerak emas." />
            <Feature icon={<HeartIcon />}  title="O'zbek tilida"              desc="Barcha matnlar, maydonlar va xabarlar O'zbek tilida — siz va tikuvchilaringiz uchun qulay." />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-sm font-medium text-ink-500 uppercase tracking-wider">Qanday ishlaydi</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-ink-900">3 qadamda buyurtma</h2>
            <p className="mt-5 text-lg text-ink-600">Hisob yaratishdan kiyim tayyor bo'lguncha bo'lgan butun jarayon.</p>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            <Step n="01" tag="Tezkor"    title="Ro'yxatdan o'ting"           desc="Mijoz yoki tikuvchi sifatida hisob yarating. Email va parol yetarli — bir necha soniya." />
            <Step n="02" tag="Bir marta" title="O'lchovlaringizni kiriting" desc="Tasmali o'lchagich bilan tananingizdan 8 ta o'lchov oling. Helper text har bir maydonda yo'l ko'rsatadi." />
            <Step n="03" tag="Tayyor"    title="Tikuvchiga yuboring"        desc="Kerakli tikuvchini tanlang, kiyim turini belgilang, izoh yozing va buyurtma yuboring." />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-24 sm:py-32 bg-ink-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-sm font-medium text-ink-500 uppercase tracking-wider">Kim uchun</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-ink-900">Ikki tomonga ham qulay</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoleCard
              title="Mijozlar uchun"
              subtitle="Buyurtma berish hech qachon shu qadar oson bo'lmagan"
              points={[
                "Tana o'lchovlaringizni bir marta kiriting",
                "Bir nechta o'lchov saqlang (yozgi, qishki, kostyum uchun)",
                "Eng yaxshi tikuvchilarni tanlang",
                "Buyurtma holatini real vaqtda kuzating",
              ]}
              cta="Mijoz sifatida boshlash"
              href="/auth/register"
              dark={false}
            />
            <RoleCard
              title="Tikuvchilar uchun"
              subtitle="Mijozlardan tayyor o'lchov bilan buyurtma oling"
              points={[
                "O'lchov olish bilan vaqt sarflanmaydi",
                "Mijoz aloqalarini bitta panelda boshqaring",
                "Telefonsiz ham buyurtma qabul qiling",
                "Daromadingizni oshiring",
              ]}
              cta="Tikuvchi sifatida qo'shilish"
              href="/auth/register"
              dark={true}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <div className="text-sm font-medium text-ink-500 uppercase tracking-wider">Savol-javob</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-ink-900">Tez-tez beriladigan savollar</h2>
          </div>

          <div className="mt-16 space-y-4">
            <FAQ q="Atelix bepulmi?" a="Ha, Atelix'da ro'yxatdan o'tish va buyurtma yuborish butunlay bepul. To'lov to'g'ridan-to'g'ri tikuvchi bilan kelishilgan tarzda amalga oshiriladi — bizning komissiyamiz yo'q." />
            <FAQ q="O'lchov olishda xato qilsam-chi?" a="O'lchovlarni istalgan vaqt tahrirlashingiz mumkin. Lekin allaqachon yuborilgan buyurtmadagi o'lchovlar avtomatik o'zgarmaydi — yangi o'lchov bilan yangi buyurtma yuborasiz." />
            <FAQ q="Tikuvchi qanday tanlanadi?" a="Buyurtma yuborayotganda barcha mavjud tikuvchilar ro'yxati ko'rsatiladi. Atelye nomi, shahar va profil ma'lumotlari asosida o'zingiz tanlaysiz." />
            <FAQ q="Kiyim turini qanday belgilayman?" a="Buyurtma berishda 5 turdan birini tanlaysiz: ayollar ko'ylagi, kostyum, shim/lozim, erkaklar ko'ylagi yoki boshqa. Qo'shimcha xohishlarni izohga yozasiz." />
            <FAQ q="Ma'lumotlarim xavfsizmi?" a="Parolingiz shifrlangan holda saqlanadi (bcrypt). Hech qaysi tikuvchi sizning to'liq ro'yxatingizni ko'ra olmaydi — faqat siz aynan o'ziga yuborgan buyurtmaning o'lchovlarini ko'radi." />
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-12 sm:p-20 text-center">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-3xl" />

            <div className="relative">
              <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white">
                Birinchi buyurtmangizni<br />bering — bugun.
              </h2>
              <p className="mt-6 text-lg text-neutral-300 max-w-xl mx-auto">
                30 soniyada ro'yxatdan o'ting va o'lchovlaringizni saqlang.
                Birinchi buyurtmangizni bugundan boshlang.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-medium text-neutral-900 transition hover:bg-neutral-200 hover:-translate-y-0.5"
                >
                  Hozir boshlash
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur px-8 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  Hisobim bor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-100 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Atelix</span>
            <span className="text-sm text-ink-400">© {new Date().getFullYear()}</span>
          </div>
          <div className="text-sm text-ink-500">Toshkent, O'zbekiston · O'zbek tikuvchilari uchun</div>
        </div>
      </footer>
    </div>
  );
}

function Check() {
  return (
    <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-5">
      <div className="text-xs text-ink-500 font-medium">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight text-ink-900">{value}</span>
        <span className="text-sm text-ink-400">sm</span>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group relative rounded-2xl border border-ink-200/70 bg-surface p-7 transition hover:border-ink-900 hover:shadow-lg hover:shadow-ink-900/5 hover:-translate-y-0.5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-ink-50">{icon}</div>
      <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc, tag }: { n: string; title: string; desc: string; tag: string }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="text-5xl font-semibold tracking-tighter text-ink-200">{n}</div>
        <div className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">{tag}</div>
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">{title}</h3>
      <p className="mt-3 text-ink-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function RoleCard({
  title, subtitle, points, cta, href, dark,
}: { title: string; subtitle: string; points: string[]; cta: string; href: string; dark: boolean }) {
  return (
    <div className={`rounded-3xl p-10 ${dark ? "bg-neutral-900 text-white" : "bg-surface border border-ink-200/70"}`}>
      <h3 className={`text-2xl font-semibold tracking-tight ${dark ? "text-white" : "text-ink-900"}`}>{title}</h3>
      <p className={`mt-2 ${dark ? "text-neutral-300" : "text-ink-600"}`}>{subtitle}</p>

      <ul className="mt-8 space-y-3">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${dark ? "bg-white/10" : "bg-ink-100"}`}>
              <svg className={`h-3 w-3 ${dark ? "text-white" : "text-ink-900"}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </span>
            <span className={`${dark ? "text-neutral-200" : "text-ink-700"}`}>{p}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition ${
          dark ? "bg-white text-neutral-900 hover:bg-neutral-200" : "bg-accent text-accent-fg hover:bg-accent-600"
        }`}
      >
        {cta}
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
        </svg>
      </Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-ink-200/70 bg-surface p-6 hover:border-ink-300 transition">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="text-base font-medium text-ink-900">{q}</span>
        <span className="ml-4 flex-shrink-0 text-ink-400 transition group-open:rotate-45">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 5z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      <p className="mt-4 text-ink-600 leading-relaxed">{a}</p>
    </details>
  );
}

function RulerIcon()  { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21l18-18M7 17l-2-2m4 0l-2-2m4 0l-2-2m4 0l-2-2m4 0l-2-2" /></svg>); }
function UsersIcon()  { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>); }
function BoltIcon()   { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>); }
function ShieldIcon() { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>); }
function PhoneIcon()  { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>); }
function HeartIcon()  { return (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>); }
