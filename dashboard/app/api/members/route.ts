import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    let sql = `
      SELECT 
        gu.user_id, 
        u.username,
        gu.joined_at,
        COALESCE(ul.level, 0) as level
      FROM guild_users gu
      JOIN users u ON gu.user_id = u.id
      LEFT JOIN user_levels ul ON gu.user_id = ul.user_id
    `;

    const params: any[] = [];

    if (search) {
      sql += ` WHERE LOWER(u.username) LIKE LOWER($1)`;
      params.push(`%${search}%`);
      sql += ` LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      sql += ` LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    sql += ` ORDER BY gu.joined_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      members: result.rows,
      count: result.rowCount,
      page,
      limit,
    });
  } catch (error) {
    console.error("[v0] Members API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
