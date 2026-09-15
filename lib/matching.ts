import type {
  AssessedRequirement,
  CandidateProfile,
  Opportunity,
  OpportunityMatch,
} from "@/lib/product-types";
import { opportunities } from "@/data/opportunities";

const normalise = (value: string) => value.trim().toLowerCase();

function assessRequirement(candidate: CandidateProfile, requirement: Opportunity["requirements"][number]): AssessedRequirement {
  if (requirement.type === "education") {
    const met = candidate.educationLevel >= (requirement.minEducationLevel ?? 0);
    return { ...requirement, status: met ? "met" : "missing", reason: met ? `${candidate.education} meets this rule.` : `Your current education is ${candidate.education}.` };
  }

  if (requirement.type === "certification") {
    const required = normalise(requirement.requiredCertification ?? "");
    const certification = normalise(candidate.certification);
    const flexibleTradeRule = requirement.formal.toLowerCase().includes("electrician or fitter");
    const met = flexibleTradeRule
      ? certification.includes("electrician") || certification.includes("fitter")
      : Boolean(required && certification.includes(required));
    return { ...requirement, status: met ? "met" : "missing", reason: met ? `${candidate.certification} matches the requested trade.` : `This asks for ${requirement.requiredCertification}; your profile lists ${candidate.certification}.` };
  }

  if (requirement.type === "experience") {
    const needed = requirement.minExperienceMonths ?? 0;
    const met = candidate.experienceMonths >= needed;
    return { ...requirement, status: met ? "met" : "missing", reason: met ? (needed === 0 ? "Freshers are accepted." : `Your ${candidate.experienceMonths} months meets this requirement.`) : `You have ${candidate.experienceMonths} documented months; this role asks for ${needed}.` };
  }

  if (requirement.type === "skill") {
    const sought = normalise(requirement.skill ?? "");
    const found = candidate.skills.find((skill) => {
      const available = normalise(skill.name);
      return available.includes(sought) || sought.includes(available);
    });
    return { ...requirement, status: found ? "met" : "unknown", reason: found ? `Found in your profile: ${found.name}.` : "We did not hear enough evidence for this skill yet." };
  }

  const sameDistrict = normalise(requirement.simple).includes(normalise(candidate.district));
  return { ...requirement, status: sameDistrict ? "met" : "unknown", reason: sameDistrict ? `${candidate.location} matches.` : "Please confirm whether you can travel to this location." };
}

export function assessOpportunity(candidate: CandidateProfile, opportunity: Opportunity): OpportunityMatch {
  const requirements = opportunity.requirements.map((requirement) => assessRequirement(candidate, requirement));
  // A listing is only shown as eligible when every stated condition is met.
  // Unknown evidence is intentionally not treated as a pass.
  const eligible = requirements.every((requirement) => requirement.status === "met");
  const met = requirements.filter((requirement) => requirement.status === "met").length;
  const relevanceScore = Math.max(48, Math.min(98, Math.round(50 + (met / requirements.length) * 45 - (eligible ? 0 : 8))));
  return {
    opportunity,
    eligible,
    relevanceScore,
    requirements,
    matchedCount: met,
    missing: requirements.filter((requirement) => requirement.status === "missing"),
  };
}

export function getMatches(candidate: CandidateProfile): OpportunityMatch[] {
  return opportunities
    .map((opportunity) => assessOpportunity(candidate, opportunity))
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.relevanceScore - a.relevanceScore);
}
