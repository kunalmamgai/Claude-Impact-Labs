import { getSnapshots } from "@/lib/backend/store";

export async function GET() {
  try {
    const { opportunities, courses } = await getSnapshots();
    return Response.json({ status: "ok", service: "bhashahire-backend", opportunities: opportunities.length, courses: courses.length, voice_recordings_retained: false });
  } catch (error) {
    return Response.json({ status: "error", error: error instanceof Error ? error.message : "Snapshot load failed" }, { status: 500 });
  }
}
