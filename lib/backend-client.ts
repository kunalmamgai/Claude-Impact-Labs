import { opportunities as demoOpportunities } from "@/data/opportunities";
import type { UserProfile, MatchResult as BackendMatch } from "@/lib/backend/types";
import type { CandidateProfile, OpportunityMatch } from "@/lib/product-types";
import { apiUrl } from "@/lib/api-url";

export function candidateToUserProfile(candidate: CandidateProfile): UserProfile {
  const education: UserProfile["education"] = [];
  if (/10th/i.test(candidate.education)) education.push({ level: "10th" });
  if (/12th/i.test(candidate.education)) education.push({ level: "12th", trade_or_stream: candidate.education.replace(/12th|pass|\(|\)/gi, " ").trim() || undefined });
  if (/iti/i.test(candidate.certification)) education.push({ level: "ITI", trade_or_stream: candidate.trade });
  else if (/diploma/i.test(candidate.education)) education.push({ level: "Diploma" });
  else if (/graduate|degree/i.test(candidate.education)) education.push({ level: "Graduate" });
  if (!education.length) education.push({ level: "Other", trade_or_stream: candidate.education });
  return {
    name: candidate.name,
    location_city: candidate.location.split(",")[0]?.trim(),
    location_state: candidate.location.split(",").slice(1).join(",").trim() || "Madhya Pradesh",
    education,
    certifications: candidate.certification && !/none|not provided/i.test(candidate.certification) ? [{ name: candidate.certification }] : [],
    skills: candidate.skills.map((skill) => skill.name),
    work_experience: candidate.experienceMonths > 0 ? [{ role: candidate.preferredRoles[0], duration_months: candidate.experienceMonths, description: candidate.practicalExperience }] : [],
    languages: candidate.languages,
    availability: { shift_preference: /morning/i.test(candidate.availability) ? "Morning" : /evening/i.test(candidate.availability) ? "Evening" : "Any", can_travel: /travel/i.test(candidate.availability) },
    constraints: {},
    contact: { phone: candidate.phone },
  };
}

export function extractedToCandidate(profile: UserProfile, current: CandidateProfile): CandidateProfile {
  const highest = profile.education.at(-1);
  const certification = profile.certifications[0]?.name || (highest?.level === "ITI" ? `ITI — ${highest.trade_or_stream || "Trade"}` : current.certification);
  const name = profile.name || current.name;
  const city = profile.location_city || current.location.split(",")[0];
  const state = profile.location_state || "Madhya Pradesh";
  const experienceMonths = profile.work_experience.reduce((sum, item) => sum + item.duration_months, 0);
  return {
    ...current,
    name,
    initials: name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
    location: `${city}, ${state}`,
    district: city,
    education: highest ? `${highest.level}${highest.trade_or_stream ? ` — ${highest.trade_or_stream}` : ""}` : current.education,
    educationLevel: highest?.level === "Graduate" ? 16 : highest?.level === "Diploma" ? 14 : highest?.level === "ITI" ? 13 : highest?.level === "12th" ? 12 : 10,
    certification,
    trade: highest?.trade_or_stream?.toLowerCase() || current.trade,
    experienceMonths,
    experienceLabel: experienceMonths ? `${experienceMonths} months` : "Fresher",
    practicalExperience: profile.work_experience[0]?.description || current.practicalExperience,
    skills: profile.skills.length ? profile.skills.map((skill) => ({ name: skill, evidence: "Extracted conservatively from the candidate transcript.", confidence: 82 })) : current.skills,
    languages: profile.languages.length ? profile.languages : current.languages,
    availability: profile.availability.shift_preference ? `${profile.availability.shift_preference} shift` : current.availability,
    summary: `${certification}. ${experienceMonths ? `${experienceMonths} months of evidenced experience.` : "Seeking an entry-level opportunity."} Based in ${city}.`,
  };
}

function backendToProduct(match: BackendMatch): OpportunityMatch {
  const known = demoOpportunities.find((item) => item.sourceRowId === match.opportunity.source_listing_id || item.title.toLowerCase() === match.opportunity.title.toLowerCase());
  const requirements = [
    ...match.why_matched.map((reason, index) => ({ id: `met-${index}`, formal: reason, simple: reason, simpleHi: reason, type: "skill" as const, status: "met" as const, reason })),
    ...match.why_might_not_match.map((reason, index) => ({ id: `gap-${index}`, formal: reason, simple: reason, simpleHi: reason, type: "skill" as const, status: match.eligible ? "unknown" as const : "missing" as const, reason })),
    ...match.requirements_to_check.map((reason, index) => ({ id: `check-${index}`, formal: reason, simple: reason, simpleHi: reason, type: "skill" as const, status: "unknown" as const, reason })),
  ];
  return {
    opportunity: known || {
      id: match.opportunity.source_listing_id,
      title: match.opportunity.title,
      titleHi: match.opportunity.title,
      organisation: match.opportunity.employer,
      location: match.opportunity.city,
      type: match.opportunity.opportunity_type === "Job" ? "job" : "apprenticeship",
      workMode: "On-site",
      compensation: match.opportunity.stipend_or_salary,
      posted: `Snapshot: ${match.opportunity.snapshot_date}`,
      summary: match.opportunity.eligibility_raw,
      requirements: [],
      sourceName: match.opportunity.portal,
      sourceRowId: match.opportunity.source_listing_id,
      interviewQuestions: [],
    },
    eligible: match.eligible,
    relevanceScore: match.score,
    requirements,
    matchedCount: requirements.filter((item) => item.status === "met").length,
    missing: requirements.filter((item) => item.status === "missing"),
    needsInfo: requirements.filter((item) => item.status === "unknown"),
  };
}

export async function getBackendMatches(candidate: CandidateProfile) {
  const profile = candidateToUserProfile(candidate);
  const response = await fetch(apiUrl("/api/matches"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ profile, options: { max_results: 10, city_preference: profile.location_city, state_preference: profile.location_state } }) });
  if (!response.ok) throw new Error("Backend match request failed");
  const result = await response.json() as { matches: BackendMatch[] };
  return result.matches.map(backendToProduct);
}
