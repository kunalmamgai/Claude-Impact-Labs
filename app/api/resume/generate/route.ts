import { createResumePdf } from "@/lib/backend/resume-pdf";
import { userProfileSchema } from "@/lib/backend/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { profile?: unknown; language?: string } | null;
  const profile = userProfileSchema.safeParse(body?.profile);
  const language = body?.language || "bilingual";
  if (!profile.success || !["bilingual", "hindi", "english"].includes(language)) return Response.json({ error: "A valid profile and language are required" }, { status: 400 });
  try {
    const pdf = await createResumePdf(profile.data, language as "bilingual" | "hindi" | "english");
    const responseBody = new ArrayBuffer(pdf.byteLength);
    new Uint8Array(responseBody).set(pdf);
    return new Response(responseBody, { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${(profile.data.name || "candidate").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-resume.pdf"`, "cache-control": "no-store" } });
  } catch (error) {
    console.error("[resume_generate_failed]", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Resume PDF generation failed" }, { status: 500 });
  }
}
