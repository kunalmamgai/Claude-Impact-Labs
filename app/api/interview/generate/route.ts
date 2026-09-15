import { generateInterviewQuestions } from "@/lib/backend/interview";
import { userProfileSchema } from "@/lib/backend/schemas";
import type { Opportunity } from "@/lib/backend/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { profile?: unknown; opportunity?: Opportunity; language?: string } | null;
  const profile = userProfileSchema.safeParse(body?.profile);
  if (!profile.success || !body?.opportunity?.source_listing_id) return Response.json({ error: "A valid profile and opportunity are required" }, { status: 400 });
  return Response.json({ questions: generateInterviewQuestions(profile.data, body.opportunity), provider: "deterministic", language: body.language || "bilingual" });
}
