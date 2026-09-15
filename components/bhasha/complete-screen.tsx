"use client";

import { useState } from "react";
import { ArrowRight, BriefcaseBusiness, Check, ClipboardCheck, Download, FileText, GraduationCap, Share2, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage, CandidateProfile, OpportunityMatch } from "@/lib/product-types";

export function CompleteScreen({ language, profile, matches, onMatches, onResume, onInterview, onCounsellor }: { language: AppLanguage; profile: CandidateProfile; matches: OpportunityMatch[]; onMatches: () => void; onResume: () => void; onInterview: () => void; onCounsellor: () => void }) {
  const hi = language === "hi";
  const [shared, setShared] = useState(false);
  const eligible = matches.filter((item) => item.eligible);

  const share = async () => {
    const text = `BhashaHire job-ready pack for ${profile.name}\n✓ Career profile\n✓ ${eligible.length} eligible opportunities\n✓ Resume ready\n✓ Interview preparation ready`;
    try { if (navigator.share) await navigator.share({ title: "My BhashaHire summary", text }); else await navigator.clipboard.writeText(text); setShared(true); window.setTimeout(() => setShared(false), 1500); } catch { /* cancelled */ }
  };

  const items = [
    { icon: UserRound, en: "Career profile reviewed", hi: "करियर प्रोफ़ाइल जाँची", note: `${profile.skills.length} skills with evidence`, action: onCounsellor },
    { icon: BriefcaseBusiness, en: `${eligible.length} eligible opportunities`, hi: `${eligible.length} पात्र अवसर`, note: "Every match cites a source row", action: onMatches },
    { icon: ClipboardCheck, en: "Qualification gaps explained", hi: "योग्यता की कमी समझाई", note: "Courses shown without job promises", action: onMatches },
    { icon: FileText, en: "Bilingual resume ready", hi: "दो भाषाओं में रिज़्यूमे तैयार", note: "One-page printable format", action: onResume },
    { icon: GraduationCap, en: "Interview practice ready", hi: "इंटरव्यू तैयारी तैयार", note: "5 tailored questions and answers", action: onInterview },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-6xl items-center px-4 pb-28 pt-8 sm:px-7 lg:px-12">
      <section className="w-full overflow-hidden rounded-[34px] border border-[#d7e1d8] bg-white shadow-[0_35px_100px_#1b3b3017]">
        <div className="relative overflow-hidden bg-[#173f34] px-6 py-10 text-center text-white sm:px-10 sm:py-14"><div className="absolute left-[-70px] top-[-90px] size-64 rounded-full border-[45px] border-white/5" /><div className="absolute bottom-[-120px] right-[-70px] size-80 rounded-full border-[55px] border-[#dff0a7]/10" /><div className="relative"><span className="mx-auto grid size-20 place-items-center rounded-[26px] bg-[#dff0a7] text-[#315223] shadow-xl"><Check className="size-10" strokeWidth={3} /></span><p className="mt-6 text-xs font-black uppercase tracking-[.14em] text-[#dff0a7]">{hi ? "आपका job-ready pack तैयार है" : "Your job-ready pack is complete"}</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.045em] sm:text-6xl">{hi ? "अब अगला कदम आपके हाथ में है।" : "You’re ready for the next step."}</h1><p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/70">{hi ? `${profile.name}, आपकी अपनी बातों से profile, पात्र अवसर, resume और interview तैयारी तैयार हो गई है। कोई आवेदन अपने-आप नहीं किया गया।` : `${profile.name}, your own story is now a profile, an eligibility-checked shortlist, a resume and interview preparation. Nothing has been applied for automatically.`}</p></div></div>
        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_310px] lg:p-10">
          <div><h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold">{hi ? "आपके pack में" : "Inside your pack"}</h2><div className="grid gap-3 sm:grid-cols-2">{items.map((item) => { const Icon = item.icon; return <button key={item.en} onClick={item.action} className="group flex min-h-24 items-center gap-4 rounded-2xl border border-[#dce4dd] bg-[#fafbf9] p-4 text-left transition hover:border-[#b7cdbb] hover:bg-[#f3f7f3]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e4f0e4] text-[#196b4f]"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm text-[#2c4a40]">{hi ? item.hi : item.en}</strong><small className="mt-1 block text-xs leading-5 text-[#7a8882]">{item.note}</small></span><ArrowRight className="size-4 text-[#82918b] transition group-hover:translate-x-1" /></button>; })}</div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button onClick={onMatches} className="min-h-12 rounded-xl bg-[#196b4f] px-5 font-black"><BriefcaseBusiness />{hi ? "अवसर देखें" : "View opportunities"}</Button><Button onClick={onResume} variant="outline" className="min-h-12 rounded-xl border-[#cbd8cd] bg-white px-5 font-black text-[#294b41]"><Download />{hi ? "रिज़्यूमे डाउनलोड" : "Download resume"}</Button><Button onClick={onInterview} variant="outline" className="min-h-12 rounded-xl border-[#cbd8cd] bg-white px-5 font-black text-[#294b41]"><GraduationCap />{hi ? "इंटरव्यू अभ्यास" : "Interview practice"}</Button></div></div>
          <aside className="rounded-[26px] border border-[#ead8aa] bg-[#fff8e6] p-5"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-[#f4d572] text-[#5a461a]"><Sparkles /></span><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-[#7a6330]">WhatsApp-sized</span></div><h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-[#4f4123]">{hi ? "अपनी progress शेयर करें" : "Share your progress"}</h3><p className="mt-2 text-sm leading-6 text-[#79673f]">{hi ? "अपना छोटा summary परिवार, counsellor या mentor को भेजें। कोई WhatsApp account connect नहीं होगा।" : "Send a compact summary to family, a counsellor or mentor. No WhatsApp account is connected."}</p><div className="mt-4 rounded-2xl bg-white p-4 text-sm text-[#435a51] shadow-sm"><strong className="block">{profile.name}</strong><span className="mt-1 block text-xs text-[#7b8983]">{profile.certification}</span><div className="mt-3 space-y-2 text-xs"><p>✓ {eligible.length} {hi ? "पात्र अवसर" : "eligible opportunities"}</p><p>✓ {hi ? "रिज़्यूमे तैयार" : "Resume ready"}</p><p>✓ {hi ? "इंटरव्यू तैयारी तैयार" : "Interview prep ready"}</p></div></div><Button onClick={share} className="mt-4 min-h-12 w-full rounded-xl bg-[#6f8f36] font-black hover:bg-[#607e2f]">{shared ? <Check /> : <Share2 />}{shared ? (hi ? "Summary कॉपी हुआ" : "Summary copied") : (hi ? "Summary शेयर करें" : "Share summary")}</Button></aside>
        </div>
      </section>
    </div>
  );
}
