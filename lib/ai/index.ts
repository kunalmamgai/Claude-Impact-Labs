import { mockProfileExtractor } from "@/lib/ai/mock";

// The product UI depends on this small provider boundary. A secure server-side
// Claude adapter can replace the deterministic extractor without changing screens.
export const profileExtractor = mockProfileExtractor;
