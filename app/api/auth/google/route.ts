import { NextRequest, NextResponse } from "next/server";
import { oauthCookie, randomToken, sha256, signValue } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", request.url));
  }

  const state = randomToken();
  const verifier = randomToken(48);
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || new URL("/api/auth/google/callback", request.url).toString();
  const cookieValue = await signValue({ state, verifier, redirectUri, expiresAt: Date.now() + 10 * 60 * 1000 });
  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email profile");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("code_challenge", await sha256(verifier));
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  authorizationUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(oauthCookie(cookieValue));
  return response;
}
