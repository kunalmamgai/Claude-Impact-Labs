import { userProfileSchema } from "@/lib/backend/schemas";
import type { UserProfile } from "@/lib/backend/types";

export const PROFILE_SYSTEM_PROMPT = `You are an assistant that extracts a structured job-seeker profile from a short spoken self-description in Hindi/Hinglish.
Output strict JSON matching the given schema. Do not add extra fields. If a field is unknown, omit it.
Do not infer protected attributes (caste, religion, gender) unless explicitly stated by the user for a specific field.
Prefer conservative extraction: if unsure, leave the field empty rather than guessing.`;

function deterministicExtract(transcript: string): UserProfile {
  const lower = transcript.toLowerCase();
  const education: UserProfile["education"] = [];
  if (/iti/.test(lower)) education.push({ level: "ITI", trade_or_stream: /electric/.test(lower) ? "Electrician" : /fitter/.test(lower) ? "Fitter" : undefined });
  else if (/\b(?:graduate|graduation|b\.?(?:a|com|sc))\b|स्नातक/.test(lower)) education.push({ level: "Graduate" });
  else if (/diploma/.test(lower)) education.push({ level: "Diploma" });
  else if (/12th|12वीं|barahvi|बारहवीं/.test(lower)) education.push({ level: "12th" });
  else if (/10th|10वीं|dasvi|दसवीं/.test(lower)) education.push({ level: "10th" });
  const months = lower.match(/(\d+)\s*(?:saal|year|years)/)?.[1];
  const skills = [
    ["customer handling", /customer|ग्राहक/], ["billing", /billing|बिलिंग/], ["stock management", /stock|inventory/], ["residential wiring", /wiring|वायरिंग/],
    ["electrical troubleshooting", /electrical|electrician|बिजली/], ["MS Excel", /excel|spreadsheet/], ["MS Word", /word|document/], ["data entry", /data entry|record keeping/],
    ["bench fitting", /fitting|filing|bench/], ["measurement tools", /vernier|measurement|measuring/],
  ].filter(([, pattern]) => (pattern as RegExp).test(lower)).map(([skill]) => skill as string);
  const city = ["Bhopal", "Sehore", "Indore", "Raisen"].find((item) => lower.includes(item.toLowerCase()));
  const nameMatch = transcript.match(/(?:mera naam|my name is)\s+([a-zA-Z ]{2,40}?)(?=\s+hai\b|[.,]|$)/i);
  return userProfileSchema.parse({
    ...(nameMatch ? { name: nameMatch[1].trim() } : {}), ...(city ? { location_city: city, location_state: "Madhya Pradesh" } : {}), education,
    certifications: /certificate|certification|iti/i.test(lower) ? [{ name: education.find((item) => item.level === "ITI") ? `ITI ${education.find((item) => item.level === "ITI")?.trade_or_stream || ""}`.trim() : "Certificate mentioned" }] : [],
    skills,
    work_experience: months ? [{ duration_months: Number(months) * 12, description: transcript }] : [],
    languages: [/hindi|हिंदी|main |maine |mujhe /.test(lower) ? "Hindi" : "", /english/.test(lower) ? "English" : ""].filter(Boolean),
    availability: { shift_preference: /subah|morning/.test(lower) && /sham|evening/.test(lower) ? "Any" : /subah|morning/.test(lower) ? "Morning" : /sham|evening/.test(lower) ? "Evening" : undefined }, constraints: {},
  });
}

async function llmExtract(transcript: string) {
  if (!process.env.LLM_API_KEY || !process.env.LLM_BASE_URL) return null;
  const response = await fetch(process.env.LLM_BASE_URL, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.LLM_API_KEY}` }, body: JSON.stringify({
    model: process.env.LLM_MODEL, temperature: 0, response_format: { type: "json_object" }, messages: [{ role: "system", content: PROFILE_SYSTEM_PROMPT }, { role: "user", content: `Schema fields: name, location_city, location_state, education[], certifications[], skills[], work_experience[], languages[], availability, constraints, contact.\nTranscript:\n${transcript}` }],
  }) });
  if (!response.ok) throw new Error(`LLM request failed with ${response.status}`);
  const result = await response.json() as { choices?: { message?: { content?: string } }[] };
  const content = result.choices?.[0]?.message?.content;
  return content ? userProfileSchema.parse(JSON.parse(content)) : null;
}

export async function extractProfile(transcript: string) {
  const llm = await llmExtract(transcript).catch(() => null);
  return { profile: llm || deterministicExtract(transcript), provider: llm ? "llm" : "deterministic" };
}
