# TitanBot Dashboard - Setup & Implementation Guide

## Overview

A complete web dashboard for managing TitanBot has been created in the `/dashboard` directory. This is a separate Next.js 16 application that connects to the same PostgreSQL database as your bot.

## What's Been Built

### ✅ Completed Features

1. **Authentication System**
   - Discord OAuth 2.0 integration with NextAuth.js
   - Secure session management with JWT tokens
   - Protected routes with automatic redirects
   - Session persistence across tabs

2. **Dashboard Overview Page**
   - Bot statistics (guilds, members, uptime, commands used)
   - Real-time stats fetched from database
   - Recent activity timeline
   - Quick action buttons

3. **Member Management**
   - View all server members
   - Search and filtering functionality
   - Member joining date and level display
   - Pagination support (20 members per page)
   - Bulk action placeholders

4. **Moderation Logs**
   - View all moderation actions
   - Filter by action type (warn, kick, ban, timeout)
   - Display moderator, target, reason, and timestamp
   - Reverse action buttons (placeholder)
   - Pagination support

5. **Command Management**
   - View all bot commands with descriptions
   - Enable/disable commands with toggles
   - Filter by category or search
   - Display cooldown information
   - Settings per-command (placeholder)

6. **Server Settings**
   - Configure command prefix
   - Welcome message settings (enable/disable, message content, channel)
   - Feature toggles (logging, music, economy)
   - Settings persistence in database
   - Success/error notifications

7. **User Interface**
   - Responsive sidebar navigation
   - Dark theme (Discord-inspired)
   - Loading states and error handling
   - Consistent Tailwind CSS styling
   - Lucide React icons throughout
   - Mobile-responsive design

## Directory Structure

```
dashboard/
├── app/
│   ├── api/                          # API routes
│   │   ├── auth/[...nextauth]/      # NextAuth handler
│   │   ├── stats/route.ts           # Bot statistics
│   │   ├── members/route.ts         # Member list
│   │   ├── moderation/
│   │   │   └── logs/route.ts        # Moderation logs
│   │   ├── commands/
│   │   │   ├── route.ts             # List commands
│   │   │   └── [id]/toggle/route.ts # Toggle command
│   │   └── settings/route.ts        # Guild settings
│   ├── auth/
│   │   └── error/page.tsx           # Auth error page
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard wrapper
│   │   ├── page.tsx                 # Overview/stats
│   │   ├── members/page.tsx         # Members page
│   │   ├── moderation/page.tsx      # Logs page
│   │   ├── commands/page.tsx        # Commands page
│   │   └── settings/page.tsx        # Settings page
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Login page
│   └── providers.tsx                # NextAuth provider
├── components/
│   ├── nav/
│   │   └── Sidebar.tsx              # Navigation
│   ├── cards/
│   │   └── StatCard.tsx             # Stat cards
│   └── ...                          # Additional components
├── lib/
│   ├── auth.ts                      # NextAuth config
│   ├── db.ts                        # Database utils
│   └── discord.ts                   # Discord API utils
├── middleware.ts                    # Auth middleware
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

### Step 1: Discord OAuth Configuration

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select your bot
3. Go to OAuth2 → General
4. Add the redirect URL: `http://localhost:3000/api/auth/callback/discord` (for development)
5. For production, add: `https://your-domain.com/api/auth/callback/discord`
6. Go to OAuth2 → Client Secret
7. Copy your **Client ID** and **Client Secret**

### Step 2: Generate NextAuth Secret

Generate a secure random secret for NextAuth:

```bash
openssl rand -base64 32
# Output: abc123...xyz789==
```

### Step 3: Configure Environment Variables

Create `/dashboard/.env.local`:

```env
# Discord OAuth (from Developer Portal)
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database (use same as TitanBot)
POSTGRES_URL=postgresql://user:password@localhost:5432/titanbot
# or
DATABASE_URL=postgresql://user:password@localhost:5432/titanbot

# Environment
NODE_ENV=development
```

### Step 4: Install Dependencies

```bash
cd dashboard
npm install
# or if using different package manager
yarn install
# or
pnpm install
```

### Step 5: Run the Dashboard

Development:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

Production:
```bash
npm run build
npm start
```

## How to Use

### Login
1. Navigate to `http://localhost:3000`
2. Click "Sign in with Discord"
3. Authorize the application
4. You'll be redirected to the dashboard

### Navigation
- Use the sidebar to navigate between pages
- Each section has its own dedicated management interface
- Settings are saved automatically to the database

### Admin Verification
The dashboard connects to your bot's Discord account through OAuth. Make sure you're logged in with an admin account.

## Database Schema Requirements

The dashboard expects these tables in your PostgreSQL database:

