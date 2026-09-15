"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, Check, MapPin, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { AppLanguage } from "@/lib/product-types";

const tasks = [
  { icon: BookOpenCheck, en: "Understanding your education", hi: "आपकी पढ़ाई समझ रहे हैं" },
  { icon: Wrench, en: "Finding skills in your story", hi: "आपकी बातों में हुनर खोज रहे हैं" },
  { icon: ShieldCheck, en: "Checking certificates", hi: "सर्टिफिकेट जाँच रहे हैं" },
  { icon: MapPin, en: "Understanding your location", hi: "आपकी जगह समझ रहे हैं" },
  { icon: Sparkles, en: "Building your career passport", hi: "आपका करियर पासपोर्ट बना रहे हैं" },
];

export function ProcessingScreen({ language, onComplete }: { language: AppLanguage; onComplete: () => void }) {
  const hi = language === "hi";
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => {
      if (value >= tasks.length - 1) {
        window.clearInterval(timer);
        window.setTimeout(onComplete, 650);
        return value;
      }
      return value + 1;
    }), 520);
    return () => window.clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-5xl items-center justify-center px-4 pb-28 pt-8 sm:px-7">
      <section className="grid w-full overflow-hidden rounded-[32px] border border-[#d6e1d7] bg-white shadow-[0_35px_100px_#1a3a2f17] md:grid-cols-[.9fr_1.1fr]">
        <div className="flex flex-col justify-between bg-[#173f34] p-8 text-white sm:p-11"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black"><Sparkles className="size-4 text-[#dff09f]" />BhashaHire intelligence</span><h1 className="mt-7 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">{hi ? "आपकी कहानी को करियर प्रोफ़ाइल में बदल रहे हैं…" : "Turning your story into a career profile…"}</h1><p className="mt-4 text-[15px] leading-7 text-white/70">{hi ? "आपके अपने शब्दों से जानकारी निकाल रहे हैं—कुछ भी नया या बढ़ा-चढ़ाकर नहीं जोड़ेंगे।" : "We’re structuring what you told us in your own words—without inventing or overstating anything."}</p></div><div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/65"><ShieldCheck className="mr-2 inline size-4 text-[#dff09f]" />{hi ? "जाति, धर्म और लिंग का उपयोग matching में नहीं होता।" : "Caste, religion and gender are never used for matching."}</div></div>
        <div className="p-7 sm:p-11"><div className="mb-7 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#648175]">{hi ? "प्रोफ़ाइल बन रही है" : "Profile in progress"}</p><p className="mt-1 text-sm font-bold text-[#65766f]">{Math.round(((active + 1) / tasks.length) * 100)}% {hi ? "पूरा" : "complete"}</p></div><div className="grid size-12 place-items-center rounded-2xl bg-[#e6f0ba] font-black text-[#355425]">AI</div></div><Progress value={((active + 1) / tasks.length) * 100} className="mb-8 h-2.5 bg-[#e6ece7] [&_[data-slot=progress-indicator]]:bg-[#196b4f]" />
          <div className="space-y-3">{tasks.map((task, index) => { const Icon = task.icon; const done = index < active; const current = index === active; return <div key={task.en} className={`flex min-h-16 items-center gap-4 rounded-2xl border px-4 transition-all duration-500 ${current ? "translate-x-1 border-[#a8c7b4] bg-[#edf5ef] shadow-sm" : done ? "border-[#e1e8e2] bg-white" : "border-transparent bg-[#f7f8f5] opacity-45"}`}><span className={`grid size-9 place-items-center rounded-xl ${done ? "bg-[#196b4f] text-white" : current ? "bg-[#dff0a7] text-[#355626]" : "bg-[#e8ece8] text-[#84918c]"}`}>{done ? <Check className="size-5" strokeWidth={3} /> : <Icon className={`size-5 ${current ? "animate-pulse" : ""}`} />}</span><span className="text-sm font-extrabold text-[#334e45]">{hi ? task.hi : task.en}</span>{current && <span className="ml-auto flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-[#196b4f]" /><i className="size-1.5 animate-bounce rounded-full bg-[#196b4f] [animation-delay:120ms]" /><i className="size-1.5 animate-bounce rounded-full bg-[#196b4f] [animation-delay:240ms]" /></span>}</div>; })}</div>
        </div>
      </section>
    </div>
  );
}
