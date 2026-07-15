# ربط الداشبورد بالبوت (Connect Dashboard to Bot)

## 🔗 الخطوات الأساسية للربط

هذا الملف يشرح كيفية ربط TitanBot Discord Bot مع الداشبورد web dashboard.

---

## 1️⃣ متطلبات أساسية (Prerequisites)

قبل البدء، تأكد من أن لديك:

- ✅ **Discord Bot Token** - من Discord Developer Portal
- ✅ **Client ID** - معرّف التطبيق من Discord Developer Portal  
- ✅ **Client Secret** - السر من OAuth 2.0 settings
- ✅ **Database URL** - نفس قاعدة البيانات PostgreSQL للبوت
- ✅ **Bot يعمل** - TitanBot مشغّل ومتصل بـ PostgreSQL

---

## 2️⃣ الحصول على بيانات Discord

### أ) الذهاب إلى Discord Developer Portal:
1. افتح [Discord Developer Portal](https://discord.com/developers/applications)
2. اختر تطبيقك (أو انشئ واحد جديد)
3. انتقل إلى "OAuth 2" من الجانب الأيسر

### ب) النسخ:
- **Client ID** → انسخه من معلومات التطبيق
- **Client Secret** → انسخه من OAuth 2
- **Authorization Code Grant** → تفعّله إن لم يكن مفعّل

### ج) إضافة Redirect URI:
في OAuth 2 > Redirects، أضف:
```
http://localhost:3000/api/auth/callback/discord
```

للإنتاج (Production):
```
https://yourdomain.com/api/auth/callback/discord
```

---

## 3️⃣ إعداد ملف البيئة

### في مجلد الداشبورد (`/dashboard`):

```bash
cd dashboard
cp .env.example .env.local
```

### ثم عدّل `.env.local`:

```env
# Discord OAuth - خذها من Discord Developer Portal
DISCORD_CLIENT_ID=123456789012345678
DISCORD_CLIENT_SECRET=your_super_secret_key_here

# NextAuth Secret - اعمل واحد جديد (يمكن استخدام: openssl rand -base64 32)
NEXTAUTH_SECRET=your_random_secret_key_at_least_32_characters

# URLs
NEXTAUTH_URL=http://localhost:3000
# أو للإنتاج: NEXTAUTH_URL=https://yourdomain.com

# نفس قاعدة البيانات للبوت
DATABASE_URL=postgresql://user:password@host:5432/titanbot
POSTGRES_URL=postgresql://user:password@host:5432/titanbot

# البيئة
NODE_ENV=development
```

---

## 4️⃣ التحقق من قاعدة البيانات

**مهم جداً:** الداشبورد والبوت يجب أن يستخدموا **نفس قاعدة البيانات PostgreSQL**

### تحقق من:

✅ اسم قاعدة البيانات متطابق  
✅ Host/Port متطابق  
✅ Username/Password متطابق  

مثال:
```
البوت:       postgresql://user:pass@localhost:5432/titanbot
الداشبورد:    postgresql://user:pass@localhost:5432/titanbot
```

---

## 5️⃣ التشغيل المحلي (Local Development)

### الخطوة الأولى - شغّل البوت:
```bash
cd /vercel/share/v0-project
npm start  # أو حسب package.json الخاص بك
```

### الخطوة الثانية - شغّل الداشبورد:
```bash
cd dashboard
npm install  # إذا لم تثبّت قبلاً
npm run dev
```

### افتح المتصفح:
```
http://localhost:3000
```

يجب أن ترى صفحة تسجيل دخول Discord!

---

## 6️⃣ اختبار الربط

### 1. اضغط "Login with Discord"
### 2. يجب أن تظهر صفحة Discord للموافقة
### 3. افتح الموافقة واختر السيرفر (Guild)
### 4. يجب أن تعود إلى الداشبورد
### 5. يجب أن ترى إحصائيات البوت والأعضاء وغيره

إذا حدث خطأ:
- شيك Console (F12) للأخطاء
- شيك Terminal للـ server errors
- تأكد من NEXTAUTH_SECRET و DISCORD_* صحيح

---

## 7️⃣ هياكل الاتصال

### الداشبورد يقرأ من قاعدة البيانات:

```
Dashboard → PostgreSQL Database ← TitanBot
                 ↓
         جداول البوت:
         - users
         - guilds
         - user_levels
         - moderation_logs
         - commands_config
         - guild_settings
```

### والداشبورد يتواصل مع Discord API:

```
Dashboard → Discord API ← Bot
    يسأل عن:
    ✓ معلومات الأعضاء
    ✓ معلومات السيرفرات
    ✓ تصاريح المستخدم
```

---

## 8️⃣ البيانات المشاركة (Shared Data)

الداشبورد يقرأ من هذه الجداول:

| الجدول | الغرض |
|-------|-------|
| `guilds` | معلومات السيرفرات |
| `users` | معلومات الأعضاء |
| `user_levels` | النقاط والمستويات |
| `moderation_logs` | سجل الإجراءات |
| `commands_config` | إعدادات الأوامر |
| `guild_settings` | إعدادات السيرفر |

---

## 9️⃣ حل المشاكل الشائعة

### ❌ "Database connection refused"
**الحل:** تأكد من:
- قاعدة البيانات تشتغل
- USERNAME/PASSWORD صحيح
- HOST/PORT صحيح
- قاعدة البيانات موجودة

### ❌ "Invalid client_id"
**الحل:**
- تحقق من DISCORD_CLIENT_ID في .env
- انسخه من Discord Developer Portal مجدداً

### ❌ "redirect_uri_mismatch"
**الحل:**
- تأكد من Redirect URI في Discord matches تماماً:
  ```
  http://localhost:3000/api/auth/callback/discord
  ```

### ❌ "No guild data showing"
**الحل:**
- تأكد من البوت موجود في السيرفر
- تأكد من البوت لديه permissions صحيحة
- تأكد من database connected صحيح

---

## 🔟 النشر (Deployment)

### عند النشر على الإنتاج:

1. **Update Discord Redirect URI:**
   ```
   https://yourdomain.com/api/auth/callback/discord
   ```

2. **Update .env.local (أو env vars في Vercel):**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   DATABASE_URL=your_production_database_url
   NEXTAUTH_SECRET=generate_new_random_secret
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

---

## 1️⃣1️⃣ الأمان (Security)

⚠️ **مهم جداً:**

✅ **لا تضع** CLIENT_SECRET أو DATABASE_PASSWORD في الكود  
✅ **استخدم** .env.local للتطوير  
✅ **استخدم** Environment Variables في الإنتاج  
✅ **غير** NEXTAUTH_SECRET كل مرة للإنتاج  
✅ **استخدم** HTTPS دائماً في الإنتاج  
✅ **تحقق** من OAuth scopes المطلوبة  

---

## 1️⃣2️⃣ التحديث المستقبلي

إذا أضفت features جديدة للبوت:

1. أضف جداول جديدة في PostgreSQL
2. أضف API endpoints في `/dashboard/app/api/`
3. أضف pages جديدة في `/dashboard/app/dashboard/`
4. استخدم نفس database connection

---

## 📚 الملفات المهمة

| الملف | الغرض |
|------|-------|
| `/dashboard/.env.local` | متغيرات البيئة |
| `/dashboard/lib/auth.ts` | إعداد NextAuth |
| `/dashboard/lib/db.ts` | قاعدة البيانات |
| `/dashboard/app/api/` | API endpoints |
| `/vercel/share/v0-project/.env` | متغيرات البوت |

---

## ✅ Checklist قبل الذهاب للإنتاج

- [ ] البوت يشتغل بشكل صحيح
- [ ] قاعدة البيانات تشتغل بشكل صحيح
- [ ] Discord credentials صحيحة
- [ ] NEXTAUTH_SECRET مجدد
- [ ] Redirect URI محدث
- [ ] Database URL صحيح
- [ ] جميع migrations اشتغلت
- [ ] الداشبورد يفتح ويظهر البيانات محلياً
- [ ] جميع الأزرار والفيلترات تشتغل

---

## 📞 مساعدة إضافية

اذا واجهت مشكلة:

1. تحقق من Console (F12) للأخطاء الـ Frontend
2. تحقق من Terminal للـ Server errors  
3. تحقق من PostgreSQL logs
4. تحقق من Discord API status
5. اقرأ الـ documentation في `/dashboard/README.md`

---

**Version:** 1.0  
**Last Updated:** July 15, 2026  
**Status:** ✅ Ready to Use