- `guilds` - Server information
- `users` - User data
- `guild_users` - Server membership
- `user_levels` - User level progression
- `economy` - Economy/currency data
- `moderation_logs` - Moderation action history (optional, can be created)
- `guild_settings` - Per-guild configuration (will be created automatically)

The existing TitanBot tables should be compatible. Some tables may need to be created if they don't exist:

```sql
-- Create moderation_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS moderation_logs (
  id SERIAL PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  action VARCHAR(50) NOT NULL,
  target_user VARCHAR(255) NOT NULL,
  moderator VARCHAR(255) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create guild_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS guild_settings (
  id SERIAL PRIMARY KEY,
  guild_id BIGINT UNIQUE,
  prefix VARCHAR(3) DEFAULT '!',
  welcome_enabled BOOLEAN DEFAULT true,
  welcome_message TEXT,
  welcome_channel VARCHAR(255),
  moderation_channel VARCHAR(255),
  logging_enabled BOOLEAN DEFAULT true,
  music_enabled BOOLEAN DEFAULT true,
  economy_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Route Details

### Statistics API
- **Endpoint**: `GET /api/stats`
- **Returns**: Guild count, user count, bot uptime, commands used
- **Authentication**: Required

### Members API
- **Endpoint**: `GET /api/members?page=1&limit=20&search=query`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)
  - `search`: Search username (optional)
- **Returns**: Member list with pagination
- **Authentication**: Required

### Moderation Logs API
- **Endpoint**: `GET /api/moderation/logs?page=1&action=warn`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)
  - `action`: Filter by action (all, warn, kick, ban, timeout)
- **Returns**: Moderation logs with pagination
- **Authentication**: Required

### Commands API
- **Endpoint**: `GET /api/commands?search=query&category=Economy`
- **Query Params**:
  - `search`: Search command name/description
  - `category`: Filter by category
- **Returns**: Command list
- **Authentication**: Required

### Settings API
- **Endpoint**: `GET /api/settings`
- **Returns**: Current guild settings
- **Authentication**: Required

- **Endpoint**: `POST /api/settings`
- **Body**: Guild settings object
- **Returns**: Updated settings
- **Authentication**: Required

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel project settings
4. Deploy

```bash
vercel env add DISCORD_CLIENT_ID
vercel env add DISCORD_CLIENT_SECRET
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add POSTGRES_URL
```

### Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Set all environment variables
4. Make sure port 3000 is exposed

## Troubleshooting

### Login Issues
- **"Invalid OAuth redirect URI"**: Ensure `NEXTAUTH_URL` matches Discord app settings
- **"403 Forbidden"**: Check Discord OAuth credentials are correct
- **Session expires immediately**: Regenerate `NEXTAUTH_SECRET`

### Database Issues
- **Connection error**: Verify `POSTGRES_URL` is correct
- **Table not found**: Run SQL scripts above to create missing tables
- **Permission denied**: Ensure database user has proper permissions

### API Issues
- **404 errors**: Check API route file structure and names
- **500 errors**: Check browser console and server logs for details
- **Slow responses**: Consider adding indexes to frequently queried columns

## Future Enhancements

The following features can be added:

- Real-time updates using WebSockets
- Advanced analytics and charts (with Recharts)
- Bulk member actions (kick all, role assignment)
- Custom command creation interface
- Bot error logs and debug information
- Member profile pages with detailed statistics
- Scheduled announcements and tasks
- Role and permission management
- Channel management interface
- Ticket system management

## Performance Optimization Tips

1. **Database Indexes**: Add indexes to frequently queried columns:
```sql
CREATE INDEX idx_guild_users_guild_id ON guild_users(guild_id);
CREATE INDEX idx_user_levels_user_id ON user_levels(user_id);
CREATE INDEX idx_moderation_logs_created_at ON moderation_logs(created_at DESC);
```

2. **Query Optimization**: Implement pagination for all list endpoints

3. **Caching**: Add Redis caching for statistics

4. **CDN**: Serve static assets through a CDN

## Security Best Practices

✅ **Implemented**:
- Environment variables for secrets
- HTTPS enforced in production
- CSRF protection via NextAuth
- SQL parameterized queries
- Session encryption

⚠️ **To Implement**:
- Rate limiting on API routes
- CORS restrictions
- Input validation on all forms
- Audit logging for admin actions
- Two-factor authentication

## Support & Documentation

- **NextAuth.js Docs**: https://next-auth.js.org
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Discord.js**: https://discord.js.org

## File Size Reference

The complete dashboard application:
- Source code: ~30KB
- Dependencies: ~500MB (node_modules)
- Built app: ~1-2MB

## Version Information

- Next.js: Latest
- React: Latest
- TypeScript: Latest
- Node.js: 20+

---

**Dashboard created successfully!** 🎉

The dashboard is now ready for development and deployment. Follow the setup steps above to get started!
