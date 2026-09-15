import { NextRequest, NextResponse } from "next/server";
import { newSession, OAUTH_COOKIE, oauthCookie, sessionCookie, signValue, verifyValue } from "@/lib/auth";

interface OAuthState { state: string; verifier: string; redirectUri: string; expiresAt: number }
interface GoogleUser { sub: string; name?: string; email?: string; picture?: string; email_verified?: boolean }

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const saved = await verifyValue<OAuthState>(request.cookies.get(OAUTH_COOKIE)?.value);
  if (!code || !state || !saved || saved.state !== state || saved.expiresAt <= Date.now()) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", request.url));
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        code_verifier: saved.verifier,
        grant_type: "authorization_code",
        redirect_uri: saved.redirectUri,
      }),
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("Google did not return an access token");
    const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { authorization: `Bearer ${token.access_token}` },
    });
    if (!userResponse.ok) throw new Error("Google profile verification failed");
    const googleUser = await userResponse.json() as GoogleUser;
    if (!googleUser.sub || !googleUser.email || googleUser.email_verified !== true) throw new Error("A verified Google email is required");

    const signed = await signValue(newSession({ sub: googleUser.sub, name: googleUser.name || googleUser.email, email: googleUser.email, picture: googleUser.picture }));
    const response = NextResponse.redirect(new URL("/choose-role", request.url));
    response.cookies.set(sessionCookie(signed));
    response.cookies.set(oauthCookie("", 0));
    return response;
  } catch {
    const response = NextResponse.redirect(new URL("/login?error=google_verification_failed", request.url));
    response.cookies.set(oauthCookie("", 0));
    return response;
  }
}
