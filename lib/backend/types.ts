export type EducationLevel = "10th" | "12th" | "ITI" | "Diploma" | "Graduate" | "Other";

export interface UserProfile {
  name?: string;
  location_city?: string;
  location_state?: string;
  education: { level: EducationLevel; trade_or_stream?: string; year?: number }[];
  certifications: { name: string; issuing_body?: string; year?: number }[];
  skills: string[];
  work_experience: { role?: string; sector?: string; duration_months: number; description?: string }[];
  languages: string[];
  availability: { shift_preference?: "Morning" | "Evening" | "Night" | "Any"; can_travel?: boolean; max_commute_km?: number; start_date?: string };
  constraints: { notes?: string };
  contact?: { phone?: string; whatsapp?: string };
}

export interface Opportunity {
  portal: "NCS" | "NAPS" | "NATS";
  source_listing_id: string;
  source_url: string;
  title: string;
  employer: string;
  opportunity_type: "Job" | "Apprenticeship";
  city: string;
  state: string;
  education_required: string[];
  certifications_required: string[];
  skills_required: string[];
  min_experience_months: number;
  age_min?: number;
  age_max?: number;
  stipend_or_salary: string;
  eligibility_raw: string;
  posted_on?: string;
  closing_on?: string;
  snapshot_date: string;
  is_active_in_snapshot: boolean;
}

export interface Course {
  course_id: string;
  course_name: string;
  provider: string;
  city: string;
  state: string;
  qualification_targeted: string[];
  skills_covered: string[];
  duration_weeks: number;
  fees_inr?: number;
  contact_info: string;
  source_url: string;
  snapshot_date: string;
}

export interface MatchResult {
  opportunity: Opportunity;
  eligible: boolean;
  score: number;
  why_matched: string[];
  why_might_not_match: string[];
  requirements_to_check: string[];
  gap_courses: { course: Course; gap_addressed: string }[];
  source: { portal: string; listing_id: string; snapshot_date: string; url: string };
}
