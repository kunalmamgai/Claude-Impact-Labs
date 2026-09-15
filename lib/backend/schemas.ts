import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  location_city: z.string().trim().min(1).optional(),
  location_state: z.string().trim().min(1).optional(),
  education: z.array(z.object({ level: z.enum(["10th", "12th", "ITI", "Diploma", "Graduate", "Other"]), trade_or_stream: z.string().optional(), year: z.number().int().min(1950).max(2100).optional() })).default([]),
  certifications: z.array(z.object({ name: z.string().min(1), issuing_body: z.string().optional(), year: z.number().int().min(1950).max(2100).optional() })).default([]),
  skills: z.array(z.string().min(1)).default([]),
  work_experience: z.array(z.object({ role: z.string().optional(), sector: z.string().optional(), duration_months: z.number().int().nonnegative(), description: z.string().optional() })).default([]),
  languages: z.array(z.string().min(1)).default([]),
  availability: z.object({ shift_preference: z.enum(["Morning", "Evening", "Night", "Any"]).optional(), can_travel: z.boolean().optional(), max_commute_km: z.number().nonnegative().optional(), start_date: z.string().optional() }).default({}),
  constraints: z.object({ notes: z.string().optional() }).default({}),
  contact: z.object({ phone: z.string().optional(), whatsapp: z.string().optional() }).optional(),
}).strict();

export const matchesRequestSchema = z.object({
  profile: userProfileSchema,
  options: z.object({ max_results: z.number().int().min(1).max(25).default(10), city_preference: z.string().optional(), state_preference: z.string().optional() }).default({ max_results: 10 }),
});
