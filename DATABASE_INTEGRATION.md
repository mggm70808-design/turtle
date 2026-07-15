# قاعدة البيانات المشتركة (Shared Database)

## 📊 البوت والداشبورد - نفس القاعدة

البوت والداشبورد يستخدمان **نفس PostgreSQL Database** للقراءة والكتابة.

```
┌─────────────┐         ┌───────────────┐
│  Discord    │         │  Discord Bot  │
│   Users     │◄───────►│  (TitanBot)   │
└─────────────┘         └───────────────┘
       ▲                        ▲
       │                        │
       │    PostgreSQL DB       │
       │   (titanbot_db)        │
       │                        │
       │                        │
┌──────┴────────────────────────┴──────┐
│                                      │
│  Dashboard (Web UI)                  │
│  - يقرأ البيانات                     │
│  - يعدّل الإعدادات                   │
│  - يعرض الإحصائيات                   │
│                                      │
└──────────────────────────────────────┘
```

---

## 📁 جداول قاعدة البيانات

### الجداول الأساسية:

#### 1. `users` - المستخدمين
```sql
id: bigint (Discord User ID)
username: text
discriminator: text
avatar: text (avatar hash)
global_name: text
locale: text
created_at: timestamp
updated_at: timestamp
```

#### 2. `guilds` - السيرفرات
```sql
guild_id: bigint
guild_name: text
owner_id: bigint
member_count: int
created_at: timestamp
updated_at: timestamp
```

#### 3. `user_levels` - النقاط والمستويات
```sql
user_id: bigint
guild_id: bigint
level: int
experience: bigint
created_at: timestamp
updated_at: timestamp
```

#### 4. `moderation_logs` - سجل الإجراءات
```sql
id: serial
guild_id: bigint
user_id: bigint
action_type: text (kick, ban, mute, warn)
reason: text
timestamp: timestamp
moderator_id: bigint (من قام بالإجراء)
```

#### 5. `commands_config` - إعدادات الأوامر
```sql
command_id: serial
command_name: text
guild_id: bigint
enabled: boolean
category: text
permissions_required: text[]
```

#### 6. `guild_settings` - إعدادات السيرفر
```sql
guild_id: bigint
prefix: text (البادئة)
welcome_enabled: boolean
welcome_message: text
welcome_channel_id: bigint
autorole_enabled: boolean
autorole_id: bigint
logs_channel_id: bigint
```

#### 7. `user_stats` - إحصائيات المستخدم
```sql
user_id: bigint
guild_id: bigint
messages_sent: bigint
messages_deleted: bigint
warnings_count: int
kicks: int
bans: int
```

---

## 🔄 كيف يعمل الربط

### عند فتح الداشبورد:

1. **المستخدم ينقر "Login with Discord"**
   ```
   Dashboard → Discord OAuth
   ```

2. **الداشبورد يخزن معلومات المستخدم**
   ```
   NextAuth.js Session → PostgreSQL
   ```

3. **الداشبورد يقرأ البيانات من قاعدة البيانات**
   ```
   GET /api/stats → SELECT * FROM stats WHERE guild_id = ?
   GET /api/members → SELECT * FROM users WHERE guild_id = ?
   GET /api/moderation/logs → SELECT * FROM moderation_logs
   ```

### عند التعديل (مثلاً: تغيير الإعدادات):

1. **المستخدم يرسل البيانات**
   ```
   POST /api/settings {prefix: "!", features: [...]}
   ```

2. **الداشبورد يحدّث قاعدة البيانات**
   ```
   UPDATE guild_settings SET prefix = '!' WHERE guild_id = ?
   ```

3. **البوت يقرأ التحديثات**
   ```
   البوت يفحص قاعدة البيانات بشكل دوري
   → يطبق الإعدادات الجديدة
   ```

---

## 🔐 التصاريح والأمان (Permissions)

### المستخدم الذي يفتح الداشبورد:
- ✅ يجب أن يكون له `MANAGE_GUILD` permission في السيرفر
- ✅ يجب أن يكون البوت في نفس السيرفر
- ✅ يجب أن يكون البوت لديه permissions كافية

### البوت نفسه يحتاج:
- ✅ `MANAGE_GUILD`
- ✅ `MANAGE_ROLES`
- ✅ `MANAGE_CHANNELS`
- ✅ `MODERATE_MEMBERS`
- ✅ `BAN_MEMBERS`
- ✅ `KICK_MEMBERS`
- ✅ وغيره حسب الأوامر

