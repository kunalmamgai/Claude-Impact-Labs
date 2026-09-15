import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  return Response.json({ session: await getSession(request) }, { headers: { "cache-control": "no-store" } });
}
