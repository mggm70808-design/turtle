/**
 * Bot Webhook Helper
 * For communicating with the Discord Bot running on Railway
 * Sends commands and receives responses via REST API
 */

const BOT_WEBHOOK_URL = process.env.BOT_WEBHOOK_URL || 'http://localhost:3001/api';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

/**
 * Make a webhook call to the bot
 * @param endpoint - The endpoint to call (e.g., 'webhook/moderation')
 * @param data - The data to send
 * @returns Response from the bot
 */
export async function callBotWebhook(endpoint: string, data: any) {
  if (!BOT_WEBHOOK_URL) {
    throw new Error('BOT_WEBHOOK_URL environment variable is not set');
  }

  if (!WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET environment variable is not set');
  }

  try {
    const response = await fetch(`${BOT_WEBHOOK_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        secret: WEBHOOK_SECRET,
        ...data,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[v0] Webhook error (${response.status}):`, errorText);
      throw new Error(`Bot webhook error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Bot webhook call failed:', error);
    throw error;
  }
}

// ============ MODERATION FUNCTIONS ============

/**
 * Execute a moderation action on a member
 */
export async function executeModeration(
  guildId: string,
  userId: string,
  action: 'kick' | 'ban' | 'mute' | 'unmute',
  reason: string
) {
  return callBotWebhook('webhook/moderation', {
    guildId,
    userId,
    action,
    reason,
  });
}

/**
 * Kick a member from the server
 */
export async function kickMember(guildId: string, userId: string, reason: string) {
  return executeModeration(guildId, userId, 'kick', reason);
}

/**
 * Ban a member from the server
 */
export async function banMember(guildId: string, userId: string, reason: string) {
  return executeModeration(guildId, userId, 'ban', reason);
}

/**
 * Mute/timeout a member
 */
export async function muteMember(guildId: string, userId: string, reason: string) {
  return executeModeration(guildId, userId, 'mute', reason);
}

/**
 * Unmute a member
 */
export async function unmuteMember(guildId: string, userId: string, reason: string) {
  return executeModeration(guildId, userId, 'unmute', reason);
}

// ============ COMMAND FUNCTIONS ============

/**
 * Toggle a command on/off
 */
export async function toggleCommand(guildId: string, commandId: string, enabled: boolean) {
  return callBotWebhook('webhook/commands', {
    guildId,
    commandId,
    enabled,
  });
}

// ============ SETTINGS FUNCTIONS ============

/**
 * Update bot settings for a guild
 */
export async function updateBotSettings(guildId: string, settings: any) {
  return callBotWebhook('webhook/settings', {
    guildId,
    settings,
  });
}

/**
 * Update command prefix
 */
export async function updatePrefix(guildId: string, prefix: string) {
  return updateBotSettings(guildId, { prefix });
}

/**
 * Update welcome message
 */
export async function updateWelcomeMessage(guildId: string, message: string, enabled: boolean) {
  return updateBotSettings(guildId, { 
    welcome_message: message, 
    welcome_enabled: enabled 
  });
}

/**
 * Update feature toggles
 */
export async function updateFeaturesToggle(guildId: string, features: Record<string, boolean>) {
  return updateBotSettings(guildId, { features });
}

// ============ HEALTH CHECK ============

/**
 * Test webhook connection to bot
 */
export async function testWebhookConnection() {
  try {
    const result = await callBotWebhook('webhook/health', {});
    return result;
  } catch (error) {
    console.error('[v0] Webhook connection test failed:', error);
    throw error;
  }
}
