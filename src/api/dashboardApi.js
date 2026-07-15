/**
 * Dashboard API — Express routes mounted on the bot's existing web server.
 * Secured with DASHBOARD_API_SECRET (shared secret header: x-dashboard-secret).
 *
 * Mount in src/app.js:
 *   import { createDashboardRouter } from './api/dashboardApi.js';
 *   app.use('/dashboard-api', createDashboardRouter(this));
 */

import { Router } from 'express';
import { logger } from '../utils/logger.js';

// ─── Auth middleware ────────────────────────────────────────────────────────

function requireSecret(req, res, next) {
  const secret = process.env.DASHBOARD_API_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'Dashboard API not configured (DASHBOARD_API_SECRET missing)' });
  }
  if (req.headers['x-dashboard-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Router factory ────────────────────────────────────────────────────────

export function createDashboardRouter(botClient) {
  const router = Router();
  router.use(requireSecret);
  router.use((req, _res, next) => {
    req.botClient = botClient;
    next();
  });

  // ── GET /dashboard-api/health ─────────────────────────────────────────────
  router.get('/health', (_req, res) => {
    const db = _req.botClient?.db;
    const dbStatus = db?.getStatus?.() || {};
    res.json({
      ok: true,
      uptime: process.uptime(),
      guilds: _req.botClient?.guilds?.cache?.size ?? 0,
      commands: _req.botClient?.commands?.size ?? 0,
      db: {
        connected: dbStatus.connectionType !== 'none',
        degraded: !!dbStatus.isDegraded,
        type: dbStatus.connectionType,
      },
    });
  });

  // ── GET /dashboard-api/stats ──────────────────────────────────────────────
  router.get('/stats', async (req, res) => {
    try {
      const client = req.botClient;
      const db = client.db;

      const [usersRes, guildsRes, levelsRes, economyRes] = await Promise.all([
        db.query('SELECT COUNT(*) AS cnt FROM users'),
        db.query('SELECT COUNT(*) AS cnt FROM guilds'),
        db.query('SELECT COUNT(*) AS cnt FROM user_levels'),
        db.query('SELECT COALESCE(SUM(balance),0) AS total FROM economy'),
      ]);

      res.json({
        guilds:       parseInt(guildsRes.rows[0]?.cnt ?? 0),
        members:      parseInt(usersRes.rows[0]?.cnt ?? 0),
        leveled:      parseInt(levelsRes.rows[0]?.cnt ?? 0),
        economyCoins: parseInt(economyRes.rows[0]?.total ?? 0),
        uptime:       process.uptime(),
        ping:         client.ws?.ping ?? -1,
        commands:     client.commands?.size ?? 0,
        cachedGuilds: client.guilds?.cache?.size ?? 0,
      });
    } catch (err) {
      logger.error('[dashboardApi] /stats error:', err);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // ── GET /dashboard-api/guilds ─────────────────────────────────────────────
  router.get('/guilds', async (req, res) => {
    try {
      const client = req.botClient;
      const guilds = client.guilds.cache.map((g) => ({
        id:     g.id,
        name:   g.name,
        icon:   g.iconURL({ size: 64 }),
        members: g.memberCount,
        owner:  g.ownerId,
      }));
      res.json({ guilds });
    } catch (err) {
      logger.error('[dashboardApi] /guilds error:', err);
      res.status(500).json({ error: 'Failed to fetch guilds' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/config ─────────────────────────────
  router.get('/guilds/:guildId/config', async (req, res) => {
    try {
      const { guildId } = req.params;
      const db = req.botClient.db;
      const result = await db.query('SELECT config FROM guilds WHERE id = $1', [guildId]);
      if (!result.rows.length) return res.status(404).json({ error: 'Guild not found' });
      res.json({ config: result.rows[0].config });
    } catch (err) {
      logger.error('[dashboardApi] /guilds/:id/config GET error:', err);
      res.status(500).json({ error: 'Failed to fetch guild config' });
    }
  });

  // ── PATCH /dashboard-api/guilds/:guildId/config ───────────────────────────
  router.patch('/guilds/:guildId/config', async (req, res) => {
    try {
      const { guildId } = req.params;
      const updates = req.body;
      const db = req.botClient.db;

      const current = await db.query('SELECT config FROM guilds WHERE id = $1', [guildId]);
      const existing = current.rows[0]?.config ?? {};
      const merged = { ...existing, ...updates };

      await db.query(
        'UPDATE guilds SET config = $1, updated_at = NOW() WHERE id = $2',
        [JSON.stringify(merged), guildId]
      );
      res.json({ ok: true, config: merged });
    } catch (err) {
      logger.error('[dashboardApi] /guilds/:id/config PATCH error:', err);
      res.status(500).json({ error: 'Failed to update guild config' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/members ────────────────────────────
  router.get('/guilds/:guildId/members', async (req, res) => {
    try {
      const { guildId } = req.params;
      const limit  = Math.min(parseInt(req.query.limit ?? '50'), 100);
      const offset = parseInt(req.query.offset ?? '0');
      const search = req.query.search ?? '';
      const db = req.botClient.db;

      const searchParam = search ? `%${search}%` : null;
      const result = await db.query(
        `SELECT u.id, u.username, u.avatar,
                gu.joined_at,
                ul.level, ul.xp, ul.total_xp,
                e.balance
         FROM guild_users gu
         JOIN users u ON u.id = gu.user_id
         LEFT JOIN user_levels ul ON ul.guild_id = gu.guild_id AND ul.user_id = gu.user_id
         LEFT JOIN economy e ON e.guild_id = gu.guild_id AND e.user_id = gu.user_id
         WHERE gu.guild_id = $1
           AND ($4::text IS NULL OR u.username ILIKE $4)
         ORDER BY COALESCE(ul.total_xp, 0) DESC
         LIMIT $2 OFFSET $3`,
        [guildId, limit, offset, searchParam]
      );
      const countRes = await db.query(
        `SELECT COUNT(*) AS cnt FROM guild_users gu
         JOIN users u ON u.id = gu.user_id
         WHERE gu.guild_id = $1 AND ($2::text IS NULL OR u.username ILIKE $2)`,
        [guildId, searchParam]
      );
      res.json({ members: result.rows, total: parseInt(countRes.rows[0]?.cnt ?? 0) });
    } catch (err) {
      logger.error('[dashboardApi] /members error:', err);
      res.status(500).json({ error: 'Failed to fetch members' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/leaderboard ───────────────────────
  router.get('/guilds/:guildId/leaderboard', async (req, res) => {
    try {
      const { guildId } = req.params;
      const limit = Math.min(parseInt(req.query.limit ?? '20'), 100);
      const db = req.botClient.db;

      const result = await db.query(
        `SELECT u.id, u.username, u.avatar, ul.level, ul.xp, ul.total_xp
         FROM user_levels ul
         JOIN users u ON u.id = ul.user_id
         WHERE ul.guild_id = $1
         ORDER BY ul.total_xp DESC
         LIMIT $2`,
        [guildId, limit]
      );
      res.json({ leaderboard: result.rows });
    } catch (err) {
      logger.error('[dashboardApi] /leaderboard error:', err);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/economy/leaderboard ───────────────
  router.get('/guilds/:guildId/economy/leaderboard', async (req, res) => {
    try {
      const { guildId } = req.params;
      const limit = Math.min(parseInt(req.query.limit ?? '20'), 100);
      const db = req.botClient.db;

      const result = await db.query(
        `SELECT u.id, u.username, u.avatar, e.balance, e.bank
         FROM economy e
         JOIN users u ON u.id = e.user_id
         WHERE e.guild_id = $1
         ORDER BY (e.balance + COALESCE(e.bank, 0)) DESC
         LIMIT $2`,
        [guildId, limit]
      );
      res.json({ leaderboard: result.rows });
    } catch (err) {
      logger.error('[dashboardApi] /economy/leaderboard error:', err);
      res.status(500).json({ error: 'Failed to fetch economy leaderboard' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/giveaways ─────────────────────────
  router.get('/guilds/:guildId/giveaways', async (req, res) => {
    try {
      const { guildId } = req.params;
      const db = req.botClient.db;
      const result = await db.query(
        `SELECT id, message_id, data, ends_at, created_at
         FROM giveaways WHERE guild_id = $1 ORDER BY created_at DESC`,
        [guildId]
      );
      res.json({ giveaways: result.rows });
    } catch (err) {
      logger.error('[dashboardApi] /giveaways error:', err);
      res.status(500).json({ error: 'Failed to fetch giveaways' });
    }
  });

  // ── GET /dashboard-api/guilds/:guildId/tickets ────────────────────────────
  router.get('/guilds/:guildId/tickets', async (req, res) => {
    try {
      const { guildId } = req.params;
      const db = req.botClient.db;
      const result = await db.query(
        `SELECT channel_id, data, created_at, expires_at
         FROM ticket_data WHERE guild_id = $1 ORDER BY created_at DESC`,
        [guildId]
      );
      res.json({ tickets: result.rows });
    } catch (err) {
      logger.error('[dashboardApi] /tickets error:', err);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });

  // ── POST /dashboard-api/guilds/:guildId/moderation ───────────────────────
  // Body: { action: "ban"|"kick"|"timeout"|"unban", userId, reason, duration? }
  router.post('/guilds/:guildId/moderation', async (req, res) => {
    try {
      const { guildId } = req.params;
      const { action, userId, reason, duration } = req.body;
      const client = req.botClient;

      if (!['ban', 'kick', 'timeout', 'unban'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ error: 'Guild not in cache' });

      let result = { ok: true, action, userId };

      if (action === 'ban') {
        await guild.members.ban(userId, { reason: reason ?? 'Banned via Dashboard' });
      } else if (action === 'unban') {
        await guild.bans.remove(userId, reason ?? 'Unbanned via Dashboard');
      } else if (action === 'kick') {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return res.status(404).json({ error: 'Member not found' });
        await member.kick(reason ?? 'Kicked via Dashboard');
      } else if (action === 'timeout') {
        const member = await guild.members.fetch(userId).catch(() => null);
        if (!member) return res.status(404).json({ error: 'Member not found' });
        const ms = (duration ?? 5) * 60 * 1000;
        await member.timeout(ms, reason ?? 'Timed out via Dashboard');
        result.duration = duration;
      }

      logger.info(`[dashboardApi] Moderation: ${action} on ${userId} in ${guildId} — ${reason}`);
      res.json(result);
    } catch (err) {
      logger.error('[dashboardApi] /moderation error:', err);
      res.status(500).json({ error: err.message ?? 'Moderation action failed' });
    }
  });

  // ── POST /dashboard-api/guilds/:guildId/announce ─────────────────────────
  // Body: { channelId, message }
  router.post('/guilds/:guildId/announce', async (req, res) => {
    try {
      const { guildId } = req.params;
      const { channelId, message } = req.body;
      const client = req.botClient;

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ error: 'Guild not in cache' });

      const channel = guild.channels.cache.get(channelId);
      if (!channel || !channel.isTextBased()) {
        return res.status(404).json({ error: 'Text channel not found' });
      }

      await channel.send(message);
      res.json({ ok: true });
    } catch (err) {
      logger.error('[dashboardApi] /announce error:', err);
      res.status(500).json({ error: 'Failed to send announcement' });
    }
  });

  return router;
}
