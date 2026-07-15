import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URL || process.env.DATABASE_URL || "postgresql://localhost:5432/titanbot",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("[v0] Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("[v0] Database query error:", error);
    throw error;
  }
}

export async function getConnection() {
  return pool.connect();
}

export default pool;
