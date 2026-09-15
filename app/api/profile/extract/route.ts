import { extractProfile } from "@/lib/backend/profile-extractor";
import { recordMetric } from "@/lib/backend/metrics";
import { rateLimit } from "@/lib/backend/rate-limit";

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`profile:${client}`, 20)) return Response.json({ error: "Too many profile requests. Please wait a minute." }, { status: 429 });
  const body = await request.json().catch(() => ({})) as { transcript?: string };
  const transcript = body.transcript?.trim() || "";
  if (transcript.length < 20) return Response.json({ error: "Transcript must contain at least 20 characters." }, { status: 400 });
  try {
    const result = await extractProfile(transcript);
    recordMetric("profile_extractions");
    return Response.json(result);
  } catch {
    return Response.json({ error: "The transcript could not be converted into a valid profile." }, { status: 500 });
  }
}