---

## 📝 أمثلة استعلامات SQL

### الحصول على إحصائيات البوت:

```sql
-- عدد السيرفرات
SELECT COUNT(DISTINCT guild_id) as guild_count FROM guilds;

-- عدد المستخدمين
SELECT COUNT(*) as user_count FROM users;

-- إجمالي الرسائل
SELECT SUM(messages_sent) as total_messages FROM user_stats;
```

### الحصول على أعضاء السيرفر:

```sql
SELECT u.*, ul.level, ul.experience
FROM users u
LEFT JOIN user_levels ul ON u.id = ul.user_id
WHERE ul.guild_id = $1
ORDER BY ul.experience DESC;
```

### الحصول على سجل الإجراءات:

```sql
SELECT *
FROM moderation_logs
WHERE guild_id = $1
ORDER BY timestamp DESC
LIMIT 50;
```

### الحصول على إعدادات السيرفر:

```sql
SELECT *
FROM guild_settings
WHERE guild_id = $1;
```

---

## 🛠️ كيفية استخدام Database من الداشبورد

### في `/dashboard/lib/db.ts`:

```typescript
import { query } from './db';

// الحصول على بيانات
async function getGuildSettings(guildId: string) {
  const result = await query(
    'SELECT * FROM guild_settings WHERE guild_id = $1',
    [guildId]
  );
  return result.rows[0];
}

// التحديث
async function updateGuildPrefix(guildId: string, prefix: string) {
  await query(
    'UPDATE guild_settings SET prefix = $1 WHERE guild_id = $2',
    [prefix, guildId]
  );
}
```

### في API endpoints:

```typescript
// /dashboard/app/api/settings/route.ts
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const guildId = req.nextUrl.searchParams.get('guild_id');
  
  const result = await query(
    'SELECT * FROM guild_settings WHERE guild_id = $1',
    [guildId]
  );
  
  return Response.json(result.rows[0]);
}
```

---

## ⚠️ ملاحظات مهمة

### 1. **استخدم Parameterized Queries:**
```typescript
// ✅ صحيح
query('SELECT * FROM users WHERE id = $1', [userId]);

// ❌ خطير (SQL Injection)
query(`SELECT * FROM users WHERE id = ${userId}`);
```

### 2. **تفعيل SSL للـ production:**
```env
POSTGRES_SSL=require
```

### 3. **استخدم Connection Pooling:**
```typescript
// القائمة بالفعل في db.ts
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 4. **حماية البيانات الحساسة:**
- لا تسجّل passwords
- لا تخزّن tokens حساسة
- استخدم environment variables

---

## 🔄 Sync بين البوت والداشبورد

### كيف يبقيان متزامنان؟

**التحديث التلقائي:**
```
البوت ← يقرأ من DB مباشرة عند التشغيل
↓
Dashboard ← يعرض نفس البيانات
↓
المستخدم يعدّل ← يكتب في DB
↓
البوت ← يقرأ التحديثات في المرة القادمة
```

**للتحديث الفوري (Real-time):**
- استخدم WebSockets (اختياري)
- أو: البوت يتفقّد كل دقيقة

---

## 📊 Monitoring و Backups

### نسخ احتياطية:

```bash
# في root folder:
./scripts/backup-db.sh
```

### التحقق من الحالة:

```bash
# اتصال الداشبورد
psql -c "SELECT 1" $DATABASE_URL

# عدد الجداول
psql -c "\dt" $DATABASE_URL
```

---

## ❓ أسئلة شائعة

**س: هل البوت والداشبورد يستخدمان نفس database؟**
ج: نعم! نفس PostgreSQL database.

**س: هل يمكن أن أضيف جداول جديدة؟**
ج: نعم! أضف الجداول وحدّث الـ API endpoints.

**س: كيف أتأكد من التزامن؟**
ج: كلاهما يقرآن من نفس البيانات مباشرة.

**س: هل يمكن تشغيل داشبورد متعدد؟**
ج: نعم! كلها تقرأ من نفس DB.

---

## 📚 ملفات إضافية

- `CONNECT_BOT_TO_DASHBOARD.md` - ربط كامل
- `QUICK_CONNECT.md` - ربط سريع
- `/dashboard/lib/db.ts` - Database utilities
- `/dashboard/app/api/` - API endpoints

---

**Version:** 1.0  
**Last Updated:** July 15, 2026
