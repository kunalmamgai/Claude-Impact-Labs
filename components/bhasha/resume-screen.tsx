"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Download, FileText, GraduationCap, Languages, MapPin, Phone, Share2, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppLanguage, CandidateProfile } from "@/lib/product-types";
import { candidateToUserProfile } from "@/lib/backend-client";
import { apiUrl } from "@/lib/api-url";

type ResumeLanguage = "bilingual" | "english" | "hindi";

export function ResumeScreen({ language, profile, onBack, onInterview, onComplete }: { language: AppLanguage; profile: CandidateProfile; onBack: () => void; onInterview: () => void; onComplete: () => void }) {
  const hi = language === "hi";
  const [resumeLanguage, setResumeLanguage] = useState<ResumeLanguage>("bilingual");
  const [shared, setShared] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const showEnglish = resumeLanguage !== "hindi";
  const showHindi = resumeLanguage !== "english";
  const experienceTitle = profile.trade === "office" ? "Community records support" : profile.trade === "fitter" ? "Supervised workshop practice" : "Community & household electrical practice";
  const experienceTitleHi = profile.trade === "office" ? "समुदाय में रिकॉर्ड रखने का अभ्यास" : profile.trade === "fitter" ? "निगरानी में वर्कशॉप अभ्यास" : "घर और समुदाय में इलेक्ट्रिकल अभ्यास";

  const share = async () => {
    const text = `${profile.name} — ${profile.certification}\n${profile.location}\n${profile.summary}`;
    try {
      if (navigator.share) await navigator.share({ title: `${profile.name} — BhashaHire resume`, text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch { /* User cancelled share. */ }
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const response = await fetch(apiUrl("/api/resume/generate"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ profile: candidateToUserProfile(profile), language: resumeLanguage }) });
      if (!response.ok) throw new Error("PDF generation failed");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = url; link.download = `${profile.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-resume.pdf`; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    } catch { window.print(); }
    finally { setDownloading(false); }
  };

  return (
    <div className="mx-auto w-full max-w-[1420px] px-4 pb-28 pt-7 sm:px-7 lg:px-12 lg:pt-9">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3"><button onClick={onBack} className="inline-flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-extrabold text-[#557067] hover:bg-[#e9f1ea]"><ArrowLeft className="size-4" />{hi ? "वापस" : "Back"}</button><div className="flex flex-wrap gap-2"><Button onClick={share} variant="outline" className="min-h-11 rounded-xl border-[#cad8cd] bg-white font-black text-[#294b41]">{shared ? <Check /> : <Share2 />}{shared ? (hi ? "कॉपी हो गया" : "Copied") : (hi ? "शेयर करें" : "Share")}</Button><Button disabled={downloading} onClick={downloadPdf} className="min-h-11 rounded-xl bg-[#196b4f] px-5 font-black"><Download />{downloading ? (hi ? "PDF बन रहा है…" : "Generating PDF…") : (hi ? "PDF डाउनलोड" : "Download PDF")}</Button></div></div>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.11em] text-[#5c8173]">{hi ? "कदम 4 / 4 · आपका रिज़्यूमे" : "Step 4 of 4 · Your resume"}</p><div className="mt-3 flex w-fit items-center gap-2 rounded-xl border border-[#d5e1d7] bg-white px-3 py-2 text-xs font-black text-[#466258]"><UserRound className="size-4 text-[#196b4f]" />{hi ? "करियर पासपोर्ट" : "Career passport"}<ArrowRight className="size-3.5 text-[#8a9993]" /><FileText className="size-4 text-[#196b4f]" />{hi ? "जॉब-रेडी रिज़्यूमे" : "Job-ready resume"}</div><h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] sm:text-5xl">{hi ? "एक पेज। दो भाषाएँ। आपकी सच्ची कहानी।" : "One page. Two languages. Your real story."}</h1><p className="mt-3 text-[15px] leading-7 text-[#687a72]">{hi ? "अनौपचारिक काम को हमने ईमानदारी से practical experience लिखा है—पेशेवर नौकरी नहीं।" : "Your informal work is honestly presented as practical experience—not invented employment."}</p></div><Tabs value={resumeLanguage} onValueChange={(value) => setResumeLanguage(value as ResumeLanguage)}><TabsList className="h-auto rounded-xl bg-[#e8eee9] p-1"><TabsTrigger value="bilingual" className="min-h-10 rounded-lg px-3 font-black data-[state=active]:bg-white">EN + हिं</TabsTrigger><TabsTrigger value="english" className="min-h-10 rounded-lg px-3 font-black data-[state=active]:bg-white">English</TabsTrigger><TabsTrigger value="hindi" className="min-h-10 rounded-lg px-3 font-black data-[state=active]:bg-white">हिन्दी</TabsTrigger></TabsList></Tabs></div>

      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="no-print space-y-4">
          <div className="rounded-3xl border border-[#d9e2da] bg-white p-5"><h2 className="flex items-center gap-2 font-black"><FileText className="size-5 text-[#196b4f]" />{hi ? "रिज़्यूमे तैयार" : "Resume ready"}</h2><div className="mt-5 space-y-4">{[{ label: hi ? "एक पेज" : "One-page format", done: true }, { label: hi ? "Partner-friendly layout" : "Partner-friendly layout", done: true }, { label: hi ? "सिर्फ सत्यापित जानकारी" : "Only verified details", done: true }, { label: hi ? "प्रिंट और messaging के लिए" : "Print & messaging ready", done: true }].map((item) => <div key={item.label} className="flex items-center gap-2 text-sm font-bold text-[#4a645a]"><span className="grid size-6 place-items-center rounded-full bg-[#e1f0d8] text-[#43803c]"><Check className="size-4" /></span>{item.label}</div>)}</div></div>
          <div className="rounded-3xl border border-[#ead7aa] bg-[#fff8e6] p-5"><h3 className="flex items-center gap-2 font-black text-[#5e4c26]"><Sparkles className="size-5" />{hi ? "ईमानदार प्रस्तुति" : "Honest positioning"}</h3><p className="mt-2 text-sm leading-6 text-[#78663c]">{hi ? "हमने अनुभव बढ़ा-चढ़ाकर नहीं लिखा। Recruiter समझ पाएगा कि काम व्यावहारिक था, औपचारिक नौकरी नहीं।" : "We haven’t exaggerated experience. Recruiters can see that this was practical exposure, not a formal job."}</p></div>
          <Button onClick={onInterview} variant="outline" className="min-h-12 w-full rounded-xl border-[#aac7b2] bg-[#edf5ef] font-black text-[#196b4f]"><BriefcaseBusiness />{hi ? "इंटरव्यू तैयारी खोलें" : "Open interview prep"}</Button>
        </aside>

        <div className="resume-scroll overflow-x-auto rounded-[28px] bg-[#e6ebe6] p-3 sm:p-6">
          <article id="resume-document" className="resume-paper mx-auto min-h-[990px] w-full max-w-[850px] bg-white p-7 text-[#263c35] shadow-[0_20px_55px_#19382e1b] sm:p-10">
            <header className="flex flex-col gap-5 border-b-4 border-[#196b4f] pb-6 sm:flex-row sm:items-center"><span className="grid size-20 shrink-0 place-items-center rounded-[22px] bg-[#173f34] text-2xl font-black text-white">{profile.initials}</span><div className="min-w-0 flex-1"><h2 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] text-[#17332d]">{profile.name}</h2><p className="mt-1 text-sm font-bold text-[#4c675d]">{profile.certification} · {profile.experienceLabel}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#65776f]"><span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{profile.location}</span><span className="flex items-center gap-1.5"><Phone className="size-3.5" />{profile.phone}</span><span>{profile.email}</span></div></div><span className="rounded-xl bg-[#edf5ef] px-3 py-2 text-xs font-black text-[#196b4f]">{profile.availability}</span></header>

            <div className={`mt-7 grid gap-7 ${resumeLanguage === "bilingual" ? "md:grid-cols-2 md:divide-x md:divide-[#dce5de]" : "grid-cols-1"}`}>
              {showEnglish && <div className={resumeLanguage === "bilingual" ? "md:pr-6" : ""} lang="en"><ResumeColumn title="PROFILE" icon={<Sparkles />}><p>{profile.summary}</p></ResumeColumn><ResumeColumn title="EDUCATION & TRAINING" icon={<GraduationCap />}><strong>{profile.education}</strong><span>{profile.certification}</span></ResumeColumn><ResumeColumn title="PRACTICAL / INFORMAL EXPERIENCE" icon={<BriefcaseBusiness />}><strong>{experienceTitle}</strong><p>{profile.practicalExperience}.</p><small>Evidence source: candidate voice transcript</small></ResumeColumn><ResumeColumn title="SKILLS" icon={<Sparkles />}><div className="flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill.name} className="rounded-lg bg-[#eef4ef] px-2.5 py-1.5 text-xs font-bold text-[#345449]">{skill.name}</span>)}</div></ResumeColumn><ResumeColumn title="LANGUAGES & AVAILABILITY" icon={<Languages />}><p>{profile.languages.join(" · ")}</p><strong>{profile.availability}</strong></ResumeColumn></div>}
              {showHindi && <div className={resumeLanguage === "bilingual" ? "md:pl-6" : ""} lang="hi"><ResumeColumn title="संक्षिप्त परिचय" icon={<Sparkles />}><p>{profile.certification} के साथ {profile.location.split(",")[0]} के उम्मीदवार। {profile.practicalExperience} का व्यावहारिक अनुभव। सुरक्षित तरीके से सीखने और तुरंत काम शुरू करने के लिए तैयार।</p></ResumeColumn><ResumeColumn title="शिक्षा और प्रशिक्षण" icon={<GraduationCap />}><strong>{profile.education}</strong><span>{profile.certification}</span></ResumeColumn><ResumeColumn title="व्यावहारिक / अनौपचारिक अनुभव" icon={<BriefcaseBusiness />}><strong>{experienceTitleHi}</strong><p>{profile.practicalExperience}.</p><small>जानकारी का स्रोत: उम्मीदवार की voice transcript</small></ResumeColumn><ResumeColumn title="हुनर" icon={<Sparkles />}><div className="flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill.name} className="rounded-lg bg-[#eef4ef] px-2.5 py-1.5 text-xs font-bold text-[#345449]">{skill.name}</span>)}</div></ResumeColumn><ResumeColumn title="भाषाएँ और उपलब्धता" icon={<Languages />}><p>{profile.languages.join(" · ")}</p><strong>{profile.availability}</strong></ResumeColumn></div>}
            </div>
            <footer className="mt-8 border-t border-[#dfe6e0] pt-3 text-center text-[10px] text-[#7a8982]">Generated with BhashaHire · Candidate-reviewed information · No experience was invented</footer>
          </article>
        </div>
      </div>
      <div className="no-print mt-6 flex justify-center"><Button onClick={onComplete} className="min-h-12 rounded-xl bg-[#196b4f] px-6 font-black"><Check />{hi ? "मेरा job-ready pack पूरा करें" : "Complete my job-ready pack"}</Button></div>
    </div>
  );
}

function ResumeColumn({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="mb-6 break-inside-avoid"><h3 className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.1em] text-[#196b4f]"><span className="[&_svg]:size-3.5">{icon}</span>{title}</h3><div className="space-y-1.5 text-[13px] leading-6 text-[#40584f] [&_small]:block [&_small]:text-[10px] [&_small]:text-[#7b8a84] [&_span]:block [&_strong]:block [&_strong]:font-extrabold [&_strong]:text-[#2c473e]">{children}</div></section>;
}
