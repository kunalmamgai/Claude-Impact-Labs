import { NextRequest, NextResponse } from "next/server";
import { getSession, sessionCookie, signValue, type AppRole } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return Response.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { role?: AppRole };
  if (body.role !== "user" && body.role !== "counsellor") return Response.json({ error: "Choose user or counsellor" }, { status: 400 });
  const updated = { ...session, role: body.role };
  const response = NextResponse.json({ session: updated });
  response.cookies.set(sessionCookie(await signValue(updated)));
  return response;
}
