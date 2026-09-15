"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BriefcaseBusiness, LoaderCircle, Mic, ShieldCheck, UserRound } from "lucide-react";
import type { AppRole, AuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChooseRolePage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession>();
  const [busy, setBusy] = useState<AppRole>();
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/auth/session", { cache: "no-store" }).then((response) => response.json()).then((result) => { if (!result.session) window.location.replace("/login"); else setSession(result.session); }); }, []);
  const choose = async (role: AppRole) => {
    setBusy(role); setError("");
    const response = await fetch("/api/auth/role", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role }) });
    if (response.ok) router.push("/");
    else { setBusy(undefined); setError("Your role could not be saved. Please try again."); }
  };
  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f3f6f1]"><LoaderCircle className="size-9 animate-spin text-[#196b4f]" /></main>;
  const firstName = session.name.split(" ")[0];
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0,#ffffff_0,#f5f7f2_48%,#e9efe9_100%)] px-4 py-12 text-[#17332d]">
      <div className="mx-auto max-w-5xl">
        <header className="text-center"><div className="mx-auto flex w-fit items-center gap-2.5"><span className="grid size-10 place-items-center rounded-[13px_13px_13px_4px] bg-[#196b4f] text-white"><Mic className="size-5" /></span><span className="text-xl font-black">BhashaHire</span></div><div className="mx-auto mt-10 grid size-16 place-items-center overflow-hidden rounded-full bg-[#e5f2b5] text-xl font-black">{session.picture ? <Image src={session.picture} alt="" width={64} height={64} unoptimized referrerPolicy="no-referrer" className="size-full object-cover" /> : session.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><p className="mt-4 text-sm font-bold text-[#5d766c]">Google account verified · {session.email}</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] sm:text-5xl">How are you using BhashaHire today, {firstName}?</h1><p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#6b7c75]">Choose a workspace. You can return to this screen later from your account menu.</p></header>
        {error && <p className="mx-auto mt-6 max-w-xl rounded-xl bg-[#fff0ed] p-3 text-center text-sm font-bold text-[#a54136]">{error}</p>}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <button onClick={() => choose("user")} disabled={Boolean(busy)} className="group rounded-[28px] border border-[#d4dfd6] bg-white p-7 text-left shadow-[0_18px_55px_#17332d0b] transition hover:-translate-y-1 hover:border-[#8ab69c] hover:shadow-[0_24px_70px_#17332d17] sm:p-9"><span className="grid size-14 place-items-center rounded-2xl bg-[#e5f2b5] text-[#2f653f]"><UserRound className="size-7" /></span><p className="mt-7 text-xs font-black uppercase tracking-[.12em] text-[#5b8172]">Job seeker</p><h2 className="mt-2 text-2xl font-black">Build my career profile</h2><p className="mt-3 min-h-14 text-sm leading-7 text-[#6b7d75]">Record or type your story, check eligibility, create a bilingual resume, and practise for interviews.</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#196b4f]">{busy === "user" ? "Opening workspace…" : "Continue as user"}<ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></button>
          <button onClick={() => choose("counsellor")} disabled={Boolean(busy)} className="group rounded-[28px] border border-[#b8d0c0] bg-[#173f34] p-7 text-left text-white shadow-[0_22px_70px_#17332d22] transition hover:-translate-y-1 hover:border-[#dff0a7] sm:p-9"><span className="grid size-14 place-items-center rounded-2xl bg-[#dff0a7] text-[#244c31]"><ShieldCheck className="size-7" /></span><p className="mt-7 text-xs font-black uppercase tracking-[.12em] text-[#dff0a7]">Counsellor</p><h2 className="mt-2 text-2xl font-black">Review and guide seekers</h2><p className="mt-3 min-h-14 text-sm leading-7 text-white/65">Compare extracted and expected profiles, approve or adjust shortlists, import snapshots, and track pilot metrics.</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#dff0a7]">{busy === "counsellor" ? "Opening dashboard…" : "Continue as counsellor"}<BriefcaseBusiness className="size-4 transition group-hover:translate-x-1" /></span></button>
        </div>
      </div>
    </main>
  );
}
