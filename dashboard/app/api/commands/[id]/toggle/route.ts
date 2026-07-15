import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enabled } = await request.json();

    // Update command status in database
    const result = await query(
      `UPDATE commands SET enabled = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [enabled, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Command not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      command: result.rows[0],
    });
  } catch (error) {
    console.error("[v0] Command toggle API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
