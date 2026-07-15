import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Mock commands data - in production, fetch from actual command registry
const mockCommands = [
  {
    id: "1",
    name: "balance",
    description: "Check your economy balance",
    category: "Economy",
    enabled: true,
    cooldown: 5,
  },
  {
    id: "2",
    name: "daily",
    description: "Claim your daily reward",
    category: "Economy",
    enabled: true,
    cooldown: 86400,
  },
  {
    id: "3",
    name: "warn",
    description: "Warn a member",
    category: "Moderation",
    enabled: true,
    cooldown: 0,
  },
  {
    id: "4",
    name: "kick",
    description: "Kick a member from the server",
    category: "Moderation",
    enabled: true,
    cooldown: 0,
  },
  {
    id: "5",
    name: "ban",
    description: "Ban a member from the server",
    category: "Moderation",
    enabled: true,
    cooldown: 0,
  },
  {
    id: "6",
    name: "music play",
    description: "Play a song",
    category: "Music",
    enabled: true,
    cooldown: 2,
  },
  {
    id: "7",
    name: "birthday",
    description: "Set your birthday",
    category: "Birthday",
    enabled: true,
    cooldown: 0,
  },
  {
    id: "8",
    name: "help",
    description: "Get help with commands",
    category: "Core",
    enabled: true,
    cooldown: 0,
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.toLowerCase() || "";
    const category = searchParams.get("category") || "all";

    let filtered = mockCommands;

    if (search) {
      filtered = filtered.filter((cmd) =>
        cmd.name.toLowerCase().includes(search) ||
        cmd.description.toLowerCase().includes(search)
      );
    }

    if (category !== "all") {
      filtered = filtered.filter((cmd) =>
        cmd.category.toLowerCase() === category.toLowerCase()
      );
    }

    const categories = [...new Set(mockCommands.map((cmd) => cmd.category))];

    return NextResponse.json({
      commands: filtered,
      categories,
      total: filtered.length,
    });
  } catch (error) {
    console.error("[v0] Commands API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
