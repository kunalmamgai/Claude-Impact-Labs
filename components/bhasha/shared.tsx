"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileText,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  Mic,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppLanguage, Screen } from "@/lib/product-types";

export const copy = {
  en: {
    start: "Start", profile: "Career passport", matches: "Opportunities", resume: "Resume", prep: "Interview prep", counsellor: "Counsellor view",
  },
  hi: {
    start: "शुरू करें", profile: "करियर पासपोर्ट", matches: "अवसर", resume: "रिज़्यूमे", prep: "इंटरव्यू तैयारी", counsellor: "काउंसलर व्यू",
  },
};

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="BhashaHire">
      <span className="grid size-9 place-items-center rounded-[12px_12px_12px_4px] bg-[#196b4f] text-white shadow-[0_7px_18px_#196b4f33]"><Mic className="size-[18px]" strokeWidth={2.4} /></span>
      {!compact && <span className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold tracking-[-0.02em] text-[#17332d]">Bhasha<span className="text-[#237153]">Hire</span></span>}
    </div>
  );
}

const navItems: { screen: Screen; icon: typeof Mic; key: keyof typeof copy.en }[] = [
  { screen: "welcome", icon: LayoutDashboard, key: "start" },
  { screen: "profile", icon: UserRound, key: "profile" },
  { screen: "matches", icon: BriefcaseBusiness, key: "matches" },
  { screen: "resume", icon: FileText, key: "resume" },
  { screen: "interview", icon: GraduationCap, key: "prep" },
];

export function AppHeader({ language, screen, initials, onLanguage, onNavigate }: { language: AppLanguage; screen: Screen; initials: string; onLanguage: () => void; onNavigate: (screen: Screen) => void }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#dce4dc] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto grid h-[72px] w-full max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-7 lg:px-12">
          <button onClick={() => onNavigate("welcome")} className="w-fit rounded-xl text-left"><Brand /></button>
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = screen === item.screen || (screen === "detail" && item.screen === "matches");
              return <button key={item.screen} onClick={() => onNavigate(item.screen)} className={cn("rounded-xl px-3.5 py-2 text-[13px] font-bold transition hover:bg-[#eef4ef]", active ? "bg-[#e8f0e9] text-[#17332d]" : "text-[#6c7c76]")}>{copy[language][item.key]}</button>;
            })}
          </nav>
          <div className="flex items-center justify-end gap-2">
            <Button onClick={onLanguage} variant="outline" className="h-10 rounded-full border-[#d6dfd7] bg-white px-3 text-[#294b41]" aria-label={language === "hi" ? "Switch interface to English" : "इंटरफ़ेस हिंदी में करें"}><Globe2 /> <span className="hidden sm:inline">{language === "hi" ? "हिन्दी · EN" : "English · हिं"}</span></Button>
            <Button onClick={() => onNavigate("counsellor")} variant="ghost" size="icon" className="size-10 rounded-full text-[#52665e]" aria-label={copy[language].counsellor}><ShieldCheck /></Button>
            <button onClick={() => onNavigate("profile")} className="grid size-10 place-items-center rounded-full bg-[#e5f2b5] text-sm font-black text-[#17332d]" aria-label="Candidate profile">{initials}</button>
          </div>
        </div>
      </header>
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-[#d9e2da] bg-white/95 px-1 pb-[max(5px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_30px_#17332d0d] backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = screen === item.screen || (screen === "detail" && item.screen === "matches");
          return <button key={item.screen} onClick={() => onNavigate(item.screen)} className={cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold", active ? "bg-[#e9f2ea] text-[#196b4f]" : "text-[#75847e]")}><Icon className="size-[18px]" /><span>{copy[language][item.key]}</span></button>;
        })}
      </nav>
    </>
  );
}

export function PageTitle({ eyebrow, title, description, back, action }: { eyebrow?: string; title: string; description?: string; back?: () => void; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {back && <button onClick={back} className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-bold text-[#557067] hover:bg-[#edf3ee]"><ArrowLeft className="size-4" /> Back</button>}
        {eyebrow && <p className="mb-2 text-xs font-black uppercase tracking-[.12em] text-[#5d8173]">{eyebrow}</p>}
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-[-.035em] text-[#17332d]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#667871] sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SourceCitation({ name, rowId }: { name: string; rowId: string }) {
  return <div className="inline-flex flex-wrap items-center gap-1.5 rounded-lg bg-[#f4f6f2] px-2.5 py-1.5 text-xs text-[#64736e]"><ShieldCheck className="size-3.5 text-[#196b4f]" /><span>{name}</span><span aria-hidden="true">•</span><strong className="font-mono text-[#3c5a50]">{rowId}</strong></div>;
}

export function StatusIcon({ status }: { status: "met" | "missing" | "unknown" }) {
  if (status === "met") return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#dff1d5] text-[#397b32]" aria-label="You meet this"><Check className="size-4" strokeWidth={3} /></span>;
  if (status === "missing") return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fde2dd] text-[#b44035]" aria-label="Missing requirement">×</span>;
  return <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fff0c7] text-[#886619]" aria-label="More information needed">?</span>;
}

export function NextButton({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return <Button size="lg" onClick={onClick} className={cn("min-h-12 rounded-xl bg-[#196b4f] px-5 font-extrabold shadow-[0_10px_24px_#196b4f22] hover:bg-[#135b42]", className)}>{children}<ChevronRight className="size-4" /></Button>;
}
