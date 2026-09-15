import { getCandidate } from "@/data/candidates";
import { extractedToCandidate } from "@/lib/backend-client";
import type { UserProfile } from "@/lib/backend/types";
import type { ProfileExtractor } from "@/lib/ai/types";
import { apiUrl } from "@/lib/api-url";

export const profileExtractor: ProfileExtractor = {
  async extract(request) {
    const current = getCandidate(request.demoCandidateId ?? "rahul");
    const response = await fetch(apiUrl("/api/profile/extract"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ transcript: request.transcript }) });
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(result.error || "Profile extraction failed");
    }
    const result = await response.json() as { profile: UserProfile; provider: string };
    return { profile: { ...extractedToCandidate(result.profile, current), transcript: request.transcript }, provider: result.provider === "llm" ? "claude" : "mock", notice: result.provider === "llm" ? "Profile extracted by the configured server-side language model." : "Private deterministic extraction is active; no transcript left this server." };
  },
};
