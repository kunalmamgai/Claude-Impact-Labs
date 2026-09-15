import { NextResponse } from "next/server";
import { newSession, sessionCookie, signValue } from "@/lib/auth";

export async function POST() {
  if (process.env.AUTH_DEMO_MODE !== "true") return Response.json({ error: "Demo sign-in is disabled" }, { status: 404 });
  const session = newSession({ sub: "local-demo", name: "Demo Operator", email: "demo@bhashahire.local" });
  const response = NextResponse.json({ session });
  response.cookies.set(sessionCookie(await signValue(session)));
  return response;
}
