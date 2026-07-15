# TitanBot Dashboard - Setup Checklist

Follow this checklist to set up your dashboard correctly.

## ✅ Pre-Setup Requirements

- [ ] Node.js 20+ installed
- [ ] npm/yarn/pnpm package manager available
- [ ] PostgreSQL database running (shared with TitanBot)
- [ ] Discord bot created in Developer Portal
- [ ] Administrative access to your Discord server

## ✅ Phase 1: Discord Developer Portal Setup

1. **Create/Open Your Bot Application**
   - [ ] Go to https://discord.com/developers/applications
   - [ ] Create new application or select existing bot
   - [ ] Copy Application ID and note it

2. **OAuth2 Configuration**
   - [ ] Go to OAuth2 → General
   - [ ] Add Redirect URLs:
     - [ ] Development: `http://localhost:3000/api/auth/callback/discord`
     - [ ] Production: `https://your-domain.com/api/auth/callback/discord`
   - [ ] Go to OAuth2 → Client Secret
   - [ ] Click "Reset Secret" and copy the new secret

3. **Permissions & Scopes**
   - [ ] Go to OAuth2 → URL Generator
   - [ ] Select scopes: `identify`, `guilds`
   - [ ] Copy the generated URL (for manual auth testing if needed)

## ✅ Phase 2: Generate Secrets

1. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   - [ ] Copy the output and save it safely

2. **Database Connection String**
   - [ ] Get your PostgreSQL connection string (or create one)
   - [ ] Format: `postgresql://user:password@host:port/database`
   - [ ] Test the connection if possible

## ✅ Phase 3: Environment Configuration

1. **Create .env.local file**
   ```bash
   cd dashboard
   cp .env.example .env.local
   ```

2. **Edit .env.local**
   - [ ] Set `DISCORD_CLIENT_ID` (from Developer Portal)
   - [ ] Set `DISCORD_CLIENT_SECRET` (from Developer Portal)
   - [ ] Set `NEXTAUTH_SECRET` (from openssl command)
   - [ ] Set `NEXTAUTH_URL`:
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`
   - [ ] Set `POSTGRES_URL` (your database connection string)
   - [ ] Set `NODE_ENV=development` (or production)

3. **Verify .env.local is in .gitignore**
   - [ ] Check `.gitignore` contains `.env.local`
   - [ ] Ensure it won't be committed to Git

## ✅ Phase 4: Database Preparation

1. **Create Missing Tables** (if they don't exist)
   - [ ] Run SQL scripts to create `moderation_logs` table
   - [ ] Run SQL scripts to create `guild_settings` table
   - [ ] Verify tables were created: `\dt` in psql

2. **Optional: Add Indexes**
   ```sql
   CREATE INDEX idx_guild_users_guild_id ON guild_users(guild_id);
   CREATE INDEX idx_user_levels_user_id ON user_levels(user_id);
   CREATE INDEX idx_moderation_logs_created_at ON moderation_logs(created_at DESC);
   ```
   - [ ] Run index creation script (improves performance)

## ✅ Phase 5: Installation

1. **Install Dependencies**
   ```bash
   cd dashboard
   npm install
   ```
   - [ ] Wait for installation to complete
   - [ ] No major errors in output

2. **Verify Installation**
   - [ ] Check `node_modules` directory exists
   - [ ] Check `package-lock.json` was generated

## ✅ Phase 6: Testing (Development)

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   - [ ] Server starts on `http://localhost:3000`
   - [ ] "ready - started server on 0.0.0.0:3000" message appears

2. **Test Login Flow**
   - [ ] Open `http://localhost:3000` in browser
   - [ ] See login page with Discord button
   - [ ] Click "Sign in with Discord"
   - [ ] Redirected to Discord OAuth
   - [ ] Authorize the application
   - [ ] Redirected back to dashboard

3. **Verify Dashboard Pages**
   - [ ] Dashboard overview page loads
   - [ ] Sidebar navigation visible
   - [ ] Can click on Members page
   - [ ] Can click on Moderation page
   - [ ] Can click on Commands page
   - [ ] Can click on Settings page

4. **Test Database Connection**
   - [ ] Dashboard loads stats (check for errors in console)
   - [ ] Members list shows data (or "No members found")
   - [ ] Moderation logs load (or empty state)
   - [ ] Commands list shows 8+ commands

