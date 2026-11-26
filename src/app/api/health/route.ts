import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database/db";
import { CRON_SECRET } from "@/lib/env";
import { parseError } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  try {
    const conn = await db();
    const admin = conn.connection.db?.admin();

    if (!admin) {
      throw new Error("MongoDB database instance is unavailable");
    }

    await admin.ping();

    return NextResponse.json(
      {
        ok: true,
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("MongoDB keep-alive ping failed:", error);
    return NextResponse.json(
      {
        ok: false,
        database: "error",
        message: parseError(error),
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
