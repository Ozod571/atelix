# Atelix

O'lchov asosida ishlaydigan tikuvchilar platformasi (marketplace).
Mijozlar tana o'lchovlarini bir marta saqlaydi va ishonchli tikuvchilarga
buyurtma beradi: reyting, narx, sharhlar, real-time chat va bildirishnomalar bilan.

## Tuzilma

```
atelix/
├── Atelix-frontend-main/   # Next.js 14 + TypeScript + Tailwind (sayt)
└── Atelix-backend-main/    # Node.js + Express + MongoDB + Socket.io (API)
```

## Lokal ishga tushirish

**Backend:**
```bash
cd Atelix-backend-main
npm install
cp .env.example .env        # .env ni to'ldiring (MONGODB_URI, JWT_SECRET)
npm run seed                # namuna ma'lumot (ixtiyoriy)
npm run dev
```

**Frontend:**
```bash
cd Atelix-frontend-main
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL ni backend manziliga qo'ying
npm run dev
```

Frontend: http://localhost:3000 · Backend: http://localhost:5000

## Deploy

Railway'ga deploy qilish bo'yicha to'liq qo'llanma: [`RAILWAY-DEPLOY.md`](./RAILWAY-DEPLOY.md).

## Asosiy imkoniyatlar

- 13 ta tana o'lchovi (interaktiv, bosqichli forma + tana diagrammasi)
- Tikuvchilar katalogi: qidiruv, shahar filtri, reyting bo'yicha saralash
- Buyurtma oqimi: narx belgilash, status timeline, tayyor ish rasmi
- Reyting va sharhlar tizimi
- Real-time chat (mijoz ↔ tikuvchi) va in-app bildirishnomalar (Socket.io)
- Tikuvchi profili: avatar, portfolio, tajriba, narx
- Dark mode va "iliq atelier" dizayn tizimi
