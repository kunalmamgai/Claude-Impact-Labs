import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "bhashahire_session";
export const OAUTH_COOKIE = "bhashahire_oauth";

export type AppRole = "user" | "counsellor";

export interface AuthSession {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  role?: AppRole;
  issuedAt: number;
  expiresAt: number;
}

const encoder = new TextEncoder();

function base64url(input: Uint8Array | string) {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function hmac(value: string) {
  const secret = process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? "" : "local-development-secret-change-me");
  if (!secret) throw new Error("AUTH_SECRET is required in production");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

export async function signValue(payload: unknown) {
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${await hmac(encoded)}`;
}

export async function verifyValue<T>(value?: string | null): Promise<T | null> {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature || (await hmac(encoded)) !== signature) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64url(encoded))) as T;
  } catch {
    return null;
  }
}

export async function getSession(request: NextRequest) {
  const session = await verifyValue<AuthSession>(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session || session.expiresAt <= Date.now()) return null;
  return session;
}

export function sessionCookie(value: string, maxAge = 60 * 60 * 8) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function oauthCookie(value: string, maxAge = 60 * 10) {
  return {
    name: OAUTH_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function newSession(user: Pick<AuthSession, "sub" | "name" | "email" | "picture">, role?: AppRole): AuthSession {
  const issuedAt = Date.now();
  return { ...user, role, issuedAt, expiresAt: issuedAt + 8 * 60 * 60 * 1000 };
}

export function randomToken(bytes = 32) {
  return base64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function sha256(value: string) {
  return base64url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}
