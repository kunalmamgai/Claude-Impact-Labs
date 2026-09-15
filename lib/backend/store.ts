import { list, numberOrUndefined, parseCsv, truthy } from "@/lib/backend/csv";
import type { Course, Opportunity } from "@/lib/backend/types";
import defaultOpportunitiesUrl from "@/data/snapshots/opportunities.csv?url";
import defaultCoursesUrl from "@/data/snapshots/courses.csv?url";

const opportunityHeaders = ["portal", "source_listing_id", "source_url", "title", "employer", "opportunity_type", "city", "state", "education_required", "certifications_required", "skills_required", "min_experience_months", "age_min", "age_max", "stipend_or_salary", "eligibility_raw", "posted_on", "closing_on", "snapshot_date", "is_active_in_snapshot"];
const courseHeaders = ["course_id", "course_name", "provider", "city", "state", "qualification_targeted", "skills_covered", "duration_weeks", "fees_inr", "contact_info", "source_url", "snapshot_date"];

let importedOpportunities: Opportunity[] | undefined;
let importedCourses: Course[] | undefined;

function assertHeaders(rows: Record<string, string>[], expected: string[]) {
  const actual = Object.keys(rows[0] || {});
  const missing = expected.filter((header) => !actual.includes(header));
  if (missing.length) throw new Error(`Missing CSV headers: ${missing.join(", ")}`);
}

export function parseOpportunities(text: string) {
  const rows = parseCsv(text); assertHeaders(rows, opportunityHeaders);
  return rows.map((row) => ({
    portal: row.portal as Opportunity["portal"], source_listing_id: row.source_listing_id, source_url: row.source_url, title: row.title, employer: row.employer,
    opportunity_type: row.opportunity_type as Opportunity["opportunity_type"], city: row.city, state: row.state, education_required: list(row.education_required),
    certifications_required: list(row.certifications_required), skills_required: list(row.skills_required), min_experience_months: Number(row.min_experience_months || 0),
    age_min: numberOrUndefined(row.age_min), age_max: numberOrUndefined(row.age_max), stipend_or_salary: row.stipend_or_salary, eligibility_raw: row.eligibility_raw,
    posted_on: row.posted_on || undefined, closing_on: row.closing_on || undefined, snapshot_date: row.snapshot_date, is_active_in_snapshot: truthy(row.is_active_in_snapshot),
  })).filter((item) => ["NCS", "NAPS", "NATS"].includes(item.portal) && item.source_listing_id && item.is_active_in_snapshot);
}

export function parseCourses(text: string) {
  const rows = parseCsv(text); assertHeaders(rows, courseHeaders);
  return rows.map((row) => ({ course_id: row.course_id, course_name: row.course_name, provider: row.provider, city: row.city, state: row.state,
    qualification_targeted: list(row.qualification_targeted), skills_covered: list(row.skills_covered), duration_weeks: Number(row.duration_weeks || 0),
    fees_inr: numberOrUndefined(row.fees_inr), contact_info: row.contact_info, source_url: row.source_url, snapshot_date: row.snapshot_date,
  })).filter((item) => item.course_id && item.course_name);
}

async function loadAsset(url: string, origin: string) {
  const response = await fetch(new URL(url, origin));
  if (!response.ok) throw new Error(`Snapshot asset could not be loaded (${response.status})`);
  return response.text();
}

export async function getSnapshots(origin: string) {
  if (!importedOpportunities) importedOpportunities = parseOpportunities(await loadAsset(defaultOpportunitiesUrl, origin));
  if (!importedCourses) importedCourses = parseCourses(await loadAsset(defaultCoursesUrl, origin));
  return { opportunities: importedOpportunities, courses: importedCourses };
}

export async function importSnapshot(type: "opportunities" | "courses", csv: string) {
  if (type === "opportunities") {
    const opportunities = parseOpportunities(csv);
    importedOpportunities = opportunities;
    return opportunities.length;
  }
  const courses = parseCourses(csv);
  importedCourses = courses;
  return courses.length;
}