5. **Test Settings Page**
   - [ ] Can change settings
   - [ ] Can click "Save Settings"
   - [ ] Success message appears

## ✅ Phase 7: Production Preparation

1. **Build for Production**
   ```bash
   npm run build
   ```
   - [ ] Build completes without errors
   - [ ] `.next` directory created

2. **Test Production Build**
   ```bash
   npm start
   ```
   - [ ] Server starts on `http://localhost:3000`
   - [ ] Pages load correctly
   - [ ] Settings save properly

3. **Deployment Configuration**
   - [ ] Create deployment platform account (Vercel, Heroku, etc.)
   - [ ] Connect GitHub repository
   - [ ] Set environment variables on platform:
     - [ ] `DISCORD_CLIENT_ID`
     - [ ] `DISCORD_CLIENT_SECRET`
     - [ ] `NEXTAUTH_SECRET`
     - [ ] `NEXTAUTH_URL` (your production domain)
     - [ ] `POSTGRES_URL`

4. **Update Discord OAuth**
   - [ ] Add production redirect URI to Discord app:
     - [ ] `https://your-domain.com/api/auth/callback/discord`

## ✅ Phase 8: Deployment

1. **Deploy to Your Platform**
   - [ ] Push changes to main/master branch
   - [ ] Deploy triggers automatically (if configured)
   - [ ] Wait for deployment to complete

2. **Verify Production Deployment**
   - [ ] Navigate to production URL
   - [ ] See login page
   - [ ] Test Discord OAuth login
   - [ ] Dashboard loads
   - [ ] Check browser console for errors

3. **Monitor for Issues**
   - [ ] Check server logs for errors
   - [ ] Monitor database connections
   - [ ] Test functionality after 1 hour
   - [ ] Test functionality after 24 hours

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Invalid OAuth redirect URI" | Update `NEXTAUTH_URL` and add to Discord app settings |
| Database connection error | Verify `POSTGRES_URL` format and database is running |
| Blank page after login | Check browser console, may be missing API data |
| Settings won't save | Ensure database tables exist and permissions are correct |
| 404 on API routes | Check route file names and paths match exactly |
| Session expires immediately | Regenerate `NEXTAUTH_SECRET` and redeploy |
| Slow page loads | Add database indexes, consider caching |

## 📋 Additional Configuration

### Optional: Set Up Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Set up performance monitoring
- [ ] Set up database monitoring

### Optional: Email Notifications
- [ ] Configure email for password reset (not used by default, but available)
- [ ] Set up email alerts for admin actions

### Optional: Analytics
- [ ] Set up Google Analytics
- [ ] Set up PostHog or Plausible
- [ ] Track user dashboard usage

## 🚀 Next Steps After Setup

1. **Customize the Dashboard**
   - [ ] Update colors/branding
   - [ ] Add your bot's logo
   - [ ] Customize welcome messages

2. **Implement Advanced Features**
   - [ ] Add WebSocket for real-time updates
   - [ ] Implement member profile pages
   - [ ] Add bulk moderation actions
   - [ ] Create custom command interface

3. **Secure & Optimize**
   - [ ] Enable rate limiting
   - [ ] Add CORS restrictions
   - [ ] Implement caching strategy
   - [ ] Set up CDN for static assets

4. **Document & Train**
   - [ ] Create user documentation
   - [ ] Train moderators on dashboard
   - [ ] Document any custom features

## ✅ Final Verification

Before marking as complete, verify:

- [ ] Dashboard accessible at configured URL
- [ ] Discord OAuth login working
- [ ] All pages load without errors
- [ ] Database connectivity confirmed
- [ ] Settings persist between sessions
- [ ] Members list displays data
- [ ] Moderation logs visible
- [ ] Commands list populated
- [ ] No console errors in browser
- [ ] No errors in server logs

---

## 📞 Support

If you encounter issues not listed above:

1. Check the browser console (F12 → Console tab)
2. Check server logs (watch output of `npm run dev`)
3. Verify all environment variables are set
4. Check Discord Developer Portal settings
5. Verify PostgreSQL is running and accessible
6. Review the README.md and DASHBOARD_SETUP.md files

**Setup checklist created!** Print this page and check items as you complete them. 📋
