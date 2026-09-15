import type { CandidateProfile } from "@/lib/product-types";

export interface ProfileExtractionRequest {
  transcript: string;
  demoCandidateId?: string;
}

export interface ProfileExtractionResult {
  profile: CandidateProfile;
  provider: "mock" | "claude";
  notice?: string;
}

export interface ProfileExtractor {
  extract(request: ProfileExtractionRequest): Promise<ProfileExtractionResult>;
}
