import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { importSnapshot } from "@/lib/backend/store";
import { recordMetric } from "@/lib/backend/metrics";

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const keyValid = Boolean(process.env.ADMIN_API_KEY && request.headers.get("x-admin-api-key") === process.env.ADMIN_API_KEY);
  if (session?.role !== "counsellor" && !keyValid) return Response.json({ error: "Counsellor authentication or a valid admin API key is required" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const type = form.get("type");
  if (!(file instanceof File) || (type !== "opportunities" && type !== "courses")) return Response.json({ error: "Upload a CSV file and choose opportunities or courses" }, { status: 400 });
  if (file.size > 5_000_000) return Response.json({ error: "CSV file must be smaller than 5 MB" }, { status: 400 });
  try {
    const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");
    if (backendUrl && process.env.ADMIN_API_KEY) {
      const backendForm = new FormData();
      backendForm.append("file", file);
      backendForm.append("type", type);
      const backendResponse = await fetch(`${backendUrl}/api/admin/import-csv`, { method: "POST", headers: { "x-admin-api-key": process.env.ADMIN_API_KEY }, body: backendForm });
      const result = await backendResponse.json();
      return Response.json(result, { status: backendResponse.status });
    }
    const rows = await importSnapshot(type, await file.text());
    recordMetric("csv_imports");
    return Response.json({ status: "ok", rows_imported: rows, type });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "CSV validation failed" }, { status: 400 });
  }
}
