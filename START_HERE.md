# 🚀 ابدأ هنا: ربط البوت + الداشبورد

## 👋 مرحباً!

لديك الآن:
- ✅ **TitanBot Discord Bot** - البوت الموجود
- ✅ **Dashboard Web UI** - الداشبورد الجديد

الآن نحتاج نربطهما معاً!

---

## 📖 3 ملفات فقط:

### 1️⃣ **للبدء الفوري (5 دقائق):**
📄 `QUICK_CONNECT.md`

اتبع الخطوات 5 وخلاص! ⚡

### 2️⃣ **للشرح التفصيلي (20 دقيقة):**
📄 `CONNECT_BOT_TO_DASHBOARD.md`

شرح كامل لكل شيء وحل المشاكل 📖

### 3️⃣ **لفهم قاعدة البيانات (15 دقيقة):**
📄 `DATABASE_INTEGRATION.md`

كيف يعمل الربط بين البوت والداشبورد 📊

---

## ⚡ أسرع طريقة (5 دقائق):

```bash
# 1. انسخ البيانات من Discord
#    (اذهب: https://discord.com/developers/applications)

# 2. عدّل الإعدادات
cd dashboard
cp .env.example .env.local
# ثم ضع البيانات في .env.local

# 3. شغّل البوت
cd ..
npm start

# 4. شغّل الداشبورد
cd dashboard
npm run dev

# 5. افتح: http://localhost:3000
# اضغط "Login with Discord"
# تمام! 🎉
```

---

## 🎯 ماذا يحدث:

```
1. تسجيل الدخول بـ Discord
   ↓
2. الداشبورد يقرأ من قاعدة البيانات
   ↓
3. يعرض البيانات بشكل جميل
   ↓
4. تعدّل الإعدادات
   ↓
5. البوت يطبق التغييرات تلقائياً ✅
```

---

## ✅ علامات النجاح:

- ✅ الداشبورد يفتح
- ✅ زر Discord يظهر
- ✅ تستطيع تسجيل الدخول
- ✅ ترى الإحصائيات والأعضاء
- ✅ الأزرار تشتغل

---

## ⚙️ ما الذي تحتاجه:

```
✓ Discord Bot Token (من .env القديم)
✓ Client ID (من Developer Portal)
✓ Client Secret (من Developer Portal)
✓ Database URL (من .env القديم)
✓ البوت يشتغل بشكل صحيح
✓ Database تشتغل
```

---

## 📂 أين الملفات:

```
الداشبورد:  /dashboard/
البوت:     /src/ (الموجود)
الأدلة:    ملفات .md في الجذر
```

---

## 🆘 لو حصل خطأ:

1. اقرأ `CONNECT_BOT_TO_DASHBOARD.md` (فيه حل كل مشاكل)
2. افتح Console (F12) وشيك الأخطاء
3. شيك Terminal للـ server errors
4. تأكد من .env.local البيانات صحيحة

---

## 📋 الخطوات بالتفصيل:

**اختر واحدة:**

- 🏃 **بسرعة؟** → اقرأ `QUICK_CONNECT.md`
- 📖 **بتفاصيل؟** → اقرأ `CONNECT_BOT_TO_DASHBOARD.md`
- 🤔 **فاهم كيف يشتغل؟** → اقرأ `DATABASE_INTEGRATION.md`

---

## 🎉 جاهز؟

1. اقرأ `QUICK_CONNECT.md` (5 دقائق)
2. اتبع الخطوات
3. استمتع بالداشبورد! 🚀

---

**Version:** 1.0  
**Date:** July 15, 2026  
**Status:** ✅ Ready

👉 **ابدأ الآن:** اقرأ `QUICK_CONNECT.md`
