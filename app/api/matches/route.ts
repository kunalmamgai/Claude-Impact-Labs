import { matchesRequestSchema } from "@/lib/backend/schemas";
import { matchOpportunities } from "@/lib/backend/matching-engine";
import { recordMetric } from "@/lib/backend/metrics";
import { rateLimit } from "@/lib/backend/rate-limit";
import { getSnapshots } from "@/lib/backend/store";

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`matches:${client}`, 40)) return Response.json({ error: "Too many match requests. Please wait a minute." }, { status: 429 });
  const parsed = matchesRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid profile or match options", details: parsed.error.flatten() }, { status: 400 });
  try {
    const snapshots = await getSnapshots(new URL(request.url).origin);
    const matches = matchOpportunities(parsed.data.profile, snapshots.opportunities, snapshots.courses, parsed.data.options);
    recordMetric("match_requests"); recordMetric("matches_returned", matches.length);
    return Response.json({ matches, snapshot: { opportunities: snapshots.opportunities.length, courses: snapshots.courses.length, date: snapshots.opportunities[0]?.snapshot_date } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Snapshot data could not be loaded" }, { status: 500 });
  }
}
