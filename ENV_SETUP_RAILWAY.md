# ⚙️ إعدادات البيئة: Railway + Dashboard

## 📋 الملخص السريع:

تحتاج لنفس `DATABASE_URL` + `WEBHOOK_SECRET` في الاثنين!

---

## 🚂 البوت على Railway

اذهب: https://railway.app → Project → Variables

أضف هذه المتغيرات:

```
DATABASE_URL=postgresql://user:pass@host:port/db
DISCORD_TOKEN=your_bot_token
WEBHOOK_SECRET=super-secret-key-change-this-123456
NODE_ENV=production
```

### كيف تحصل على DATABASE_URL:
1. في Railway dashboard
2. اختر project البوت
3. اضغط على PostgreSQL service
4. انسخ CONNECTION_URL من tab "Connect"

### كيف تحصل على DISCORD_TOKEN:
1. https://discord.com/developers/applications
2. اختر البوت
3. اضغط "Reset Token"
4. Copy Token

### WEBHOOK_SECRET:
```bash
# اختر سر قوي (استخدم أي generator):
# مثال:
WEBHOOK_SECRET=your-random-secret-key-12345678

# أو استخدم هذا الأمر:
openssl rand -base64 32
```

---

## 🎯 الداشبورد (Vercel أو أي مكان)

أضف هذه المتغيرات:

```
# Database (نفس البوت!)
DATABASE_URL=postgresql://user:pass@host:port/db

# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000 (local)
NEXTAUTH_URL=https://your-domain.com (production)
NEXTAUTH_SECRET=generate-random-secret

# Bot Webhook
BOT_WEBHOOK_URL=https://bot-railway.up.railway.app/api
WEBHOOK_SECRET=super-secret-key-change-this-123456

# Environment
NODE_ENV=development (or production)
```

---

## 📍 أين تضع القيم:

### Local Development (.env.local في dashboard):

```bash
cd dashboard

# 1. Copy template
cp .env.example .env.local

# 2. Edit .env.local
nano .env.local
# أو استخدم أي محرر
```

### على Vercel:

```
1. https://vercel.com/dashboard
2. اختر Project
3. Settings → Environment Variables
4. أضف كل المتغيرات
5. Deploy مرة جديدة
```

---

## 🔑 الخطوات التفصيلية:

### 1️⃣ احصل على Discord Credentials:

```
https://discord.com/developers/applications
↓
Create New Application
↓
اختر اسم
↓
اذهب إلى OAuth2
↓
Copy: CLIENT_ID و CLIENT_SECRET
↓
اذهب إلى Bot
↓
Copy: TOKEN
```

### 2️⃣ احصل على DATABASE_URL:

```
https://railway.app
↓
Project → Bot
↓
PostgreSQL service
↓
Connect tab
↓
Copy CONNECTION_URL
```

### 3️⃣ أنشئ WEBHOOK_SECRET:

```bash
# في terminal:
openssl rand -base64 32

# أو استخدم أي من هذه:
# "super-secret-key-12345"
# "your-webhook-secret-change-this"
# أي شيء عشوائي وقوي
```

### 4️⃣ أنشئ NEXTAUTH_SECRET:

```bash
# في terminal:
openssl rand -base64 32
```

### 5️⃣ احصل على BOT_WEBHOOK_URL:

```
1. ذهب إلى Railway
2. اختر project البوت
3. الصفحة الرئيسية للـ service
4. اضغط "Open" أو انسخ URL
5. أضف /api في النهاية

مثال: https://bot-railway.up.railway.app/api
```

---

## ✅ قائمة التحقق:

قبل ما تبدأ تأكد من عندك:

- [ ] `DATABASE_URL` من Railway PostgreSQL
- [ ] `DISCORD_TOKEN` من Developer Portal
- [ ] `DISCORD_CLIENT_ID` من Developer Portal
- [ ] `DISCORD_CLIENT_SECRET` من Developer Portal
- [ ] `WEBHOOK_SECRET` (سر قوي)
- [ ] `NEXTAUTH_SECRET` (سر قوي)
- [ ] `BOT_WEBHOOK_URL` من Railway
- [ ] `NODE_ENV` = production

---

## 📝 مثال كامل:

### Railway (.env):
```
DATABASE_URL=postgresql://postgres:abc123@localhost:5432/titanbot
DISCORD_TOKEN=MTA1NjExNzk5Nzk5OTk5OTk5.GvX-X.abcdefghijklmnopqrstuvwxyz123456
WEBHOOK_SECRET=uI2k9pO7mL3nJ6qA8vB5cD2eF4gH7iK9lP0mR3sT5
NODE_ENV=production
```

### Dashboard (.env.local):
```
# Database
DATABASE_URL=postgresql://postgres:abc123@localhost:5432/titanbot

# Discord
DISCORD_CLIENT_ID=1056117999999999999
DISCORD_CLIENT_SECRET=uY8nL3k9oP2mJ5qV6bX9wZ2cR4tF7uI0

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=mE7nL2oR5pT8qV1bX4cZ7dF0eG3hI6jK9l

# Bot
BOT_WEBHOOK_URL=https://bot-railway.up.railway.app/api
WEBHOOK_SECRET=uI2k9pO7mL3nJ6qA8vB5cD2eF4gH7iK9lP0mR3sT5

# Env
NODE_ENV=development
```

---

## 🆘 المشاكل الشائعة:

### ❌ "Database connection refused"
- تحقق: DATABASE_URL صحيح؟
- تحقق: IP Whitelist في Railway؟
- تحقق: PostgreSQL يعمل؟

### ❌ "Webhook secret invalid"
- تحقق: WEBHOOK_SECRET متطابق في الاثنين؟
- تحقق: ما فيه مسافات أو أحرف غريبة؟

### ❌ "Bot not responding"
- تحقق: BOT_WEBHOOK_URL صحيح؟
- تحقق: البوت يعمل على Railway؟
- تحقق: Webhook endpoints موجودة في البوت؟

### ❌ "Discord OAuth not working"
- تحقق: CLIENT_ID صحيح؟
- تحقق: CLIENT_SECRET صحيح؟
- تحقق: NEXTAUTH_URL صحيح؟
- تحقق: OAuth2 redirect URIs في Developer Portal صحيح؟

---

## 🎯 الخطوة التالية:

1. اجمع كل القيم من الأعلى
2. ضعها في Railway
3. ضعها في .env.local (local)
4. ضعها في Vercel (production)
5. قراءة: RAILWAY_SETUP.md
6. ابدأ اختبار!

---

## 📚 ملفات مرتبطة:

- `RAILWAY_SETUP.md` ........... شرح كامل للربط
- `QUICK_CONNECT.md` .......... خطوات سريعة
- `.env.example` ............. template البيئة

---

**ملاحظة مهمة:** احفظ القيم في مكان آمن! لا تشاركها مع أحد! 🔐
