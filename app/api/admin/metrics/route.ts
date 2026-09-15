import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { readMetrics } from "@/lib/backend/metrics";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (session?.role !== "counsellor") return Response.json({ error: "Counsellor authentication required" }, { status: 401 });
  return Response.json({ metrics: readMetrics() }, { headers: { "cache-control": "no-store" } });
}
