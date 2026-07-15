# 🚀 دليل الإعداد النهائي: Railway Bot + Vercel Dashboard

## ✨ ماذا لديك الآن:

✅ **TitanBot Discord Bot** (يعمل على Railway)  
✅ **Web Dashboard** (جاهز للـ Vercel)  
✅ **Webhook System** (للتواصل بينهم)  
✅ **Shared Database** (PostgreSQL)  

---

## 📋 الخطوات: (ترتيب مهم!)

### مرحلة 1: تحضير المتغيرات (15 دقيقة)

```
1️⃣ Discord Credentials
   https://discord.com/developers/applications
   - CLIENT_ID
   - CLIENT_SECRET
   - TOKEN

2️⃣ Railway Database
   https://railway.app
   - DATABASE_URL (CONNECTION_URL)

3️⃣ أنشئ Secrets
   openssl rand -base64 32
   - WEBHOOK_SECRET
   - NEXTAUTH_SECRET
```

👉 **اقرأ:** `ENV_SETUP_RAILWAY.md` (شرح مفصل)

---

### مرحلة 2: إعداد البوت على Railway (10 دقائق)

```bash
# 1. في مشروع البوت (الجذر)
cd /vercel/share/v0-project

# 2. أضف webhook endpoints (موجود بالفعل)
# File: src/api/webhook.js ✓ (موجود)

# 3. تأكد من إضافته في app.js
# ابحث عن:
const webhookRouter = require('./api/webhook');
app.use('/api', webhookRouter);

# 4. أضف env vars في Railway dashboard:
DATABASE_URL=...
DISCORD_TOKEN=...
WEBHOOK_SECRET=...

# 5. Deploy
git add .
git commit -m "Add webhook endpoints"
git push
```

---

### مرحلة 3: إعداد Dashboard (10 دقائق)

```bash
# 1. انتقل للداشبورد
cd dashboard

# 2. أنشئ ملف البيئة
cp .env.example .env.local

# 3. احرر .env.local وأضف:
DATABASE_URL=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
BOT_WEBHOOK_URL=https://bot-railway.up.railway.app/api
WEBHOOK_SECRET=...

# 4. اختبر locally
npm install
npm run dev

# 5. افتح: http://localhost:3000
```

---

### مرحلة 4: Deploy على Vercel (5 دقائق)

```bash
# من folder الداشبورد
cd dashboard

# 1. Connect to Vercel
vercel

# 2. أضف environment variables:
# - اذهب: https://vercel.com/dashboard
# - Project Settings → Environment Variables
# - أضف كل المتغيرات

# 3. Deploy
vercel --prod
```

---

## 🎯 ملفات الإعداد الجاهزة:

### في البوت:
```
✅ src/api/webhook.js ..................... Webhook endpoints (جديد)
   ├─ POST /webhook/settings
   ├─ POST /webhook/moderation
   ├─ POST /webhook/commands
   ├─ GET /webhook/guilds/:id
   └─ GET /webhook/stats
```

### في الداشبورد:
```
✅ lib/bot-webhook.ts .................... Helper functions (جديد)
   ├─ kickMember()
   ├─ banMember()
   ├─ toggleCommand()
   ├─ updateBotSettings()
   └─ testWebhookConnection()

✅ API Routes ............................ جاهزة
   └─ كل API route يمكنه استخدام bot-webhook.ts
```

---

## 💡 كيف يعمل:

```
┌─────────────────────────────────────────┐
│     Discord User (أنت)                  │
│                                         │
│  1. تفتح Dashboard على Vercel         │
│  2. تعدّل إعدادات أو تنفذ أوامر       │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│     Dashboard API (Vercel)              │
│     - يقرأ من Database                  │
│     - يستدعي webhook في البوت          │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│     Bot Webhook (Railway)               │
│     - يتلقى الأمر                       │
│     - ينفذ الأمر على Discord           │
│     - يكتب النتيجة في Database         │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│     Discord Server                      │
│     - الأمر ينفذ فوراً! ✅             │
└─────────────────────────────────────────┘
```

---

## ✅ اختبر كل شيء:

### 1. اختبر Database Connection
```javascript
// في dashboard terminal
node -e "
require('dotenv').config({path: '.env.local'});
const { Pool } = require('pg');
const pool = new Pool();
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'DB Error:' + err : 'DB OK:', res.rows[0]);
});
"
```

### 2. اختبر Discord Login
```
1. افتح http://localhost:3000
2. اضغط "Login with Discord"
3. اختر server وافق
4. يجب أن ترى Dashboard ✓
```

### 3. اختبر Bot Webhook
```javascript
// في dashboard console
const response = await fetch('http://localhost:3000/api/test-webhook', {
  method: 'POST'
});
console.log(await response.json());
```

### 4. اختبر Moderation Command
```
1. اذهب إلى: http://localhost:3000/dashboard/moderation
2. اختر member
3. اضغط "Kick" أو أي أمر
4. يجب أن يحدث في Discord ✓
```

---

## 📚 الملفات الإضافية:

```
📄 RAILWAY_SETUP.md ............... شرح تفصيلي (الأهم!)
📄 ENV_SETUP_RAILWAY.md .......... إعدادات البيئة
📄 QUICK_CONNECT.md ............. خطوات سريعة
📄 CONNECT_BOT_TO_DASHBOARD.md .. شرح كامل
📄 DATABASE_INTEGRATION.md ....... قاعدة البيانات
📄 START_HERE.md ................. نقطة البداية
```

---

## 🚨 الأخطاء الشائعة وحلولها:

### ❌ "Cannot connect to bot"
```
✓ تحقق: BOT_WEBHOOK_URL صحيح؟
✓ تحقق: البوت شغّال على Railway؟
✓ تحقق: WEBHOOK_SECRET متطابق؟
```

### ❌ "Database connection error"
```
✓ تحقق: DATABASE_URL صحيح؟
✓ تحقق: PostgreSQL موجود؟
✓ تحقق: IP Whitelist في Railway؟
```

### ❌ "Discord OAuth failed"
```
✓ تحقق: CLIENT_ID صحيح؟
✓ تحقق: CLIENT_SECRET صحيح؟
✓ تحقق: Redirect URIs صحيح في Developer Portal؟
✓ تحقق: NEXTAUTH_URL صحيح؟
```

### ❌ "Moderation command not working"
```
✓ تحقق: Bot لديه permissions؟
✓ تحقق: Target user موجود في server؟
✓ تحقق: Bot webhook response في console؟
```

---

## 🎯 Quick Checklist:

قبل ما تبدأ:
- [ ] رقم client ID
- [ ] client secret
- [ ] discord token
- [ ] DATABASE_URL
- [ ] WEBHOOK_SECRET
- [ ] NEXTAUTH_SECRET
- [ ] BOT_WEBHOOK_URL
- [ ] البوت يعمل على Railway
- [ ] database موجود
- [ ] webhook endpoints موجودة في البوت

---

## 🏃 Order of Operations:

```
1. احصل على كل Credentials (ENV_SETUP_RAILWAY.md)
   ↓
2. أضف env vars في Railway
   ↓
3. Deploy البوت مع webhook endpoints
   ↓
4. اختبر: البوت يشتغل + database يشتغل
   ↓
5. أضف env vars في .env.local
   ↓
6. اختبر locally: npm run dev
   ↓
7. أضف env vars في Vercel
   ↓
8. Deploy على Vercel
   ↓
9. اختبر: Discord login + commands
   ↓
10. Live! 🎉
```

---

## 📞 Support:

عندك مشكلة؟

1. اقرأ terminal logs (جميع الأخطاء هناك)
2. افتح browser console (F12)
3. اقرأ RAILWAY_SETUP.md (شرح مفصل)
4. تحقق من env vars (أكثر مشكلة شايعة!)

---

## 🎉 النتيجة:

عندك الآن:
- ✅ Bot على Railway يعمل 24/7
- ✅ Dashboard على Vercel يقبض الأوامر
- ✅ التواصل بينهم آمن وموثوق
- ✅ كل التعديلات تظهر فوراً في Discord
- ✅ كل شيء مسجل في Database

**بتقدر تدير البوت كله من الداشبورد!** 🚀

---

الآن استمتع بالداشبورد! 🎊
