# 🚂 Railway + Dashboard: دليل الربط الكامل

## المشكلة الحالية:
- البوت يعمل على Railway
- الداشبورد سيعمل على Vercel أو مكان آخر
- كيف نربطهم معاً؟

## الحل:

### 1️⃣ **استخدام نفس قاعدة البيانات:**

البوت و الداشبورد يجب أن يشاركان نفس DATABASE_URL

```env
# في البوت (Railway):
DATABASE_URL=postgresql://user:pass@host:port/database

# في الداشبورد (.env.local):
DATABASE_URL=postgresql://user:pass@host:port/database
```

**كيف تحصل على DATABASE_URL من Railway:**
1. اذهب إلى Railway dashboard
2. اختر project البوت
3. اضغط على database service
4. انسخ CONNECTION_URL
5. ضعها في الداشبورد .env.local

---

## 2️⃣ **إضافة Webhook API في البوت:**

البوت يحتاج endpoint لتلقي الأوامر من الداشبورد.

### أضف هذا في `src/api/` أو `src/routes/`:

```javascript
// src/api/webhook.js
const express = require('express');
const router = express.Router();

// التحقق من الـ Secret Key
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// API لتحديث الإعدادات
router.post('/webhook/settings', (req, res) => {
  const { secret, guildId, settings } = req.body;
  
  if (secret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // احفظ الإعدادات في DB
  db.query('UPDATE guild_settings SET ? WHERE guild_id = ?', 
    [settings, guildId]);
  
  res.json({ success: true });
});

// API لتنفيذ أوامر الـ Moderation
router.post('/webhook/moderation', (req, res) => {
  const { secret, guildId, userId, action, reason } = req.body;
  
  if (secret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // نفذ الأمر (kick, ban, mute, etc)
  const guild = client.guilds.cache.get(guildId);
  const member = guild.members.cache.get(userId);
  
  if (action === 'kick') member.kick(reason);
  if (action === 'ban') member.ban({ reason });
  if (action === 'mute') {
    member.timeout(3600000, reason); // 1 hour
  }
  
  // احفظ في Logs
  db.query(
    'INSERT INTO moderation_logs (guild_id, mod_id, user_id, action, reason) VALUES (?, ?, ?, ?, ?)',
    [guildId, 'dashboard', userId, action, reason]
  );
  
  res.json({ success: true, action: action });
});

// API لتفعيل/تعطيل الأوامر
router.post('/webhook/commands', (req, res) => {
  const { secret, guildId, commandId, enabled } = req.body;
  
  if (secret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  db.query('UPDATE commands SET enabled = ? WHERE guild_id = ? AND command_id = ?',
    [enabled, guildId, commandId]);
  
  res.json({ success: true });
});

module.exports = router;
```

### في `src/app.js` أو `src/index.js`:

```javascript
const webhookRouter = require('./api/webhook');
app.use('/api', webhookRouter);
```

---

## 3️⃣ **تحديث الداشبورد للتواصل مع البوت:**

### أنشئ ملف helper:

```typescript
// dashboard/lib/bot-webhook.ts
const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL; // https://bot-railway.up.railway.app/api
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function callBotWebhook(endpoint: string, data: any) {
  try {
    const response = await fetch(`${BOT_WEBHOOK_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: WEBHOOK_SECRET,
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bot webhook error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Bot webhook call failed:', error);
    throw error;
  }
}

// أمثلة استخدام:
export function updateBotSettings(guildId: string, settings: any) {
  return callBotWebhook('webhook/settings', { guildId, settings });
}

export function executeModerationAction(
  guildId: string,
  userId: string,
  action: 'kick' | 'ban' | 'mute',
  reason: string
) {
  return callBotWebhook('webhook/moderation', { 
    guildId, 
    userId, 
    action, 
    reason 
  });
}

export function toggleCommand(guildId: string, commandId: string, enabled: boolean) {
  return callBotWebhook('webhook/commands', { 
    guildId, 
    commandId, 
    enabled 
  });
}
```

### استخدمه في الـ API:

```typescript
// dashboard/app/api/commands/[id]/toggle/route.ts
import { toggleCommand } from '@/lib/bot-webhook';

export async function POST(req: Request, { params }: any) {
  const { id } = params;
  const { guildId, enabled } = await req.json();

  try {
    // استدعي البوت
    await toggleCommand(guildId, id, enabled);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to toggle command' }, { status: 500 });
  }
}
```

---

## 4️⃣ **إعدادات البيئة:**

### في Railway (للبوت):

```
DATABASE_URL=postgresql://...
DISCORD_TOKEN=your_token
WEBHOOK_SECRET=your-super-secret-key-12345
```

### في Vercel/Dashboard (.env.local):

```
DATABASE_URL=postgresql://... (نفس الـ DATABASE_URL)
NEXTAUTH_URL=http://localhost:3000 (production: https://your-domain.com)
NEXTAUTH_SECRET=your-nextauth-secret
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
BOT_WEBHOOK_URL=https://bot-railway.up.railway.app/api
WEBHOOK_SECRET=your-super-secret-key-12345 (نفس السر في البوت)
```

---

## 5️⃣ **خطوات التشغيل:**

### أولاً: Railway

```bash
# 1. في مشروع البوت:
cd .. (الجذر)

