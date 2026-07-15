# 🚀 Quick Start Guide

Get your TitanBot Dashboard up and running in minutes!

## Step 1: Get Your Discord Credentials (5 minutes)

1. Go to https://discord.com/developers/applications
2. Select your bot application
3. Go to **OAuth2 → General**
4. Add redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/discord`
   - Production: `https://your-domain.com/api/auth/callback/discord`
5. Go to **OAuth2 → Client Secret**
6. Copy your **Client ID** and **Client Secret**

## Step 2: Generate Secrets (1 minute)

```bash
# Generate a secret for NextAuth
openssl rand -base64 32
# Copy the output
```

## Step 3: Set Up Environment (2 minutes)

```bash
# Navigate to dashboard
cd dashboard

# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local  # or use your favorite editor
```

**Required values for .env.local:**
```env
DISCORD_CLIENT_ID=paste_your_client_id
DISCORD_CLIENT_SECRET=paste_your_client_secret
NEXTAUTH_SECRET=paste_generated_secret
NEXTAUTH_URL=http://localhost:3000
POSTGRES_URL=your_database_connection_string
```

## Step 4: Install & Run (5 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser! 🎉

## Step 5: Test Login

1. Click "Sign in with Discord"
2. Authorize the application
3. You should see the dashboard!

## 📋 What You'll See

- **Dashboard**: Bot statistics and overview
- **Members**: View all server members
- **Moderation**: See moderation logs and actions
- **Commands**: Manage bot commands
- **Settings**: Configure server settings

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "Invalid redirect URI" | Add the correct URI to Discord app OAuth2 settings |
| Database connection error | Check your `POSTGRES_URL` is correct |
| Blank page | Check browser console (F12) for errors |
| Auth keeps failing | Make sure your Discord credentials are correct |

## 🔧 Useful Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Run production build locally
npm start

# Check TypeScript errors
npx tsc --noEmit
```

## 📁 Key Files to Know

- `.env.local` - Your secrets (NEVER commit this!)
- `app/page.tsx` - Login page
- `app/dashboard/page.tsx` - Main dashboard
- `lib/auth.ts` - Authentication setup
- `lib/db.ts` - Database connection

## 🎯 Next Steps

1. ✅ Get it running (you are here!)
2. 📖 Read full docs: `README.md`
3. 🔒 Follow setup checklist: `SETUP_CHECKLIST.md`
4. 🚀 Deploy to production
5. 🎨 Customize to your needs

## 🆘 Need Help?

1. Check `SETUP_CHECKLIST.md` for detailed setup
2. Read `DASHBOARD_SETUP.md` for complete documentation
3. Check browser console for errors (F12)
4. Check terminal output for server errors
5. Read the main `README.md`

## 🎉 You're Ready!

Your dashboard is now running. Start exploring and managing your Discord bot! 🤖

---

**Need more details?** See the full documentation files included in this directory.
