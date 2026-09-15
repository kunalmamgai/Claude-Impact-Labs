import { getCandidate } from "@/data/candidates";
import type { ProfileExtractor } from "@/lib/ai/types";

export const mockProfileExtractor: ProfileExtractor = {
  async extract(request) {
    const profile = getCandidate(request.demoCandidateId ?? "rahul");
    return {
      profile: { ...profile, transcript: request.transcript.trim() || profile.transcript },
      provider: "mock",
      notice: "Deterministic demo mode is active. No recording or transcript is sent to an external service.",
    };
  },
};
