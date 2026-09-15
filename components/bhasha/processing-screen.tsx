"use client";

import { useEffect, useState } from "react";
import { ArrowDown, BookOpenCheck, Check, MapPin, Mic, ShieldCheck, Sparkles, UserRound, Wrench } from "lucide-react";
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
        <div className="flex flex-col justify-between bg-[#173f34] p-8 text-white sm:p-11"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black"><Sparkles className="size-4 text-[#dff09f]" />BhashaHire intelligence</span><h1 className="mt-7 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-[-.04em] sm:text-5xl">{hi ? "आपकी कहानी से करियर प्रोफ़ाइल" : "Your story becomes a career profile"}</h1><p className="mt-4 text-[15px] leading-7 text-white/70">{hi ? "आपके शब्द → साफ़, बदलने योग्य जानकारी। कुछ भी बढ़ा-चढ़ाकर नहीं।" : "Your words → clear, editable information. Nothing invented or overstated."}</p></div><div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/65"><ShieldCheck className="mr-2 inline size-4 text-[#dff09f]" />{hi ? "Matching में जाति, धर्म या लिंग नहीं।" : "No caste, religion or gender in matching."}</div></div>
        <div className="p-7 sm:p-10"><div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#648175]">{hi ? "आपकी बात समझ रहे हैं" : "Translating your story"}</p><p className="mt-1 text-sm font-bold text-[#65766f]">{Math.round(((active + 1) / tasks.length) * 100)}% {hi ? "पूरा" : "complete"}</p></div><div className="grid size-12 place-items-center rounded-2xl bg-[#e6f0ba] font-black text-[#355425]">AI</div></div><Progress value={((active + 1) / tasks.length) * 100} className="mb-6 h-2.5 bg-[#e6ece7] [&_[data-slot=progress-indicator]]:bg-[#196b4f]" />
          <div className="rounded-[26px] border border-[#dce5dd] bg-[linear-gradient(145deg,#f7faf6,#eef4ef)] p-5">
            <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl border border-[#cdded1] bg-white px-4 py-3 shadow-sm"><span className="grid size-9 place-items-center rounded-xl bg-[#196b4f] text-white"><Mic className="size-4" /></span><span><strong className="block text-sm text-[#2d4b41]">{hi ? "आपकी आवाज़" : "Your voice"}</strong><small className="text-[11px] text-[#77867f]">Hindi · English · Hinglish</small></span></div>
            <ArrowDown className="mx-auto my-3 size-5 text-[#7b9588]" aria-hidden="true" />
            <div className="grid grid-cols-2 gap-2.5">{tasks.slice(0, 4).map((task, index) => { const Icon = task.icon; const ready = index <= active; const current = index === active; return <div key={task.en} className={`flex min-h-20 flex-col justify-center rounded-2xl border p-3 transition-all duration-500 ${current ? "border-[#9fc2aa] bg-white shadow-md" : ready ? "border-[#d7e2d9] bg-white/80" : "border-transparent bg-white/40 opacity-45"}`}><span className={`grid size-8 place-items-center rounded-lg ${ready ? "bg-[#dff0a7] text-[#355626]" : "bg-[#e8ece8] text-[#84918c]"}`}>{index < active ? <Check className="size-4" strokeWidth={3} /> : <Icon className={`size-4 ${current ? "animate-pulse" : ""}`} />}</span><strong className="mt-2 text-xs leading-5 text-[#334e45]">{hi ? task.hi.replace("समझ रहे हैं", "").replace("जाँच रहे हैं", "").replace("खोज रहे हैं", "") : task.en.replace("Understanding your ", "").replace("Finding ", "").replace(" in your story", "").replace("Checking ", "")}</strong></div>; })}</div>
            <ArrowDown className="mx-auto my-3 size-5 text-[#7b9588]" aria-hidden="true" />
            <div className={`mx-auto flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500 ${active >= tasks.length - 1 ? "bg-[#196b4f] text-white shadow-[0_12px_28px_#196b4f32]" : "bg-[#dfe6e0] text-[#7b8983]"}`}><span className={`grid size-9 place-items-center rounded-xl ${active >= tasks.length - 1 ? "bg-white/15" : "bg-white/60"}`}><UserRound className="size-5" /></span><span><strong className="block text-sm">{hi ? "करियर पासपोर्ट" : "Career passport"}</strong><small className={active >= tasks.length - 1 ? "text-white/65" : "text-[#8a9791]"}>{hi ? "जाँचने और बदलने के लिए तैयार" : "Ready to review and edit"}</small></span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