# 2. أضف webhook endpoints للـ app.js

# 3. ثبت dependencies (express, if needed):
npm install express

# 4. أضف env vars إلى Railway dashboard:
#    - DATABASE_URL
#    - DISCORD_TOKEN
#    - WEBHOOK_SECRET

# 5. Deploy
git add .
git commit -m "Add webhook endpoints for dashboard"
git push railway main
```

### ثانياً: Dashboard على Vercel

```bash
# 1. انسخ .env.example إلى .env.local
cd dashboard
cp .env.example .env.local

# 2. ثبت dependencies
npm install

# 3. أضف env vars:
# BOT_WEBHOOK_URL
# WEBHOOK_SECRET
# DATABASE_URL
# إلخ

# 4. اختبر locally
npm run dev

# 5. Deploy إلى Vercel
vercel deploy
```

### ثالثاً: بعد Deployment

```
أضف env vars إلى Vercel dashboard:
1. اذهب: https://vercel.com/dashboard
2. اختر project الداشبورد
3. Settings → Environment Variables
4. أضف كل المتغيرات
5. Deploy مرة جديدة
```

---

## 6️⃣ **اختبار الاتصال:**

### من الداشبورد:

```typescript
// اختبر webhook
async function testWebhook() {
  try {
    const response = await fetch('http://localhost:3000/api/test-webhook', {
      method: 'POST',
      body: JSON.stringify({
        guildId: '123456789',
        action: 'test'
      })
    });
    const data = await response.json();
    console.log('[v0] Webhook test:', data);
  } catch (error) {
    console.error('[v0] Webhook test failed:', error);
  }
}
```

### تفعيل endpoint للاختبار:

```typescript
// dashboard/app/api/test-webhook/route.ts
import { callBotWebhook } from '@/lib/bot-webhook';

export async function POST() {
  try {
    const result = await callBotWebhook('webhook/settings', {
      guildId: 'test',
      settings: { test: true }
    });
    return Response.json({ success: true, result });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

---

## ✅ النتيجة النهائية:

```
Railway Bot ←→ PostgreSQL Database ←→ Vercel Dashboard
      ↑                                      ↓
      └──── Webhook API Calls (آمن) ────────┘
```

### ما يحدث:

1. الداشبورد يقرأ من Database
2. المستخدم يعدّل إعدادات في الداشبورد
3. الداشبورد ينادي webhook في البوت
4. البوت ينفذ التغييرات تلقائياً
5. كل شيء يُحفظ في Database

---

## 🔐 أمان إضافي:

```typescript
// تحقق من IP في البوت
router.post('/webhook/settings', (req, res) => {
  const clientIp = req.ip;
  const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || [];
  
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: 'IP not allowed' });
  }
  
  // ... باقي الكود
});

// أو استخدم API Key بدل Secret
const API_KEY = req.headers['x-api-key'];
if (API_KEY !== process.env.BOT_API_KEY) {
  return res.status(401).json({ error: 'Invalid API key' });
}
```

---

## 🆘 المشاكل الشائعة:

### المشكلة: "Failed to connect to bot webhook"
- تحقق: هل Railway URL صحيح؟
- تحقق: هل WEBHOOK_SECRET متطابق في الاثنين؟
- تحقق: هل Database URL صحيح؟

### المشكلة: "Database connection refused"
- تحقق: هل DATABASE_URL صحيح؟
- تحقق: هل IP whitelisting صحيح في Railway?
- تحقق: هل PostgreSQL يعمل؟

### المشكلة: "Settings not updating in bot"
- تحقق: هل webhook endpoint موجود في البوت؟
- تحقق: هل البوت يسمع الـ POST requests؟
- تحقق: هل الأخطاء في terminal البوت؟

---

## 📊 الملخص:

✅ نفس قاعدة بيانات  
✅ Webhook API من الداشبورد للبوت  
✅ Webhook Secret للأمان  
✅ Environment variables صحيحة  
✅ كل شيء آمن ومرن  

كل تعديل في الداشبورد = أمر فوري للبوت! 🚀

---

## 📁 الملفات الواجب إنشاؤها/تعديلها:

```
البوت (Railway):
├── src/api/webhook.js ........... NEW (endpoints للداشبورد)
├── src/app.js ................... EDIT (أضف webhook router)
└── .env ......................... EDIT (أضف WEBHOOK_SECRET)

الداشبورد:
├── lib/bot-webhook.ts .......... NEW (helper functions)
├── app/api/commands/[id]/toggle/route.ts ... EDIT (استخدم webhook)
├── app/api/settings/route.ts ... EDIT (استخدم webhook)
└── .env.local .................. EDIT (أضف BOT_WEBHOOK_URL)
```

هل تريد مساعدة في أي خطوة من هذه الخطوات؟
