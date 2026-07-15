# 🎯 TitanBot Discord Bot Dashboard

A comprehensive, production-ready web dashboard for managing your TitanBot Discord bot with member management, moderation logs, command control, and server settings.

## 📌 Quick Links

- **🚀 Quick Start**: See `dashboard/QUICK_START.md` for immediate setup (5 minutes)
- **📋 Setup Checklist**: See `dashboard/SETUP_CHECKLIST.md` for step-by-step guide
- **📚 Full Documentation**: See `dashboard/README.md` for complete reference
- **📊 Build Details**: See `DASHBOARD_BUILD_SUMMARY.md` for what was built
- **🔧 Setup Guide**: See `DASHBOARD_SETUP.md` for detailed setup instructions

## 🎨 What's Included

### Dashboard Location
```
/dashboard          # Complete Next.js 16 application
├── app/            # All pages and API routes
├── components/     # Reusable UI components
├── lib/            # Utilities (auth, database)
└── public/         # Static assets
```

### Main Features

| Feature | Status | Details |
|---------|--------|---------|
| **Authentication** | ✅ Complete | Discord OAuth 2.0 with NextAuth.js |
| **Dashboard Overview** | ✅ Complete | Real-time bot statistics |
| **Member Management** | ✅ Complete | View, search, filter members |
| **Moderation Logs** | ✅ Complete | View actions, filter by type |
| **Command Management** | ✅ Complete | Enable/disable, organize by category |
| **Server Settings** | ✅ Complete | Prefix, welcome, features config |
| **Dark Theme** | ✅ Complete | Discord-inspired UI |
| **Responsive Design** | ✅ Complete | Mobile, tablet, desktop |

## 🚀 Getting Started (Choose Your Path)

### Option 1: 5-Minute Quick Start ⚡
```bash
cd dashboard
cp .env.example .env.local
# Edit .env.local with your Discord credentials
npm install
npm run dev
# Open http://localhost:3000
```
See `dashboard/QUICK_START.md` for details.

### Option 2: Detailed Setup 📋
Follow the step-by-step checklist in `dashboard/SETUP_CHECKLIST.md` (20 minutes)

### Option 3: Full Documentation 📚
Read `DASHBOARD_SETUP.md` for complete setup instructions

## 🔐 What You Need

Before starting, gather:
- Discord bot token (you already have this for TitanBot)
- Discord bot Client ID & Secret (from Developer Portal)
- PostgreSQL database connection string (shared with TitanBot)
- Node.js 20+ installed locally

## 📊 Technology Stack

```
Frontend:  React 19 + TypeScript + Tailwind CSS
Framework: Next.js 16 (App Router)
Auth:      NextAuth.js + Discord OAuth
Database:  PostgreSQL (shared with bot)
Styling:   Tailwind CSS 3
Icons:     Lucide React
```

## 🎯 Dashboard Pages

### 1. Login Page
- Discord OAuth integration
- Beautiful authentication UI
- Error handling

### 2. Dashboard Overview
- Bot statistics (guilds, members, uptime)
- Recent activity timeline
- Quick action buttons
- Real-time data from database

### 3. Member Management
- List all server members
- Search and filtering
- Member details (join date, level)
- Pagination (20 per page)
- Responsive table

### 4. Moderation Logs
- View all moderation actions
- Filter by action type
- Display action details
- Reverse action capability
- Pagination support

### 5. Command Management
- List all bot commands
- Enable/disable toggles
- Filter by category
- Search functionality
- Display cooldowns

### 6. Server Settings
- Configure command prefix
- Welcome message settings
- Feature toggles (logging, music, economy)
- Settings persistence
- Success notifications

## 📁 Project Structure

```
dashboard/
├── QUICK_START.md          ← Start here! (5 min)
├── SETUP_CHECKLIST.md      ← Step-by-step (20 min)
├── README.md               ← Full documentation
├── .env.example            ← Copy to .env.local
├── package.json            ← Dependencies
├── next.config.js          ← Next.js config
├── tailwind.config.js      ← Theme colors
├── middleware.ts           ← Auth middleware
├── app/
│   ├── page.tsx           ← Login page
│   ├── layout.tsx         ← Root layout
│   ├── globals.css        ← Global styles
│   ├── providers.tsx      ← NextAuth provider
│   ├── api/               ← API routes (7 endpoints)
│   │   ├── auth/          ← OAuth handler
│   │   ├── stats/         ← Bot stats
│   │   ├── members/       ← Member list
│   │   ├── moderation/    ← Logs
│   │   ├── commands/      ← Commands
│   │   └── settings/      ← Settings
│   └── dashboard/         ← Protected pages
│       ├── page.tsx       ← Overview
│       ├── members/       ← Members page
│       ├── moderation/    ← Logs page
│       ├── commands/      ← Commands page
│       └── settings/      ← Settings page
├── components/
│   ├── nav/Sidebar.tsx    ← Navigation
│   └── cards/StatCard.tsx ← Stat card
├── lib/
│   ├── auth.ts            ← NextAuth setup
│   ├── db.ts              ← Database utils
│   └── discord.ts         ← Discord API helpers
└── public/                ← Static files
```

