"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, BriefcaseBusiness, Check, ChevronDown, Edit3, HelpCircle, Languages, MapPin, Plus, Save, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AppLanguage, CandidateProfile } from "@/lib/product-types";
import { PageTitle } from "@/components/bhasha/shared";

export function ProfileScreen({ language, profile, onProfileChange, onContinue }: { language: AppLanguage; profile: CandidateProfile; onProfileChange: (profile: CandidateProfile) => void; onContinue: () => void }) {
  const hi = language === "hi";
  const [editing, setEditing] = useState(false);
  const [clarified, setClarified] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(profile.skills[0]?.name ?? null);
  const [newSkill, setNewSkill] = useState("");
  const update = <K extends keyof CandidateProfile>(key: K, value: CandidateProfile[K]) => onProfileChange({ ...profile, [key]: value });

  const answerClarification = (answer: string) => {
    if (answer === "Both household and three-phase" && !profile.skills.some((skill) => skill.name === "Three-phase systems")) {
      onProfileChange({ ...profile, skills: [...profile.skills, { name: "Three-phase systems", evidence: "Added from your clarification answer.", confidence: 82 }], practicalExperience: `${profile.practicalExperience}; basic three-phase system exposure` });
    }
    setClarified(true);
  };

  const addSkill = () => {
    const name = newSkill.trim();
    if (!name || profile.skills.some((skill) => skill.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return;
    onProfileChange({ ...profile, skills: [...profile.skills, { name, evidence: "Added by you during profile review.", confidence: 100 }] });
    setNewSkill("");
    setExpandedSkill(name);
  };

  const fields = [
    { key: "education" as const, icon: BookOpen, label: hi ? "पढ़ाई" : "Education", note: "From your voice note" },
    { key: "certification" as const, icon: ShieldCheck, label: hi ? "सर्टिफिकेट" : "Certification", note: "Certificate name normalised" },
    { key: "practicalExperience" as const, icon: Wrench, label: hi ? "व्यावहारिक / अनौपचारिक अनुभव" : "Practical / informal experience", note: "Kept separate from formal employment" },
    { key: "availability" as const, icon: BriefcaseBusiness, label: hi ? "उपलब्धता" : "Availability", note: "When you can start" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1260px] px-4 pb-28 pt-8 sm:px-7 lg:px-12 lg:pt-10">
      <PageTitle eyebrow={hi ? "कदम 2 / 4 · अपनी जानकारी जाँचें" : "Step 2 of 4 · Review what we heard"} title={hi ? "आपका करियर पासपोर्ट" : "Your career passport"} description={hi ? "यही जानकारी अवसरों की पात्रता जाँचने और आपका रिज़्यूमे बनाने में उपयोग होगी। हर चीज़ बदली जा सकती है।" : "This is what we’ll use to check eligibility and build your resume. You can edit everything."} action={<Button onClick={() => setEditing((value) => !value)} variant={editing ? "default" : "outline"} className={`min-h-11 rounded-xl px-4 font-black ${editing ? "bg-[#196b4f]" : "border-[#cad8cd] bg-white text-[#294b41]"}`}>{editing ? <Save /> : <Edit3 />}{editing ? (hi ? "बदलाव सेव करें" : "Save changes") : (hi ? "प्रोफ़ाइल बदलें" : "Edit profile")}</Button>} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,.6fr)]">
        <section className="overflow-hidden rounded-[28px] border border-[#d7e1d8] bg-white shadow-[0_20px_60px_#29483d0c]">
          <div className="relative overflow-hidden bg-[#173f34] p-6 text-white sm:p-8">
            <div className="absolute -right-8 -top-12 size-48 rounded-full border-[30px] border-white/5" /><div className="absolute -bottom-16 right-28 size-32 rounded-full border-[24px] border-[#dff0a7]/10" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center"><span className="grid size-20 shrink-0 place-items-center rounded-[24px] bg-[#dff0a7] text-2xl font-black text-[#274b34] shadow-xl">{profile.initials}</span><div className="min-w-0"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/75"><Sparkles className="size-3" />{hi ? "आवाज़ से तैयार" : "Created from your voice"}</span>{editing ? <Input value={profile.name} onChange={(event) => update("name", event.target.value)} className="mt-2 h-12 max-w-md border-white/30 bg-white/10 text-xl font-black text-white" /> : <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h2>}<p className="mt-2 flex items-center gap-2 text-sm text-white/70"><MapPin className="size-4" />{profile.location}</p></div><span className="sm:ml-auto inline-flex w-fit items-center gap-2 rounded-xl bg-[#dff0a7] px-3 py-2 text-xs font-black text-[#355426]"><Check className="size-4" />{hi ? "92% भरोसा" : "92% confidence"}</span></div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
            {fields.map((field) => { const Icon = field.icon; return <div key={field.key} className={`rounded-2xl border p-4 ${field.key === "practicalExperience" ? "sm:col-span-2" : ""} border-[#dde5de] bg-[#fbfcfa]`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f1ea] text-[#196b4f]"><Icon className="size-5" /></span><div><p className="text-xs font-black uppercase tracking-[.08em] text-[#6b7f77]">{field.label}</p><p className="mt-0.5 text-[11px] text-[#93a099]">{field.note}</p></div></div>{editing ? <Input value={String(profile[field.key])} onChange={(event) => update(field.key, event.target.value)} className="mt-3 h-11 rounded-xl border-[#ccd8cf] bg-white" /> : <p className="mt-3 text-[15px] font-extrabold leading-6 text-[#29483e]">{profile[field.key]}</p>}</div>; })}
            <div className="rounded-2xl border border-[#dde5de] bg-[#fbfcfa] p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f1ea] text-[#196b4f]"><Languages className="size-5" /></span><p className="text-xs font-black uppercase tracking-[.08em] text-[#6b7f77]">{hi ? "भाषाएँ" : "Languages"}</p></div><div className="mt-3 flex flex-wrap gap-2">{profile.languages.map((item) => <span key={item} className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-[#3d5a50] ring-1 ring-[#dbe4dc]">{item}</span>)}</div></div>
            <div className="rounded-2xl border border-[#dde5de] bg-[#fbfcfa] p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#e8f1ea] text-[#196b4f]"><BriefcaseBusiness className="size-5" /></span><p className="text-xs font-black uppercase tracking-[.08em] text-[#6b7f77]">{hi ? "पसंद के काम" : "Preferred roles"}</p></div><p className="mt-3 text-sm font-bold leading-6 text-[#365148]">{profile.preferredRoles.join(" · ")}</p></div>
          </div>
        </section>

        <aside className="space-y-5">
          {!clarified ? <section className="rounded-[24px] border border-[#ead9a9] bg-[#fff8e5] p-5 shadow-[0_12px_35px_#795b1d0c]"><span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.1em] text-[#88691d]"><HelpCircle className="size-4" />{hi ? "एक छोटा सवाल" : "One quick question"}</span><h3 className="mt-3 text-lg font-black leading-7 text-[#493e24]">{hi ? profile.clarification.questionHi : profile.clarification.question}</h3><div className="mt-4 grid gap-2">{profile.clarification.options.map((option) => <button key={option} onClick={() => answerClarification(option)} className="min-h-11 rounded-xl border border-[#e4d5ac] bg-white px-3 text-left text-xs font-bold text-[#65542c] transition hover:border-[#bfa460] hover:bg-[#fffdf8]">{option}</button>)}</div></section> : <section className="rounded-[24px] border border-[#bfd6c4] bg-[#edf6ef] p-5"><span className="grid size-9 place-items-center rounded-full bg-[#196b4f] text-white"><Check className="size-5" /></span><h3 className="mt-3 font-black">{hi ? "जवाब प्रोफ़ाइल में जोड़ दिया" : "Answer added to your profile"}</h3><p className="mt-1 text-sm leading-6 text-[#63766e]">{hi ? "अब matching में यह नई जानकारी भी उपयोग होगी।" : "This new evidence will now be used in matching."}</p></section>}

          <section className="rounded-[24px] border border-[#d9e3da] bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.1em] text-[#5d8173]">{hi ? "हमने ये हुनर पाए" : "Skills we found"}</p><h3 className="mt-1 font-black">{profile.skills.length} {hi ? "हुनर · सबूत सहित" : "skills · with evidence"}</h3></div><Wrench className="size-5 text-[#196b4f]" /></div><div className="space-y-2">{profile.skills.map((skill) => { const open = expandedSkill === skill.name; return <button key={skill.name} onClick={() => setExpandedSkill(open ? null : skill.name)} className="w-full rounded-xl border border-[#e1e7e2] bg-[#fafbf9] p-3 text-left"><div className="flex items-center gap-2"><Check className="size-4 text-[#4e9145]" /><strong className="flex-1 text-sm text-[#304e43]">{skill.name}</strong><span className="text-[11px] font-bold text-[#668077]">{skill.confidence}%</span><ChevronDown className={`size-4 text-[#83918b] transition ${open ? "rotate-180" : ""}`} /></div>{open && <p className="mt-2 border-t border-[#e6ebe6] pt-2 text-xs leading-5 text-[#718078]"><strong className="text-[#4d675e]">Evidence:</strong> {skill.evidence}</p>}</button>; })}</div>{editing && <div className="mt-3 flex gap-2"><Input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addSkill(); }} placeholder={hi ? "नया हुनर" : "New skill"} aria-label={hi ? "नया हुनर" : "New skill"} className="h-11 rounded-xl border-[#cbd8ce]" /><Button type="button" disabled={!newSkill.trim()} onClick={addSkill} variant="outline" className="min-h-11 rounded-xl border-dashed border-[#b8cbbd] text-[#196b4f]"><Plus />{hi ? "जोड़ें" : "Add"}</Button></div>}</section>
        </aside>
      </div>

      <div className="sticky bottom-[64px] z-30 mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#d5dfd6] bg-white/95 p-3 shadow-[0_16px_50px_#17332d18] backdrop-blur-xl sm:flex-row lg:bottom-4"><div className="flex items-center gap-3 px-2"><span className="grid size-9 place-items-center rounded-full bg-[#e5f2b5] text-[#355526]"><Check className="size-5" /></span><span><strong className="block text-sm">{hi ? "यह जानकारी सही है?" : "Does everything look right?"}</strong><small className="text-xs text-[#75837e]">{hi ? "अगले कदम में हम पात्रता जाँचेंगे।" : "Next, we’ll check your eligibility."}</small></span></div><Button onClick={onContinue} className="min-h-12 w-full rounded-xl bg-[#196b4f] px-6 font-black sm:w-auto">{hi ? "हाँ, सही अवसर दिखाएँ" : "Everything looks right"}<ArrowRight /></Button></div>
    </div>
  );
}
