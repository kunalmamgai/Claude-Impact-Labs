import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { generateInterviewQuestions } from "@/lib/backend/interview";
import { matchOpportunities } from "@/lib/backend/matching-engine";
import { readMetrics, recordMetric } from "@/lib/backend/metrics";
import { extractProfile } from "@/lib/backend/profile-extractor";
import { rateLimit } from "@/lib/backend/rate-limit";
import { createResumePdf } from "@/lib/backend/resume-pdf";
import { matchesRequestSchema, userProfileSchema } from "@/lib/backend/schemas";
import { getSnapshots, importSnapshot } from "@/lib/backend/store";
import type { Opportunity } from "@/lib/backend/types";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5_000_000, files: 1 } });
const port = Number(process.env.PORT || 4000);
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(cors({
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) callback(null, true);
    else callback(new Error("Origin not allowed"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["content-type", "x-admin-api-key"],
}));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => response.json({ service: "BhashaHire backend", health: "/api/health" }));

app.get("/api/health", async (_request, response, next) => {
  try {
    const { opportunities, courses } = await getSnapshots();
    response.json({ status: "ok", service: "bhashahire-backend", opportunities: opportunities.length, courses: courses.length, voice_recordings_retained: false });
  } catch (error) { next(error); }
});

app.post("/api/profile/extract", async (request, response, next) => {
  if (!rateLimit(`profile:${request.ip}`, 20)) return response.status(429).json({ error: "Too many profile requests. Please wait a minute." });
  const transcript = typeof request.body?.transcript === "string" ? request.body.transcript.trim() : "";
  if (transcript.length < 20) return response.status(400).json({ error: "Transcript must contain at least 20 characters." });
  try {
    const result = await extractProfile(transcript);
    recordMetric("profile_extractions");
    response.json(result);
  } catch (error) { next(error); }
});

app.post("/api/matches", async (request, response, next) => {
  if (!rateLimit(`matches:${request.ip}`, 40)) return response.status(429).json({ error: "Too many match requests. Please wait a minute." });
  const parsed = matchesRequestSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "Invalid profile or match options", details: parsed.error.flatten() });
  try {
    const snapshots = await getSnapshots();
    const matches = matchOpportunities(parsed.data.profile, snapshots.opportunities, snapshots.courses, parsed.data.options);
    recordMetric("match_requests");
    recordMetric("matches_returned", matches.length);
    response.json({ matches, snapshot: { opportunities: snapshots.opportunities.length, courses: snapshots.courses.length, date: snapshots.opportunities[0]?.snapshot_date } });
  } catch (error) { next(error); }
});

app.post("/api/resume/generate", async (request, response, next) => {
  const profile = userProfileSchema.safeParse(request.body?.profile);
  const language = request.body?.language || "bilingual";
  if (!profile.success || !["bilingual", "hindi", "english"].includes(language)) return response.status(400).json({ error: "A valid profile and language are required" });
  try {
    const pdf = await createResumePdf(profile.data, language as "bilingual" | "hindi" | "english");
    const filename = `${(profile.data.name || "candidate").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-resume.pdf`;
    response.set({ "content-type": "application/pdf", "content-disposition": `attachment; filename="${filename}"`, "cache-control": "no-store" }).send(Buffer.from(pdf));
  } catch (error) { next(error); }
});

app.post("/api/interview/generate", (request, response) => {
  const profile = userProfileSchema.safeParse(request.body?.profile);
  const opportunity = request.body?.opportunity as Opportunity | undefined;
  if (!profile.success || !opportunity?.source_listing_id) return response.status(400).json({ error: "A valid profile and opportunity are required" });
  response.json({ questions: generateInterviewQuestions(profile.data, opportunity), provider: "deterministic", language: request.body?.language || "bilingual" });
});

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  if (!process.env.ADMIN_API_KEY || request.header("x-admin-api-key") !== process.env.ADMIN_API_KEY) return response.status(401).json({ error: "A valid admin API key is required" });
  next();
}

app.post("/api/admin/import-csv", requireAdmin, upload.single("file"), async (request, response) => {
  const type = request.body?.type;
  if (!request.file || (type !== "opportunities" && type !== "courses")) return response.status(400).json({ error: "Upload a CSV file and choose opportunities or courses" });
  try {
    const rows = await importSnapshot(type, request.file.buffer.toString("utf8"));
    recordMetric("csv_imports");
    response.json({ status: "ok", rows_imported: rows, type });
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : "CSV validation failed" });
  }
});

app.get("/api/admin/metrics", requireAdmin, (_request, response) => response.json({ metrics: readMetrics() }));

app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  void next;
  console.error("[backend_error]", error instanceof Error ? error.message : "unknown error");
  response.status(500).json({ error: "The backend could not complete this request." });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[bhashahire_backend] listening on ${port}`);
});
