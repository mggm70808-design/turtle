import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch guild settings from database
    const result = await query(
      `SELECT * FROM guild_settings LIMIT 1`
    );

    const defaultSettings = {
      prefix: "!",
      welcome_enabled: true,
      welcome_message: "Welcome to our server!",
      welcome_channel: "",
      moderation_channel: "",
      logging_enabled: true,
      music_enabled: true,
      economy_enabled: true,
    };

    const settings = result.rows[0] || defaultSettings;

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[v0] Settings GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await request.json();

    // Update settings in database
    const result = await query(
      `INSERT INTO guild_settings (prefix, welcome_enabled, welcome_message, welcome_channel, moderation_channel, logging_enabled, music_enabled, economy_enabled, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET
       prefix = $1, welcome_enabled = $2, welcome_message = $3, welcome_channel = $4, moderation_channel = $5, logging_enabled = $6, music_enabled = $7, economy_enabled = $8, updated_at = NOW()
       RETURNING *`,
      [
        settings.prefix,
        settings.welcome_enabled,
        settings.welcome_message,
        settings.welcome_channel,
        settings.moderation_channel,
        settings.logging_enabled,
        settings.music_enabled,
        settings.economy_enabled,
      ]
    );

    return NextResponse.json({
      success: true,
      settings: result.rows[0],
    });
  } catch (error) {
    console.error("[v0] Settings POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
