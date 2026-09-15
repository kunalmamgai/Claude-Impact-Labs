"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Check, ClipboardCheck, CloudUpload, Download, FileText, MapPin, Pencil, RefreshCw, ShieldCheck, Timer, UserRoundCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMatches } from "@/lib/matching";
import type { AppLanguage, CandidateProfile, OpportunityMatch } from "@/lib/product-types";
import { SourceCitation } from "@/components/bhasha/shared";

type Decision = "pending" | "approved" | "rejected";
const same = (left: unknown, right: unknown) => JSON.stringify(left).toLowerCase() === JSON.stringify(right).toLowerCase();

export function CounsellorScreen({ language, profile, expectedProfile, matches, onMatchesChange, sessionStartedAt, onBack, onResume }: {
  language: AppLanguage;
  profile: CandidateProfile;
  expectedProfile: CandidateProfile;
  matches: OpportunityMatch[];
  onMatchesChange: (matches: OpportunityMatch[]) => void;
  sessionStartedAt: number;
  onBack: () => void;
  onResume: () => void;
}) {
  const hi = language === "hi";
  const fileInput = useRef<HTMLInputElement>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [editing, setEditing] = useState<string>();
  const [snapshotType, setSnapshotType] = useState<"opportunities" | "courses">("opportunities");
  const [importStatus, setImportStatus] = useState("");
  const [importing, setImporting] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(1);
  useEffect(() => {
    const update = () => setElapsedMinutes(Math.max(1, Math.round((Date.now() - sessionStartedAt) / 60_000)));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, [sessionStartedAt]);

  const keyFieldMatch = useMemo(() => {
    const fields: (keyof CandidateProfile)[] = ["name", "location", "education", "certification", "experienceMonths", "skills"];
    return Math.round(fields.filter((field) => same(profile[field], expectedProfile[field])).length / fields.length * 100);
  }, [expectedProfile, profile]);
  const shortlistOverlap = useMemo(() => {
    const expectedIds = new Set(getMatches(expectedProfile).filter((item) => item.eligible).map((item) => item.opportunity.sourceRowId));
    const systemIds = matches.filter((item) => item.eligible).map((item) => item.opportunity.sourceRowId);
    if (!systemIds.length && !expectedIds.size) return 100;
    return Math.round(systemIds.filter((id) => expectedIds.has(id)).length / Math.max(1, new Set([...systemIds, ...expectedIds]).size) * 100);
  }, [expectedProfile, matches]);
  const approved = Object.values(decisions).filter((item) => item === "approved").length;

  const decide = (id: string, decision: Decision) => setDecisions((current) => ({ ...current, [id]: decision }));
  const move = (index: number, offset: number) => {
    const next = [...matches]; const target = index + offset;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onMatchesChange(next);
  };
  const importCsv = async (file?: File) => {
    if (!file) return;
    setImporting(true); setImportStatus("");
    const form = new FormData(); form.append("file", file); form.append("type", snapshotType);
    const response = await fetch("/api/admin/import-csv", { method: "POST", body: form });
    const result = await response.json() as { rows_imported?: number; type?: string; error?: string };
    if (response.ok && result.rows_imported !== undefined && result.type) setImportStatus(`${result.rows_imported} ${result.type} rows imported. New matches will use this snapshot.`);
    else setImportStatus(result.error || "Import failed");
    setImporting(false); if (fileInput.current) fileInput.current.value = "";
  };
  const fields = [
    { label: "Name", extracted: profile.name, expected: expectedProfile.name },
    { label: "Location", extracted: profile.location, expected: expectedProfile.location },
    { label: "Education", extracted: profile.education, expected: expectedProfile.education },
    { label: "Certification", extracted: profile.certification, expected: expectedProfile.certification },
    { label: "Experience", extracted: `${profile.experienceMonths} months`, expected: `${expectedProfile.experienceMonths} months` },
    { label: "Skills", extracted: profile.skills.map((item) => item.name).join(", "), expected: expectedProfile.skills.map((item) => item.name).join(", ") },
  ];

  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 pb-28 pt-7 sm:px-7 lg:px-12 lg:pt-9">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div><button onClick={onBack} className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-extrabold text-[#557067] hover:bg-[#e9f1ea]"><ArrowLeft className="size-4" />{hi ? "उम्मीदवार view" : "Candidate view"}</button><p className="text-xs font-black uppercase tracking-[.12em] text-[#5c8173]">Placement drive · counsellor control desk</p><h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] sm:text-5xl">{hi ? "समीक्षा करें। भरोसा रखें। जरूरत पर बदलें।" : "Review, trust, and override."}</h1><p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#687a72]">{hi ? "System की extraction और shortlist सामने है—अंतिम फैसला काउंसलर का है।" : "The system shows its extraction and shortlist; the counsellor keeps the final judgment."}</p></div>
        <div className="flex flex-wrap gap-2"><Button onClick={() => window.print()} variant="outline" className="min-h-11 rounded-xl border-[#cad8cd] bg-white font-black text-[#294b41]"><Download />Print handoff</Button><Button onClick={onResume} className="min-h-11 rounded-xl bg-[#196b4f] font-black"><FileText />View resume</Button></div>
      </div>

      <section className="mb-5 overflow-hidden rounded-[28px] border border-[#d8e2d9] bg-white shadow-[0_18px_60px_#203e340b]">
        <div className="grid gap-6 bg-[#173f34] p-6 text-white sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8"><span className="grid size-20 place-items-center rounded-[24px] bg-[#dff0a7] text-2xl font-black text-[#305223]">{profile.initials}</span><div><p className="text-xs font-black uppercase tracking-[.1em] text-white/55">Active candidate</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">{profile.name}</h2><p className="mt-2 flex items-center gap-2 text-sm text-white/70"><MapPin className="size-4" />{profile.location}</p></div><div className="rounded-2xl bg-white/10 p-4"><span className="flex items-center gap-2 text-sm font-black"><ShieldCheck className="size-5 text-[#dff0a7]" />Counsellor override enabled</span><p className="mt-1 text-xs text-white/60">Session only · no automatic application</p></div></div>
        <div className="grid gap-px bg-[#dde5de] sm:grid-cols-4">
          {[{ icon: UserRoundCheck, label: "Key fields matching", value: `${keyFieldMatch}%` }, { icon: ClipboardCheck, label: "Shortlist overlap", value: `${shortlistOverlap}%` }, { icon: Timer, label: "Average time to complete", value: `${elapsedMinutes} min` }, { icon: Check, label: "Counsellor approvals", value: `${approved} / ${matches.length}` }].map((item) => { const Icon = item.icon; return <div key={item.label} className="bg-white p-5"><span className="flex items-center gap-2 text-xs font-black uppercase tracking-[.07em] text-[#6d8078]"><Icon className="size-4 text-[#196b4f]" />{item.label}</span><p className="mt-2 text-2xl font-black text-[#24463a]">{item.value}</p></div>; })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <div className="space-y-5">
          <section className="rounded-[26px] border border-[#d9e2da] bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.1em] text-[#5d8173]">Pilot evaluation</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">Extracted vs expected profile</h2></div><span className={`rounded-full px-3 py-1 text-xs font-black ${keyFieldMatch >= 80 ? "bg-[#e4f2dd] text-[#3d7736]" : "bg-[#fff0ce] text-[#8b651b]"}`}>{keyFieldMatch}% match</span></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[560px] border-separate border-spacing-0 text-left text-sm"><thead><tr className="text-[11px] font-black uppercase tracking-[.08em] text-[#788981]"><th className="border-b border-[#dce4dd] py-3 pr-3">Field</th><th className="border-b border-[#dce4dd] px-3 py-3">Extracted profile</th><th className="border-b border-[#dce4dd] px-3 py-3">Expected profile</th><th className="border-b border-[#dce4dd] py-3 pl-3">Status</th></tr></thead><tbody>{fields.map((field) => { const match = same(field.extracted, field.expected); return <tr key={field.label} className="align-top"><th className="border-b border-[#edf0ed] py-3 pr-3 text-xs font-black text-[#365148]">{field.label}</th><td className="border-b border-[#edf0ed] px-3 py-3 text-xs leading-5 text-[#60736b]">{field.extracted}</td><td className="border-b border-[#edf0ed] px-3 py-3 text-xs leading-5 text-[#60736b]">{field.expected}</td><td className="border-b border-[#edf0ed] py-3 pl-3">{match ? <span className="inline-flex items-center gap-1 rounded-lg bg-[#e7f4e1] px-2 py-1 text-[11px] font-black text-[#3f7a38]"><Check className="size-3" />Match</span> : <span className="inline-flex items-center gap-1 rounded-lg bg-[#fff0ce] px-2 py-1 text-[11px] font-black text-[#8a651d]">Review</span>}</td></tr>; })}</tbody></table></div>
          </section>

          <section className="rounded-[26px] border border-[#d9e2da] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.1em] text-[#5d8173]">Snapshot administration</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">Upload a new CSV snapshot</h2><p className="mt-2 text-xs leading-5 text-[#6d7f77]">Headers and row types are validated before the active snapshot changes.</p></div><CloudUpload className="size-6 text-[#196b4f]" /></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"><select value={snapshotType} onChange={(event) => setSnapshotType(event.target.value as typeof snapshotType)} className="min-h-12 rounded-xl border border-[#ced9d0] bg-[#f8faf7] px-4 text-sm font-black text-[#345148]"><option value="opportunities">Opportunities CSV</option><option value="courses">Courses CSV</option></select><Button disabled={importing} onClick={() => fileInput.current?.click()} variant="outline" className="min-h-12 rounded-xl border-dashed border-[#9fbdaa] bg-[#edf5ef] font-black text-[#196b4f]"><RefreshCw className={importing ? "animate-spin" : ""} />{importing ? "Validating…" : "Choose CSV"}</Button><input ref={fileInput} className="hidden" type="file" accept=".csv,text/csv" onChange={(event) => importCsv(event.target.files?.[0])} /></div>
            {importStatus && <p className={`mt-3 rounded-xl p-3 text-xs font-bold ${importStatus.includes("imported") ? "bg-[#edf6ef] text-[#3f704a]" : "bg-[#fff0ed] text-[#9e4338]"}`}>{importStatus}</p>}
          </section>
        </div>

        <section className="rounded-[26px] border border-[#d9e2da] bg-white p-5 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.1em] text-[#5d8173]">System shortlist · counsellor controlled</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">Approve, edit, or reject</h2></div><span className="text-xs font-bold text-[#71817b]">Eligible first · relevance score next</span></div>
          <div className="space-y-3">{matches.slice(0, 8).map((match, index) => { const id = match.opportunity.id; const decision = decisions[id] || "pending"; const edit = editing === id; return <article key={id} className={`rounded-2xl border p-4 transition ${decision === "approved" ? "border-[#a9c9ad] bg-[#f1f8ef]" : decision === "rejected" ? "border-[#e6cbc5] bg-[#fff6f4] opacity-70" : "border-[#e0e6e1] bg-[#fafbf9]"}`}><div className="flex items-start gap-3"><span className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-black ${match.eligible ? "bg-[#dff0a7] text-[#315d33]" : "bg-[#fff0ce] text-[#8a651d]"}`}>{match.relevanceScore}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[#28483d]">{match.opportunity.title}</strong><span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${match.eligible ? "bg-[#e1f1db] text-[#3d7736]" : "bg-[#fff0ce] text-[#8a651d]"}`}>{match.eligible ? "Eligible" : "Near match"}</span>{decision !== "pending" && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase text-[#5e7169] ring-1 ring-[#dce4dd]">{decision}</span>}</div><span className="mt-1 block text-xs text-[#71817b]">{match.opportunity.organisation} · {match.opportunity.location}</span><div className="mt-2"><SourceCitation name={match.opportunity.sourceName} rowId={match.opportunity.sourceRowId} /></div></div></div>
            {match.requirements[0] && <p className="mt-3 rounded-xl bg-white/75 p-3 text-xs leading-5 text-[#66776f]">{match.requirements[0].reason}</p>}
            <div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => decide(id, "approved")} size="sm" className="rounded-lg bg-[#196b4f] font-black"><Check />Approve</Button><Button onClick={() => setEditing(edit ? undefined : id)} size="sm" variant="outline" className="rounded-lg border-[#cad8cd] font-black text-[#39594e]"><Pencil />Edit</Button><Button onClick={() => decide(id, decision === "rejected" ? "pending" : "rejected")} size="sm" variant="ghost" className="rounded-lg font-black text-[#a54a3e]"><X />{decision === "rejected" ? "Undo reject" : "Reject"}</Button></div>
            {edit && <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-[#b9cbbd] bg-white p-3"><span className="mr-auto text-xs font-bold text-[#5e7269]">Adjust shortlist position</span><Button onClick={() => move(index, -1)} disabled={index === 0} size="icon" variant="outline" className="size-9 rounded-lg" aria-label="Move up"><ArrowUp /></Button><Button onClick={() => move(index, 1)} disabled={index === matches.length - 1} size="icon" variant="outline" className="size-9 rounded-lg" aria-label="Move down"><ArrowDown /></Button></div>}
          </article>; })}</div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#ead9a9] bg-[#fff8e5] p-4 text-xs leading-5 text-[#725b29]"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><span><strong className="block">Human decision remains authoritative.</strong>Approving or rejecting changes the session shortlist only. It never applies to a role or changes the source listing.</span></div>
        </section>
      </div>
    </div>
  );
}
