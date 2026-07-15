import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch guild count
    const guildRes = await query(
      "SELECT COUNT(*) as count FROM guilds WHERE disabled = false"
    );
    const guildCount = parseInt(guildRes.rows[0]?.count || "0");

    // Fetch user count
    const userRes = await query(
      "SELECT COUNT(DISTINCT user_id) as count FROM guild_users"
    );
    const userCount = parseInt(userRes.rows[0]?.count || "0");

    // Fetch economy transactions for commands used estimation
    const cmdRes = await query(
      "SELECT COUNT(*) as count FROM economy WHERE created_at > NOW() - INTERVAL '24 hours'"
    );
    const commandsUsed = parseInt(cmdRes.rows[0]?.count || "0");

    return NextResponse.json({
      guildCount,
      userCount,
      uptime: process.uptime() * 1000,
      commandsUsed,
    });
  } catch (error) {
    console.error("[v0] Stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
