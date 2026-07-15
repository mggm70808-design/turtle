# TitanBot Dashboard

A comprehensive web dashboard for managing TitanBot Discord bot, built with Next.js 16 and React.

## Features

- **Dashboard Overview**: Real-time statistics about your bot (guilds, members, uptime, commands used)
- **Member Management**: View and manage server members with search and filtering
- **Moderation Tools**: View moderation logs with filtering by action type, date range, and member
- **Command Management**: Enable/disable commands, view command details and descriptions
- **Server Settings**: Configure bot behavior including:
  - Command prefix
  - Welcome messages
  - Logging settings
  - Feature toggles (music, economy, etc.)
- **Authentication**: Secure Discord OAuth 2.0 login
- **Dark Theme**: Discord-themed dark interface for comfortable administration

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: NextAuth.js with Discord OAuth provider
- **Database**: PostgreSQL (shared with TitanBot)
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database (shared with TitanBot)
- Discord bot application with OAuth credentials

### Installation

1. Navigate to the dashboard directory:
```bash
cd dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with your configuration:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```
DISCORD_CLIENT_ID=your_discord_bot_client_id
DISCORD_CLIENT_SECRET=your_discord_bot_client_secret
NEXTAUTH_SECRET=generate_a_random_secret_key
NEXTAUTH_URL=http://localhost:3000
POSTGRES_URL=your_postgres_connection_string
```

### Running the Dashboard

Development server:
```bash
npm run dev
# or
yarn dev
```

The dashboard will be available at `http://localhost:3000`

Production build:
```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── stats/                 # Bot statistics
│   │   ├── members/               # Member management
│   │   ├── moderation/logs/       # Moderation logs
│   │   ├── commands/              # Command management
│   │   └── settings/              # Server settings
│   ├── dashboard/
│   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── members/page.tsx       # Members page
│   │   ├── moderation/page.tsx    # Moderation page
│   │   ├── commands/page.tsx      # Commands page
│   │   └── settings/page.tsx      # Settings page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Login page
├── components/
│   ├── nav/Sidebar.tsx            # Navigation sidebar
│   ├── cards/StatCard.tsx         # Statistics card component
│   └── ...                        # Other components
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── db.ts                      # Database utilities
│   └── discord.ts                 # Discord API utilities
├── middleware.ts                  # Authentication middleware
├── next.config.js
├── tailwind.config.js
└── package.json
```

## API Routes

### Authentication
- `POST /api/auth/signin` - Discord OAuth sign-in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Statistics
- `GET /api/stats` - Get bot statistics

### Members
- `GET /api/members?page=1&limit=20&search=query` - List members

### Moderation
- `GET /api/moderation/logs?page=1&action=warn` - Get moderation logs

### Commands
- `GET /api/commands?search=query&category=Economy` - List commands
- `POST /api/commands/[id]/toggle` - Toggle command status

### Settings
- `GET /api/settings` - Get guild settings
- `POST /api/settings` - Update guild settings

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_CLIENT_ID` | Discord bot application client ID | Yes |
| `DISCORD_CLIENT_SECRET` | Discord bot application secret | Yes |
| `NEXTAUTH_SECRET` | Random secret for session encryption | Yes |
| `NEXTAUTH_URL` | URL where the app is deployed | Yes |
| `POSTGRES_URL` | PostgreSQL connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Database Schema

The dashboard uses the following tables from TitanBot:
- `guilds` - Server information
- `users` - User information
- `guild_users` - Guild membership data
- `user_levels` - User level data
- `economy` - Economy/currency data
- `moderation_logs` - Moderation actions
- `guild_settings` - Per-guild configuration

## Security Considerations

- All routes requiring authentication use NextAuth.js middleware
- Discord OAuth ensures users are authenticated before accessing the dashboard
- Environment variables containing secrets are never exposed to the client
- Database queries use parameterized statements to prevent SQL injection
- Sessions are encrypted with JWT tokens

## Troubleshooting

### "Invalid OAuth redirect URI"
Ensure your `NEXTAUTH_URL` matches the Discord application OAuth redirect URI in the Discord Developer Portal.

### Database connection errors
Verify your `POSTGRES_URL` is correct and the database is running.

### Auth not working
Check that your Discord bot's OAuth credentials are correct and the application is configured with proper scopes (discord.identify, discord.guilds).

## Future Enhancements

- Real-time updates using WebSockets
- Advanced analytics and charts
- Bulk member actions
- Custom command creation interface
- Bot logs and errors view
- Member profile pages with detailed stats
- Bulk moderation actions
- Scheduled tasks/announcements

## License

Part of TitanBot project - See main repository for license details

## Support

For issues or questions, please open an issue in the main TitanBot repository.
