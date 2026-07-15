# ⚡ ربط سريع: البوت + الداشبورد (Quick Connect)

## 🚀 5 خطوات فقط (5 Steps Only)

### 1️⃣ Discord Credentials
```
اذهب: https://discord.com/developers/applications
ابحث عن تطبيقك أو اعمل واحد جديد
اذهب: OAuth 2 → General
انسخ:
  - Client ID
  - Client Secret
اضف Redirect URI:
  http://localhost:3000/api/auth/callback/discord
```

### 2️⃣ ملف البيئة
```bash
cd /vercel/share/v0-project/dashboard
cp .env.example .env.local
```

### 3️⃣ عدّل `.env.local`:
```env
# من Discord
DISCORD_CLIENT_ID=ضع_ال_ID_هنا
DISCORD_CLIENT_SECRET=ضع_السر_هنا

# اعمل واحد جديد أو استخدم: openssl rand -base64 32
NEXTAUTH_SECRET=اعمل_واحد_جديد

# نفس database البوت
DATABASE_URL=postgresql://user:password@localhost:5432/titanbot

# الـ URLs
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### 4️⃣ شغّل البوت أولاً:
```bash
cd /vercel/share/v0-project
npm start
```

### 5️⃣ شغّل الداشبورد:
```bash
cd dashboard
npm install
npm run dev
```

**افتح:** `http://localhost:3000`

---

## ✅ لما يشتغل:
- ستشوف زر "Login with Discord"
- اضغط عليه
- اختر السيرفر
- بتدخل الداشبورد! 🎉

## ❌ لما ما يشتغل:
```
شيك Console (F12):
  - أخطاء JavaScript
  - أخطاء Network

شيك Terminal:
  - أخطاء Database
  - أخطاء Server

تأكد من:
  ✓ DATABASE_URL صحيح
  ✓ DISCORD_CLIENT_ID صحيح
  ✓ DISCORD_CLIENT_SECRET صحيح
  ✓ البوت يشتغل
  ✓ قاعدة البيانات تشتغل
```

---

للتفاصيل: `../CONNECT_BOT_TO_DASHBOARD.md`
