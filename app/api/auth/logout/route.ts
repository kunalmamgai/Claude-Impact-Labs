import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(sessionCookie("", 0));
  return response;
}
