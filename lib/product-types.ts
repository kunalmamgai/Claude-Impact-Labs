export type AppLanguage = "hi" | "en";
export type CaptureLanguage = "hindi" | "english" | "hinglish";
export type Screen =
  | "welcome"
  | "voice"
  | "processing"
  | "profile"
  | "matches"
  | "detail"
  | "resume"
  | "interview"
  | "complete"
  | "counsellor";

export interface SkillEvidence {
  name: string;
  evidence: string;
  confidence: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  location: string;
  district: string;
  education: string;
  educationLevel: number;
  certification: string;
  trade?: string;
  experienceLabel: string;
  experienceMonths: number;
  practicalExperience: string;
  availability: string;
  preferredRoles: string[];
  skills: SkillEvidence[];
  languages: string[];
  transcript: string;
  summary: string;
  clarification: {
    question: string;
    questionHi: string;
    options: string[];
  };
}

export type RequirementStatus = "met" | "missing" | "unknown";

export interface OpportunityRequirement {
  id: string;
  formal: string;
  simple: string;
  simpleHi: string;
  type: "education" | "certification" | "experience" | "location" | "skill";
  skill?: string;
  minEducationLevel?: number;
  requiredCertification?: string;
  minExperienceMonths?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  titleHi: string;
  organisation: string;
  location: string;
  type: "job" | "apprenticeship";
  workMode: "On-site" | "Hybrid" | "Remote";
  compensation: string;
  posted: string;
  summary: string;
  requirements: OpportunityRequirement[];
  sourceName: string;
  sourceRowId: string;
  interviewQuestions: InterviewQuestion[];
}

export interface Course {
  id: string;
  title: string;
  titleHi: string;
  provider: string;
  location: string;
  duration: string;
  closesGap: string;
  sourceName: string;
  sourceRowId: string;
  relatedTrades: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  tip: string;
}

export interface AssessedRequirement extends OpportunityRequirement {
  status: RequirementStatus;
  reason: string;
}

export interface OpportunityMatch {
  opportunity: Opportunity;
  eligible: boolean;
  relevanceScore: number;
  requirements: AssessedRequirement[];
  matchedCount: number;
  missing: AssessedRequirement[];
}
