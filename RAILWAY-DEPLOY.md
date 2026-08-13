# Atelix — Railway'ga deploy qilish qo'llanmasi

Bu loyiha **uchta qismdan** iborat va Railway'da uchta xizmat (service) sifatida ishlaydi:

1. **MongoDB** — ma'lumotlar bazasi (Railway plaginidan)
2. **Backend** — Node.js + Express + Socket.io API (`Atelix-backend-main`)
3. **Frontend** — Next.js sayt (`Atelix-frontend-main`)

> Tavsiya: ikkala papkani (`Atelix-frontend-main` va `Atelix-backend-main`) **bitta GitHub repozitoriyasiga** joylashtiring, so'ng Railway'da har biriga alohida xizmat yarating va "Root Directory" ni to'g'ri papkaga sozlang. Shu usul eng qulay.

---

## 0. Tayyorgarlik (bir marta)

- GitHub'da yangi repozitoriya oching, masalan `atelix`.
- Ikkala papkani ichiga qo'ying va push qiling:

```
atelix/
├── Atelix-frontend-main/
└── Atelix-backend-main/
```

- Har bir papkada `.gitignore` bor (`node_modules`, `.env`, `.next` chetlatilgan) — sirlar repozitoriyaga tushmaydi.
- [railway.app](https://railway.app) da hisob oching (GitHub bilan kirish qulay).

---

## 1. Railway'da loyiha va MongoDB

1. Railway'da **New Project** → **Deploy from GitHub repo** → `atelix` repozitoriyasini tanlang.
2. Loyiha ichida **New** → **Database** → **Add MongoDB** ni bosing. Railway avtomatik `MONGO_URL` o'zgaruvchisini yaratadi (bizga aynan shu kerak).

---

## 2. Backend xizmati

1. Loyihada **New** → **GitHub Repo** → o'sha `atelix` repozitoriyasini qo'shing (yoki avtomatik yaratilganini ishlating).
2. Xizmat **Settings → Root Directory** ni `Atelix-backend-main` qilib belgilang.
3. **Variables** bo'limiga quyidagilarni qo'shing:

| O'zgaruvchi | Qiymat |
|---|---|
| `MONGODB_URI` | `${{ MongoDB.MONGO_URL }}` *(o'zgaruvchi havolasi — MongoDB xizmati nomiga qarab)* |
| `JWT_SECRET` | uzun tasodifiy satr (pastda generatsiya) |
| `JWT_EXPIRES` | `30d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | *(hozircha bo'sh qoldiring — frontend manzili tayyor bo'lgach to'ldiramiz)* |

> `PORT` ni O'ZINGIZ qo'shmang — Railway avtomatik beradi, kod uni o'qiydi.

JWT_SECRET generatsiya qilish (terminalda):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

4. **Settings → Networking → Generate Domain** ni bosing. Backend manzilini nusxa oling, masalan:
   `https://atelix-backend-production.up.railway.app`
5. Xizmat qayta deploy bo'lib, `/api/health` orqali "healthy" bo'lishini kuting (railway.json'da healthcheck sozlangan).

---

## 3. Frontend xizmati

1. Loyihada yana **New** → **GitHub Repo** → o'sha `atelix` repozitoriyasi.
2. **Settings → Root Directory** ni `Atelix-frontend-main` qilib belgilang.
3. **Variables** bo'limiga:

| O'zgaruvchi | Qiymat |
|---|---|
| `NEXT_PUBLIC_API_URL` | backend manzili, oxirida `/` YO'Q — masalan `https://atelix-backend-production.up.railway.app` |
| `NEXT_PUBLIC_SITE_URL` | frontend manzili (4-qadamdan keyin to'ldiring) |

> ⚠️ **Muhim:** `NEXT_PUBLIC_*` o'zgaruvchilar **build paytida** kodga yoziladi. Ularni o'zgartirsangiz — frontend'ni **qayta deploy** qiling (Redeploy).
>
> ⚠️ Frontend xizmatida `NODE_ENV=production` ni **qo'shmang** — Tailwind/TypeScript devDependencies'da bo'lgani uchun build buzilishi mumkin. Railway o'zi to'g'ri o'rnatadi.

4. **Generate Domain** ni bosing, frontend manzilini oling, masalan:
   `https://atelix-production.up.railway.app`
5. Endi shu manzilni ikki joyga yozing:
   - Frontend'ning `NEXT_PUBLIC_SITE_URL` o'zgaruvchisiga.
   - Backend'ning `CLIENT_URL` o'zgaruvchisiga (bir nechta bo'lsa vergul bilan).
6. Ikkala xizmatni **Redeploy** qiling (o'zgaruvchilar yangilangani uchun).

---

## 4. Ma'lumotlar bazasini to'ldirish (seed) — ixtiyoriy

Namuna foydalanuvchilar/tikuvchilar bilan boshlash uchun bir marta seed ishga tushiring. **Diqqat:** seed eski ma'lumotlarni o'chiradi — faqat toza bazada ishlating.

Eng oson yo'l — Railway CLI:

```bash
npm i -g @railway/cli
railway login
railway link            # atelix loyihasini tanlang
# backend xizmati konteksti bilan seed'ni ishga tushiramiz:
railway run --service <backend-xizmat-nomi> npm run seed
```

`railway run` MONGODB_URI kabi o'zgaruvchilarni avtomatik uzatadi. Seed tugagach namuna hisoblar:

- Mijoz: `ali@example.com` / `parol123`
- Tikuvchi: `aziza@atelix.uz` / `parol123`
- Admin: `admin@atelix.uz` / `admin123`

> Productionda seed'dan keyin bu parollarni almashtiring yoki namuna hisoblarni o'chiring.

---

## 5. Tekshirish

- Frontend manzilini oching → bosh sahifa chiqishi kerak.
- Ro'yxatdan o'ting, o'lchov kiriting, buyurtma bering.
- **Chat / bildirishnoma (WebSocket):** Railway WebSocket'ni qo'llab-quvvatlaydi. `NEXT_PUBLIC_API_URL` `https://` bo'lsa, Socket.io avtomatik `wss://` ga o'tadi. Ikki brauzerda kirib chatni sinang.
- Backend holati: `https://<backend>/api/health` → `{"status":"ok","db":"connected"}`.

---

## 6. Xavfsizlik (majburiy)

- 🔴 Eski `.env` faylidagi **haqiqiy MongoDB parolini** (agar oldin GitHub'ga tushgan bo'lsa) Railway'da **yangilang/rotate** qiling. Yangi bazada bu muammo yo'q.
- `JWT_SECRET` — uzun, tasodifiy va faqat Railway Variables'da bo'lsin (kodga yozманг).
- `.env` fayllar hech qachon Git'ga tushmasin (`.gitignore` allaqachon sozlangan).
- Kelajakda: rasm yuklash hozir base64 sifatida bazada saqlanadi (demo uchun yaxshi). Katta miqyosda Railway Volume yoki tashqi obyekt-xotira (S3 / Cloudinary) ga o'tish tavsiya etiladi.

---

## 7. Keng tarqalgan muammolar

| Belgi | Sabab / Yechim |
|---|---|
| Frontend'da "Network Error" | `NEXT_PUBLIC_API_URL` noto'g'ri yoki oxirida `/` bor. To'g'rilab **redeploy**. |
| CORS xatosi | Backend `CLIENT_URL` frontend manziliga to'g'ri kelmaydi. To'g'rilab backend'ni redeploy. |
| Chat ulanmayapti | `NEXT_PUBLIC_API_URL` `https://` ekanini va backend ishlab turganini tekshiring. |
| Frontend build "tailwind/tsc topilmadi" | Frontend'da `NODE_ENV=production` qo'yilgan — olib tashlang. |
| DB "disconnected" | `MONGODB_URI` havolasi noto'g'ri. `${{ MongoDB.MONGO_URL }}` ni tekshiring. |
| 502 / crash | Backend logs'ni ko'ring; ko'pincha yetishmayotgan env o'zgaruvchi. |

---

Savol bo'lsa — men Railway'ni brauzerda birga ochib, bosqichma-bosqich o'tishga ham yordam bera olaman.
