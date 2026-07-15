/**
 * Webhook Endpoints for Dashboard Communication
 * 
 * These endpoints allow the Dashboard to control the bot
 * All requests must include the correct WEBHOOK_SECRET
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database/postgres');
const { client } = require('../bot');

// Verify webhook secret
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const verifyWebhookSecret = (req, res, next) => {
  const secret = req.body?.secret || req.headers['x-webhook-secret'];
  
  if (!secret || secret !== WEBHOOK_SECRET) {
    console.error('[Webhook] Unauthorized request from:', req.ip);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Apply verification middleware to all webhook routes
router.use(verifyWebhookSecret);

// ============ HEALTH CHECK ============

/**
 * GET /webhook/health
 * Check if webhook connection is working
 */
router.post('/webhook/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    botReady: client.ready 
  });
});

// ============ SETTINGS ENDPOINTS ============

/**
 * POST /webhook/settings
 * Update guild settings
 * 
 * Body:
 * {
 *   guildId: "123456789",
 *   settings: {
 *     prefix: "!",
 *     welcome_message: "Welcome!",
 *     welcome_enabled: true,
 *     features: { music: true, economy: false }
 *   }
 * }
 */
router.post('/webhook/settings', async (req, res) => {
  try {
    const { guildId, settings } = req.body;
    
    if (!guildId || !settings) {
      return res.status(400).json({ error: 'Missing guildId or settings' });
    }

    console.log(`[Webhook] Updating settings for guild ${guildId}:`, settings);

    // Update in database
    await db.query(
      'UPDATE guild_settings SET settings = $1, updated_at = NOW() WHERE guild_id = $2',
      [JSON.stringify(settings), guildId]
    );

    // Reload settings in memory if cache exists
    if (global.botSettings && global.botSettings[guildId]) {
      global.botSettings[guildId] = { ...global.botSettings[guildId], ...settings };
    }

    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    console.error('[Webhook] Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============ MODERATION ENDPOINTS ============

/**
 * POST /webhook/moderation
 * Execute moderation actions (kick, ban, mute, unmute)
 * 
 * Body:
 * {
 *   guildId: "123456789",
 *   userId: "987654321",
 *   action: "kick" | "ban" | "mute" | "unmute",
 *   reason: "Reason for action"
 * }
 */
router.post('/webhook/moderation', async (req, res) => {
  try {
    const { guildId, userId, action, reason = 'No reason provided' } = req.body;
    
    if (!guildId || !userId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`[Webhook] Executing moderation action: ${action} on user ${userId} in guild ${guildId}`);

    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let actionResult;

    switch (action.toLowerCase()) {
      case 'kick':
        await member.kick(reason);
        actionResult = 'kicked';
        break;

      case 'ban':
        await member.ban({ reason });
        actionResult = 'banned';
        break;

      case 'mute':
        // Timeout for 1 hour (3600000 ms)
        await member.timeout(3600000, reason);
        actionResult = 'muted';
        break;

      case 'unmute':
        await member.timeout(null);
        actionResult = 'unmuted';
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Log the action in database
    await db.query(
      `INSERT INTO moderation_logs (guild_id, mod_id, user_id, action, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [guildId, 'dashboard', userId, action, reason]
    );

    res.json({ 
      success: true, 
      message: `User ${actionResult}`,
      action: action,
      user_id: userId
    });

  } catch (error) {
    console.error('[Webhook] Error executing moderation:', error);
    res.status(500).json({ error: 'Failed to execute moderation action' });
  }
});

// ============ COMMAND ENDPOINTS ============

/**
 * POST /webhook/commands
 * Toggle commands on/off
 * 
 * Body:
 * {
 *   guildId: "123456789",
 *   commandId: "music",
 *   enabled: true
 * }
 */
router.post('/webhook/commands', async (req, res) => {
  try {
    const { guildId, commandId, enabled } = req.body;
    
    if (!guildId || !commandId || enabled === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`[Webhook] Toggling command ${commandId} to ${enabled ? 'enabled' : 'disabled'} for guild ${guildId}`);

    // Update in database
    await db.query(
      'UPDATE commands SET enabled = $1, updated_at = NOW() WHERE guild_id = $2 AND command_id = $3',
      [enabled, guildId, commandId]
    );

    // Update cache if exists
    if (global.commandCache && global.commandCache[guildId]) {
      const cmd = global.commandCache[guildId].find(c => c.id === commandId);
      if (cmd) cmd.enabled = enabled;
    }

    res.json({ 
      success: true, 
      message: `Command ${commandId} ${enabled ? 'enabled' : 'disabled'}`,
      command_id: commandId,
      enabled: enabled
    });

  } catch (error) {
    console.error('[Webhook] Error toggling command:', error);
    res.status(500).json({ error: 'Failed to toggle command' });
  }
});

// ============ GUILD INFO ENDPOINTS ============

/**
 * GET /webhook/guilds/:guildId
 * Get guild information
 */
router.get('/webhook/guilds/:guildId', async (req, res) => {
  try {
    const { guildId } = req.params;
    
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    res.json({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
      memberCount: guild.memberCount,
      ownerId: guild.ownerId,
      channels: guild.channels.cache.size,
      roles: guild.roles.cache.size,
    });

  } catch (error) {
    console.error('[Webhook] Error fetching guild info:', error);
    res.status(500).json({ error: 'Failed to fetch guild info' });
  }
});

// ============ STATS ENDPOINTS ============

/**
 * GET /webhook/stats
 * Get bot statistics
 */
router.get('/webhook/stats', async (req, res) => {
  try {
    const stats = {
      botStatus: client.ready ? 'online' : 'offline',
      botName: client.user?.username,
      botId: client.user?.id,
      uptime: process.uptime(),
      guildCount: client.guilds.cache.size,
      userCount: client.users.cache.size,
      ping: client.ws.ping,
      timestamp: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error('[Webhook] Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
