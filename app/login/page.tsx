"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LogIn, LockKeyhole, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [config, setConfig] = useState<{ googleConfigured: boolean; demoEnabled: boolean }>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetch("/api/auth/config").then((response) => response.json()).then(setConfig).catch(() => setError("The sign-in service could not be reached.")); }, []);

  const demoLogin = async () => {
    setBusy(true);
    const response = await fetch("/api/auth/demo", { method: "POST" });
    if (response.ok) router.push("/choose-role");
    else { setBusy(false); setError("Local demo sign-in is unavailable."); }
  };

  const queryError = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("error") : null;
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#ffffff_0,#f5f7f1_42%,#e8eee8_100%)] px-4 py-10 text-[#17332d] sm:px-7">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[#d7e2d9] bg-white shadow-[0_35px_100px_#17332d1a] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative overflow-hidden bg-[#173f34] p-8 text-white sm:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-[#dff0a7]/10" />
          <div className="relative">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-[14px_14px_14px_5px] bg-[#dff0a7] text-[#173f34]"><Mic className="size-5" /></span><span className="text-2xl font-black">BhashaHire</span></div>
            <p className="mt-20 text-xs font-black uppercase tracking-[.16em] text-[#dff0a7]">Voice to opportunity</p>
            <h1 className="mt-4 max-w-lg font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.02] tracking-[-.045em] sm:text-6xl">One trusted workspace for seekers and counsellors.</h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/68">Build an evidence-backed profile, review transparent eligibility, and leave a placement drive with a resume and practical shortlist.</p>
            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {["Verified Google identity", "Role-based workspace", "No automatic applications", "Snapshot-cited opportunities"].map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-3 text-sm font-bold text-white/85"><CheckCircle2 className="size-4 text-[#dff0a7]" />{item}</div>)}
            </div>
          </div>
        </section>
        <section className="flex items-center p-8 sm:p-12 lg:p-16">
          <div className="w-full">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#eaf3df] text-[#196b4f]"><ShieldCheck /></span>
            <h2 className="mt-7 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em]">Welcome to BhashaHire</h2>
            <p className="mt-3 text-[15px] leading-7 text-[#687a72]">Sign in once, then choose whether you are continuing as a job seeker or a counsellor.</p>
            {(error || queryError) && <div className="mt-6 rounded-2xl border border-[#efc9c3] bg-[#fff3f1] p-4 text-sm font-bold text-[#9c3d33]">{error || (queryError === "google_not_configured" ? "Google OAuth is not configured yet. Add the credentials shown in .env.example." : "Google verification could not be completed. Please try again.")}</div>}
            <a href="/api/auth/google" className={`mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#ccd8cf] bg-white px-5 text-base font-black text-[#294b41] shadow-[0_8px_25px_#17332d0b] transition hover:border-[#94b9a5] hover:bg-[#f8fbf8] ${config && !config.googleConfigured ? "opacity-60" : ""}`}><LogIn className="size-5 text-[#4285f4]" />Continue with Google<ArrowRight className="ml-auto size-4" /></a>
            {config?.demoEnabled && <><div className="my-5 flex items-center gap-3 text-xs font-bold text-[#8a9791]"><span className="h-px flex-1 bg-[#e0e6e1]" />LOCAL DEVELOPMENT<span className="h-px flex-1 bg-[#e0e6e1]" /></div><Button disabled={busy} onClick={demoLogin} variant="outline" className="min-h-12 w-full rounded-2xl border-dashed border-[#adc6b4] bg-[#f2f7f2] font-black text-[#196b4f]"><Sparkles />{busy ? "Opening demo…" : "Continue in local demo"}</Button></>}
            <div className="mt-8 flex gap-3 rounded-2xl bg-[#f3f6f2] p-4 text-xs leading-5 text-[#667970]"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-[#196b4f]" /><span>Google confirms your name and email. BhashaHire never receives your Google password and never applies to roles on your behalf.</span></div>
          </div>
        </section>
      </div>
    </main>
  );
}