## 🔌 API Endpoints

All endpoints require authentication (Discord OAuth).

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stats` | GET | Bot statistics |
| `/api/members` | GET | Member list & search |
| `/api/moderation/logs` | GET | Moderation logs |
| `/api/commands` | GET | Command list |
| `/api/commands/[id]/toggle` | POST | Toggle command |
| `/api/settings` | GET | Get settings |
| `/api/settings` | POST | Update settings |

## 🔒 Security Features

✅ **Implemented**:
- Discord OAuth 2.0 authentication
- NextAuth.js session encryption
- Environment variables for secrets
- SQL parameterized queries
- CSRF protection
- Protected middleware routes

## 🎨 Customization

Easy to customize:

**Colors**: Edit `dashboard/tailwind.config.js`
```js
theme: {
  extend: {
    colors: {
      primary: "#5865F2",    // Discord blue
      secondary: "#2C2F33",  // Dark bg
    }
  }
}
```

**Fonts**: Edit `dashboard/app/globals.css`
**Logo**: Add to `dashboard/components/nav/Sidebar.tsx`
**Features**: Add pages to `dashboard/app/dashboard/`

## 📈 Performance

- ⚡ Next.js App Router (fast)
- 🎯 Automatic code splitting
- 💾 Database connection pooling
- 🔍 Optimized queries
- 📊 Pagination throughout

## 🚀 Deployment

### Vercel (Recommended - Zero Config)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- AWS Lambda + RDS
- Heroku + PostgreSQL
- Railway + PostgreSQL
- Self-hosted Node.js

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup |
| `SETUP_CHECKLIST.md` | Complete checklist |
| `README.md` | Full documentation |
| `DASHBOARD_SETUP.md` | Detailed setup guide |
| `DASHBOARD_BUILD_SUMMARY.md` | Build overview |
| `DISCORD_BOT_DASHBOARD_README.md` | This file |

## ⚙️ Environment Variables

Required environment variables (set in `.env.local`):

```env
# Discord OAuth (from Developer Portal)
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_SECRET=generate_with_openssl
NEXTAUTH_URL=http://localhost:3000

# Database (shared with bot)
POSTGRES_URL=postgresql://user:pass@host:port/db

# Environment
NODE_ENV=development
```

## 🐛 Troubleshooting

### "Invalid OAuth redirect URI"
→ Make sure `NEXTAUTH_URL` matches your Discord OAuth settings

### Database connection error
→ Verify `POSTGRES_URL` is correct and database is running

### Blank dashboard page
→ Check browser console (F12) and terminal for errors

### Settings won't save
→ Ensure database tables exist (see setup docs)

## 🎯 Success Checklist

After setup, verify:
- [ ] Dashboard loads at `http://localhost:3000`
- [ ] Discord login works
- [ ] Dashboard pages load
- [ ] Can view members
- [ ] Can view moderation logs
- [ ] Can view commands
- [ ] Can save settings
- [ ] No console errors

## 🔄 Database Tables

Dashboard uses:
- `guilds` ← Server info
- `users` ← User data  
- `guild_users` ← Membership
- `user_levels` ← Levels
- `economy` ← Currency
- `moderation_logs` ← Actions (new)
- `guild_settings` ← Config (new)

## 💡 Next Steps

1. **Setup**: Read `dashboard/QUICK_START.md` (5 min)
2. **Verify**: Follow `dashboard/SETUP_CHECKLIST.md`
3. **Deploy**: Push to GitHub → Platform
4. **Customize**: Update colors & branding
5. **Extend**: Add more features

## 🆘 Need Help?

1. Read `QUICK_START.md` for immediate setup
2. Check `SETUP_CHECKLIST.md` for common issues
3. Review `DASHBOARD_SETUP.md` for detailed guidance
4. Check browser console (F12) for error details
5. Check terminal for server errors

## 📞 Support Resources

- Next.js: https://nextjs.org/docs
- NextAuth.js: https://next-auth.js.org
- Tailwind CSS: https://tailwindcss.com
- PostgreSQL: https://www.postgresql.org/docs
- Discord.js: https://discord.js.org

## ✨ Key Features Summary

✅ Complete authentication system
✅ Real-time bot statistics
✅ Member management interface
✅ Comprehensive moderation logs
✅ Command enable/disable
✅ Server settings configuration
✅ Responsive mobile design
✅ Dark theme (Discord-inspired)
✅ PostgreSQL integration
✅ Production-ready code
✅ Extensive documentation
✅ Deployment ready

## 🎉 You're All Set!

Your TitanBot Dashboard is complete and ready to use! 

**Start now**: Open `dashboard/QUICK_START.md` to begin setup.

---

**Status**: ✅ Complete & Production-Ready
**Version**: 1.0.0
**Last Updated**: July 15, 2026
**Built with**: Next.js 16, React 19, TypeScript, Tailwind CSS

**Happy botting! 🤖**
