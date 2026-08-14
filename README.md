<div align="center">

# ✦ Atelix

### O'lchov asosida ishlaydigan tikuvchilar platformasi

Mijozlar tana o'lchovlarini **bir marta** saqlaydi va O'zbekistondagi ishonchli
tikuvchilarga **bir bosishda** buyurtma beradi — reyting, narx, sharhlar,
real-time chat va bildirishnomalar bilan.

**🌐 Jonli sayt:** [atelix.uz](https://atelix.uz) &nbsp;·&nbsp; **💻 Kod:** [github.com/Ozod571/atelix](https://github.com/Ozod571/atelix)

`Next.js 14` · `TypeScript` · `Node.js` · `Express` · `MongoDB` · `Socket.io` · `Tailwind CSS`

</div>

---

## 🎯 Muammo va yechim

Kiyimni buyurtma qilishda odamlar har safar tikuvchiga borib, qayta-qayta
o'lchov oldiradi; tikuvchi va mijoz o'rtasida aloqa tarqoq (telefon, Telegram),
ishonchli ustani topish qiyin.

**Atelix** buni hal qiladi: foydalanuvchi o'lchovini bir marta kiritadi,
ishonchli tikuvchini reyting va sharhlar asosida tanlaydi, buyurtmani onlayn
kuzatadi va usta bilan bevosita yozishadi.

---

## ✨ Asosiy imkoniyatlar

### Mijoz uchun
- **Interaktiv o'lchov** — 13 ta aniq tana o'lchovi bosqichli forma va tana diagrammasi yordamida
- **Tikuvchilar katalogi** — nom/shahar bo'yicha qidiruv, reyting va narx bo'yicha saralash
- **Buyurtma oqimi** — kiyim turi, izoh, o'lchov snapshot'i (keyin o'zgarsa ham buyurtma o'zgarmaydi)
- **Status timeline** — Yuborildi → Qabul qilindi → Tayyor, sanalar bilan
- **Reyting va sharh** — tugagan buyurtmaga baho va fikr qoldirish

### Tikuvchi uchun
- **Profil** — avatar, portfolio (ish namunalari), tajriba, boshlang'ich narx
- **Buyurtmalarni boshqarish** — qabul qilish (narx belgilash bilan), rad etish, tayyor deb belgilash
- **Tayyor ish rasmini** yuklash

### Umumiy
- **Real-time chat** — mijoz ↔ tikuvchi jonli yozishuv (Socket.io), "yozmoqda…" indikatori
- **In-app bildirishnomalar** — yangi buyurtma, status o'zgarishi, xabar — real-time, o'qilmagan soni bilan
- **Telefon + parol** bilan sodda ro'yxatdan o'tish va kirish
- **Dark mode** va toza, zamonaviy dizayn
- **Rol tizimi** — mijoz / tikuvchi / admin
- **Xavfsizlik** — JWT autentifikatsiya, bcrypt parol, helmet, rate-limiting, CORS

---

## 🛠 Texnologiyalar

| Qatlam | Texnologiyalar |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Axios, Socket.io-client |
| **Backend** | Node.js, Express, Socket.io, Mongoose |
| **Ma'lumotlar bazasi** | MongoDB (Atlas) |
| **Autentifikatsiya** | JWT, bcryptjs |
| **Deploy** | Railway (frontend + backend), MongoDB Atlas |

---

## 📁 Loyiha tuzilishi

```
atelix/
├── Atelix-frontend-main/     # Next.js sayt
│   └── src/
│       ├── app/              # sahifalar (App Router)
│       ├── components/       # UI komponentlar
│       ├── hooks/ · lib/     # auth store, API, socket, utillar
│       └── types/
└── Atelix-backend-main/      # Express + Socket.io API
    └── src/
        ├── models/           # User, Measurement, Order, Review, Message, Notification
        ├── routes/           # auth, measurements, orders, tailors, reviews, notifications
        ├── middleware/ · utils/ · config/
        ├── socket.js         # real-time chat & bildirishnoma
        └── server.js
```

---

## 🚀 Lokal ishga tushirish

**Talab:** Node.js ≥ 18, MongoDB (lokal yoki Atlas)

**Backend:**
```bash
cd Atelix-backend-main
npm install
cp .env.example .env          # MONGODB_URI, JWT_SECRET ni to'ldiring
npm run seed                  # namuna ma'lumot (ixtiyoriy)
npm run dev                   # http://localhost:5000
```

**Frontend:**
```bash
cd Atelix-frontend-main
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                   # http://localhost:3000
```

---

## ☁️ Deploy

Loyiha **Railway**da joylashtirilgan: alohida frontend va backend xizmatlari,
ma'lumotlar bazasi esa **MongoDB Atlas**da. To'liq bosqichma-bosqich qo'llanma:
[`RAILWAY-DEPLOY.md`](./RAILWAY-DEPLOY.md).

---

## 👤 Muallif

**President Tech Award** tanlovi uchun ishlab chiqilgan.

<div align="center">

Made with ✦ in Uzbekistan

</div>
