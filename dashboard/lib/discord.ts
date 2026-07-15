/**
 * Discord API Helper Functions
 * Used to communicate with Discord API for real-time data
 */

const DISCORD_API_BASE = 'https://discord.com/api/v10';

interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner_id: string;
  permissions: string;
  features: string[];
  member_count: number;
}

interface DiscordMember {
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
  };
  roles: string[];
  joined_at: string;
  nick?: string;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
}

/**
 * Get user's Discord servers (guilds)
 * @param accessToken - Discord OAuth access token
 * @returns List of guilds user has manage_guild permission in
 */
export async function getDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guilds: ${response.statusText}`);
    }

    const guilds: DiscordGuild[] = await response.json();
    
    // Filter guilds where user has MANAGE_GUILD permission (value: 0x0000000020)
    return guilds.filter((guild) => {
      const permissions = BigInt(guild.permissions);
      const MANAGE_GUILD = 0x0000000020n;
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD;
    });
  } catch (error) {
    console.error('[v0] Error fetching Discord guilds:', error);
    throw error;
  }
}

/**
 * Get current user's Discord profile
 * @param accessToken - Discord OAuth access token
 * @returns User profile info
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching Discord user:', error);
    throw error;
  }
}

/**
 * Get guild members (paginated)
 * Note: Requires bot token, not user token
 * @param guildId - Discord Guild ID
 * @param botToken - Bot token
 * @param limit - Number of members (max 1000)
 * @param after - Member ID to start after (for pagination)
 * @returns List of guild members
 */
export async function getGuildMembers(
  guildId: string,
  botToken: string,
  limit: number = 100,
  after?: string
): Promise<DiscordMember[]> {
  try {
    const url = new URL(`${DISCORD_API_BASE}/guilds/${guildId}/members`);
    url.searchParams.append('limit', Math.min(limit, 1000).toString());
    if (after) {
      url.searchParams.append('after', after);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guild members: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching guild members:', error);
    throw error;
  }
}

/**
 * Get guild info
 * Note: Requires bot token
 * @param guildId - Discord Guild ID
 * @param botToken - Bot token
 * @returns Guild information
 */
export async function getGuildInfo(guildId: string, botToken: string): Promise<DiscordGuild> {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guild info: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching guild info:', error);
    throw error;
  }
}

/**
 * Get member info
 * Note: Requires bot token
 * @param guildId - Discord Guild ID
 * @param userId - Discord User ID
 * @param botToken - Bot token
 * @returns Member information
 */
export async function getGuildMember(
  guildId: string,
  userId: string,
  botToken: string
): Promise<DiscordMember> {
  try {
    const response = await fetch(
      `${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching guild member:', error);
    throw error;
  }
}

/**
 * Kick member from guild
 * Note: Requires bot token with kick_members permission
 * @param guildId - Discord Guild ID
 * @param userId - Discord User ID
 * @param botToken - Bot token
 * @param reason - Optional reason for kick
 * @returns Success status
 */
export async function kickMember(
  guildId: string,
  userId: string,
  botToken: string,
  reason?: string
): Promise<boolean> {
  try {
    const url = new URL(
      `${DISCORD_API_BASE}/guilds/${guildId}/members/${userId}`
    );
    if (reason) {
      url.searchParams.append('audit_log_reason', reason);
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to kick member: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('[v0] Error kicking member:', error);
    throw error;
  }
}

/**
 * Ban member from guild
 * Note: Requires bot token with ban_members permission
 * @param guildId - Discord Guild ID
 * @param userId - Discord User ID
 * @param botToken - Bot token
 * @param deleteMessageDays - Days of messages to delete (0-7)
 * @param reason - Optional reason for ban
 * @returns Success status
 */
export async function banMember(
  guildId: string,
  userId: string,
  botToken: string,
  deleteMessageDays: number = 0,
  reason?: string
): Promise<boolean> {
  try {
    const url = new URL(
      `${DISCORD_API_BASE}/guilds/${guildId}/bans/${userId}`
    );
    url.searchParams.append('delete_message_days', deleteMessageDays.toString());
    if (reason) {
      url.searchParams.append('audit_log_reason', reason);
    }

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ban member: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('[v0] Error banning member:', error);
    throw error;
  }
}

/**
 * Get bot info
 * Note: Requires bot token
 * @param botToken - Bot token
 * @returns Bot user information
 */
export async function getBotInfo(botToken: string): Promise<DiscordUser> {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bot info: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching bot info:', error);
    throw error;
  }
}

/**
 * Get bot's guilds
 * Note: Requires bot token
 * @param botToken - Bot token
 * @returns List of guilds the bot is in
 */
export async function getBotGuilds(botToken: string): Promise<DiscordGuild[]> {
  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bot guilds: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[v0] Error fetching bot guilds:', error);
    throw error;
  }
}

/**
 * Get bot's guilds count
 * @param botToken - Bot token
 * @returns Number of guilds
 */
export async function getBotGuildCount(botToken: string): Promise<number> {
  try {
    const guilds = await getBotGuilds(botToken);
    return guilds.length;
  } catch (error) {
    console.error('[v0] Error getting bot guild count:', error);
    return 0;
  }
}
