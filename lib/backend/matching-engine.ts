import type { Course, MatchResult, Opportunity, UserProfile } from "@/lib/backend/types";

const educationRank: Record<string, number> = { "10th": 1, "12th": 2, ITI: 3, Diploma: 4, Graduate: 5, Other: 0 };
const normal = (value = "") => value.toLowerCase().replace(/[^a-z0-9\u0900-\u097f]+/g, " ").trim();
const overlaps = (left: string, right: string) => { const a = normal(left); const b = normal(right); return Boolean(a && b && (a.includes(b) || b.includes(a) || a.split(" ").some((token) => token.length > 3 && b.includes(token)))); };

function bestEducation(profile: UserProfile) { return Math.max(0, ...profile.education.map((item) => educationRank[item.level] ?? 0)); }
function relevantExperience(profile: UserProfile, opportunity: Opportunity) {
  const terms = [opportunity.title, ...opportunity.skills_required];
  return profile.work_experience.filter((experience) => terms.some((term) => overlaps(`${experience.role || ""} ${experience.sector || ""} ${experience.description || ""}`, term))).reduce((sum, item) => sum + item.duration_months, 0);
}

export function matchOpportunities(profile: UserProfile, opportunities: Opportunity[], courses: Course[], options: { max_results: number; city_preference?: string; state_preference?: string }): MatchResult[] {
  const userEducation = bestEducation(profile);
  const certifications = profile.certifications.map((item) => item.name);
  return opportunities.map((opportunity) => {
    const requiredEducation = Math.min(...opportunity.education_required.map((item) => educationRank[item] ?? 99));
    const educationMet = !opportunity.education_required.length || userEducation >= requiredEducation;
    const missingCertifications = opportunity.certifications_required.filter((required) => !certifications.some((item) => overlaps(item, required)));
    const experience = relevantExperience(profile, opportunity);
    const experienceMet = experience >= opportunity.min_experience_months;
    const matchingSkills = opportunity.skills_required.filter((required) => profile.skills.some((skill) => overlaps(skill, required)));
    const missingSkills = opportunity.skills_required.filter((required) => !matchingSkills.includes(required));
    const eligible = educationMet && missingCertifications.length === 0 && experienceMet;
    const city = options.city_preference || profile.location_city;
    const state = options.state_preference || profile.location_state;
    let score = 50 + Math.min(20, matchingSkills.length * 2) + Math.min(10, Math.max(0, Math.floor((experience - opportunity.min_experience_months) / 6)));
    if (city && normal(city) === normal(opportunity.city)) score += 10;
    else if (state && normal(state) === normal(opportunity.state)) score += 5;
    if (profile.languages.some((language) => /hindi|हिंदी/i.test(language)) && /hindi|हिंदी/i.test(opportunity.eligibility_raw)) score += 5;
    score -= missingCertifications.length * 10;
    if (opportunity.age_min || opportunity.age_max) score -= 5;
    score = Math.max(0, Math.min(100, score));

    const whyMatched: string[] = [];
    if (educationMet) whyMatched.push(`Your education meets the ${opportunity.education_required.join(" or ") || "stated"} requirement.`);
    if (matchingSkills.length) whyMatched.push(`Matching skills: ${matchingSkills.join(", ")}.`);
    if (experienceMet) whyMatched.push(opportunity.min_experience_months ? `Your relevant experience meets the ${opportunity.min_experience_months}-month minimum.` : "Freshers are accepted for this opportunity.");
    if (city && normal(city) === normal(opportunity.city)) whyMatched.push(`The role is in your preferred city, ${opportunity.city}.`);
    const whyNot: string[] = [];
    if (!educationMet) whyNot.push(`Your recorded education does not meet: ${opportunity.education_required.join(" or ")}.`);
    if (missingCertifications.length) whyNot.push(`Missing certification: ${missingCertifications.join(", ")}.`);
    if (!experienceMet) whyNot.push(`This role needs ${opportunity.min_experience_months} relevant months; ${experience} are evidenced in the profile.`);
    if (missingSkills.length) whyNot.push(`Skills to strengthen or confirm: ${missingSkills.slice(0, 3).join(", ")}.`);
    const requirementsToCheck: string[] = [];
    if (opportunity.age_min || opportunity.age_max) requirementsToCheck.push(`Confirm the listed age range${opportunity.age_min ? ` from ${opportunity.age_min}` : ""}${opportunity.age_max ? ` to ${opportunity.age_max}` : ""}. Age is not used for ranking when it is unknown.`);
    if (/women|woman|female|महिला/i.test(opportunity.eligibility_raw)) requirementsToCheck.push("This listing includes a government category requirement. The tool exposes it but does not use it for ranking.");

    const gaps = [...missingCertifications, ...missingSkills];
    const gapCourses = courses.filter((course) => gaps.some((gap) => [...course.skills_covered, ...course.qualification_targeted].some((covered) => overlaps(covered, gap))))
      .sort((a, b) => Number(normal(b.city) === normal(profile.location_city)) - Number(normal(a.city) === normal(profile.location_city)))
      .slice(0, 2).map((course) => ({ course, gap_addressed: gaps.find((gap) => [...course.skills_covered, ...course.qualification_targeted].some((covered) => overlaps(covered, gap))) || "Qualification gap" }));

    return { opportunity, eligible, score, why_matched: whyMatched.slice(0, 5), why_might_not_match: whyNot.slice(0, 3), requirements_to_check: requirementsToCheck.slice(0, 3), gap_courses: gapCourses,
      source: { portal: opportunity.portal, listing_id: opportunity.source_listing_id, snapshot_date: opportunity.snapshot_date, url: opportunity.source_url } };
  }).filter((item) => item.score >= 35).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.score - a.score).slice(0, options.max_results);
}
