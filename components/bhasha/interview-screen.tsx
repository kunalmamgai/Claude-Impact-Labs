"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowLeft, BookOpenText, Check, ChevronDown, Copy, ExternalLink, Globe2, Mic, PlayCircle, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage, CandidateProfile, OpportunityMatch } from "@/lib/product-types";

const websiteResources = {
  electrician: [
    {
      title: "Skill India",
      subtitle: "Government training and job-readiness resources",
      url: "https://www.skillindia.gov.in/",
      label: "Open website",
    },
    {
      title: "National Career Service",
      subtitle: "Career guidance and job opportunities",
      url: "https://www.ncs.gov.in/",
      label: "Explore roles",
    },
  ],
  fitter: [
    {
      title: "Skill India",
      subtitle: "Industrial training and trade learning",
      url: "https://www.skillindia.gov.in/",
      label: "Open website",
    },
    {
      title: "PMKVY",
      subtitle: "Short courses to improve trade skills",
      url: "https://pmkvyofficial.org/",
      label: "See courses",
    },
  ],
  office: [
    {
      title: "NCS Career Guide",
      subtitle: "Customer service and office-readiness guidance",
      url: "https://www.ncs.gov.in/",
      label: "Read guidance",
    },
    {
      title: "Skill India",
      subtitle: "Digital and customer-facing skill programmes",
      url: "https://www.skillindia.gov.in/",
      label: "Find courses",
    },
  ],
} as const;

const youtubeLinks = {
  electrician: [
    {
      title: "Electrical wiring basics",
      subtitle: "Learn core safety and wiring concepts",
      url: "https://www.youtube.com/results?search_query=electrical+wiring+basics+for+beginners",
      label: "Watch video",
    },
    {
      title: "Residential wiring practice",
      subtitle: "Understand jobsite-style installation steps",
      url: "https://www.youtube.com/results?search_query=residential+wiring+practice+for+electrician",
      label: "Watch video",
    },
  ],
  fitter: [
    {
      title: "Workshop fitting basics",
      subtitle: "Marking, measuring, and tool handling",
      url: "https://www.youtube.com/results?search_query=fitter+trade+workshop+basics",
      label: "Watch video",
    },
    {
      title: "Safety in fitting work",
      subtitle: "Tool safety and practical workshop habits",
      url: "https://www.youtube.com/results?search_query=fitter+safety+workshop+training",
      label: "Watch video",
    },
  ],
  office: [
    {
      title: "Customer service skills",
      subtitle: "Clear communication and handling queries",
      url: "https://www.youtube.com/results?search_query=customer+service+communication+skills+training",
      label: "Watch video",
    },
    {
      title: "Data entry and accuracy",
      subtitle: "Faster, cleaner office work habits",
      url: "https://www.youtube.com/results?search_query=data+entry+accuracy+tips+for+beginners",
      label: "Watch video",
    },
  ],
} as const;

export function InterviewScreen({ language, profile, match, onBack, onComplete }: { language: AppLanguage; profile: CandidateProfile; match: OpportunityMatch; onBack: () => void; onComplete: () => void }) {
  const hi = language === "hi";
  const [open, setOpen] = useState<string | null>(match.opportunity.interviewQuestions[0]?.id ?? null);
  const [practising, setPractising] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const questions = match.opportunity.interviewQuestions;

  const tradeKey = useMemo(() => {
    const opportunityText = `${match.opportunity.title} ${profile.trade ?? ""}`.toLowerCase();
    if (/office|data|customer|support|billing/i.test(opportunityText)) return "office";
    if (/fitter|mechanic|assembly|workshop|tool/i.test(opportunityText)) return "fitter";
    return "electrician";
  }, [match.opportunity.title, profile.trade]);

  const focusAreas = tradeKey === "office"
    ? [{ en: "Clear example", hi: "साफ़ उदाहरण" }, { en: "Accuracy", hi: "शुद्धता" }, { en: "Polite communication", hi: "विनम्र बात" }]
    : tradeKey === "fitter"
      ? [{ en: "Safety", hi: "सुरक्षा" }, { en: "Name the tools", hi: "औज़ार बताएँ" }, { en: "Clear steps", hi: "साफ़ कदम" }]
      : [{ en: "Safety first", hi: "सुरक्षा पहले" }, { en: "Step by step", hi: "सही क्रम" }, { en: "Honest example", hi: "सच्चा उदाहरण" }];

  const skillResources = websiteResources[tradeKey];
  const videoResources = youtubeLinks[tradeKey];

  const copyAnswer = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      // clipboard not available
    }
  };

  const togglePractice = (id: string) => {
    if (practising === id) {
      setPractising(null);
      setFeedback(id);
    } else {
      setPractising(id);
      setFeedback(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-7 sm:px-7 lg:px-12 lg:pt-9">
      <button onClick={onBack} className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-extrabold text-[#557067] hover:bg-[#e9f1ea]"><ArrowLeft className="size-4" />{hi ? "अवसर पर वापस" : "Back to opportunity"}</button>

      <section className="relative overflow-hidden rounded-[30px] bg-[#173f34] p-5 text-white shadow-[0_24px_70px_#1c3c3118] sm:p-7">
        <div className="absolute -left-16 -top-24 size-72 rounded-full border-[45px] border-white/5" />
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="sm:p-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-black"><Target className="size-4 text-[#dff0a7]" />{hi ? "आपकी role-specific तैयारी" : "Your role-specific practice"}</span>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] sm:text-5xl">{hi ? `${match.opportunity.titleHi} की तैयारी` : `Prepare for ${match.opportunity.title}`}</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/70">{hi ? `${profile.name} के लिए 5 संभावित सवाल · सरल जवाब · बोलकर अभ्यास` : `5 likely questions for ${profile.name} · simple answers · voice practice`}</p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] ring-1 ring-white/15">
            <Image src="/images/interview-practice.jpg" alt={hi ? "इंटरव्यू जैसी बातचीत का अभ्यास करती युवा भारतीय उम्मीदवार" : "Young Indian candidate practising an interview conversation"} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" style={{ objectPosition: "center 42%" }} />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/92 px-3 py-2 text-[#27493d] shadow-lg backdrop-blur"><span className="grid size-8 place-items-center rounded-lg bg-[#196b4f] text-white"><Mic className="size-4" /></span><span><strong className="block text-xs">{hi ? "बोलकर अभ्यास करें" : "Practise out loud"}</strong><small className="text-[10px] text-[#6d7d76]">5 {hi ? "मुख्य सवाल" : "key questions"}</small></span></div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(310px,.65fr)]">
        <main className="space-y-5">
          <section className="rounded-[26px] border border-[#d9e2da] bg-[#f6faf7] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[#235b46]">
              <TrendingUp className="size-5" />
              <h2 className="text-lg font-black">{hi ? "स्किल बढ़ाने के लिए तेज़ रास्ते" : "Quick skill boosters"}</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-[22px] border border-[#d7e4dc] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[#1d564b]">
                  <Globe2 className="size-4" />
                  <h3 className="text-sm font-black uppercase tracking-[.08em]">{hi ? "वेबसाइट्स" : "Useful websites"}</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {skillResources.map((resource) => (
                    <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer noopener" className="group rounded-2xl border border-[#dfe7e0] bg-[#f9fbf9] p-3 transition hover:-translate-y-0.5 hover:border-[#b8d3bd] hover:bg-[#f3f9f4]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-[#23483d]">{resource.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#62756d]">{resource.subtitle}</p>
                        </div>
                        <span className="grid size-8 place-items-center rounded-lg bg-[#eaf3eb] text-[#196b4f]"><ExternalLink className="size-4" /></span>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-[#196b4f]">{resource.label}<ArrowLeft className="size-3 rotate-180" /></span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#d7e4dc] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[#1d564b]">
                  <PlayCircle className="size-4" />
                  <h3 className="text-sm font-black uppercase tracking-[.08em]">{hi ? "YouTube वीडियो" : "YouTube videos"}</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {videoResources.map((resource) => (
                    <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer noopener" className="group rounded-2xl border border-[#dfe7e0] bg-[#f8fbf9] p-3 transition hover:-translate-y-0.5 hover:border-[#b8d3bd] hover:bg-[#f2f8f4]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-[#23483d]">{resource.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[#62756d]">{resource.subtitle}</p>
                        </div>
                        <span className="grid size-8 place-items-center rounded-lg bg-[#eaf3eb] text-[#196b4f]"><PlayCircle className="size-4" /></span>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-[#196b4f]">{resource.label}<ArrowLeft className="size-3 rotate-180" /></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {questions.map((question, index) => {
            const isOpen = open === question.id;
            const answer = hi ? question.answerHi : question.answer;
            return (
              <article key={question.id} className="overflow-hidden rounded-[22px] border border-[#d9e2da] bg-white shadow-[0_10px_35px_#203e3408]">
                <button onClick={() => setOpen(isOpen ? null : question.id)} className="flex w-full items-start gap-4 p-5 text-left">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f1ea] text-sm font-black text-[#196b4f]">{index + 1}</span>
                  <span className="flex-1">
                    <span className="block font-black leading-6 text-[#28483d]">{hi ? question.questionHi : question.question}</span>
                    <small className="mt-1 block text-xs text-[#7a8983]">{hi ? "लगभग 45 सेकंड · आसान" : "About 45 sec · Easy"}</small>
                  </span>
                  <ChevronDown className={`mt-1 size-5 text-[#73827c] transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-[#e1e7e1] p-5">
                    <div className="rounded-2xl border border-[#cfe1d2] bg-[#eef6ef] p-4">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.09em] text-[#477256]"><Sparkles className="size-4" />{hi ? "मज़बूत जवाब में" : "A strong answer shows"}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {focusAreas.map((area) => (
                          <span key={area.en} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-black text-[#416653] ring-1 ring-[#cbdccf]">
                            <Check className="size-3.5 text-[#4e9145]" />{hi ? area.hi : area.en}
                          </span>
                        ))}
                      </div>
                      <p className="mt-4 text-[15px] leading-7 text-[#365349]">{answer}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => copyAnswer(question.id, answer)} variant="outline" className="min-h-10 rounded-xl border-[#bfd2c3] bg-white text-[#315648]"><Copy />{copied === question.id ? (hi ? "कॉपी हुआ" : "Copied") : (hi ? "जवाब कॉपी करें" : "Copy answer")}</Button>
                        <Button onClick={() => togglePractice(question.id)} className="min-h-10 rounded-xl bg-[#196b4f] font-black text-white">{practising === question.id ? (hi ? "अभ्यास जारी रखें" : "Keep practicing") : (hi ? "बोलकर अभ्यास करें" : "Practice aloud")}</Button>
                      </div>
                      {practising === question.id && (
                        <div className="mt-4 rounded-2xl border border-[#d7eadc] bg-white p-3 text-sm text-[#425c52]">
                          <div className="flex items-center gap-2 text-[#196b4f] font-black"><Mic className="size-4" />{hi ? "प्रैक्टिस टिप" : "Practice tip"}</div>
                          <p className="mt-2 leading-6">{hi ? "एक-एक बात को छोटे वाक्यों में बोलें। शुरुआत में धीमी आवाज़ में, फिर 10 सेकंड के लिए स्पष्ट और आत्मविश्वास के साथ दोहराएँ।" : "Speak in short sentences. Start slowly, then repeat your answer clearly with confidence for about 10 seconds."}</p>
                        </div>
                      )}
                      {feedback === question.id && (
                        <div className="mt-4 rounded-2xl border border-[#e7dcb4] bg-[#fff9e9] p-3 text-sm leading-6 text-[#5a4822]">
                          <div className="flex items-center gap-2 font-black text-[#6d571d]"><BookOpenText className="size-4" />{hi ? "फीडबैक" : "Feedback"}</div>
                          <p className="mt-2">{hi ? "आपका जवाब अच्छा है। मुख्य बात को शॉर्ट और साफ़ रखें, और एक उदाहरण जोड़ें ताकि इंटरव्यूयर को भरोसा हो।" : "Your answer is on the right track. Keep it brief and clear, and add one real example so the interviewer can trust your experience."}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-[24px] border border-[#d9e2da] bg-white p-5">
            <h2 className="font-black">{hi ? "आपकी तैयारी" : "Your preparation"}</h2>
            <div className="mt-5 space-y-4">
              {[{ label: hi ? "सवाल देखे" : "Questions reviewed", value: Math.max(1, open ? 2 : 1), total: 5 }, { label: hi ? "आवाज़ में अभ्यास" : "Voice practices", value: feedback ? 1 : 0, total: 5 }].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-bold text-[#5c7268]"><span>{item.label}</span><span>{item.value}/{item.total}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7ece8]"><div className="h-full rounded-full bg-[#196b4f] transition-all" style={{ width: `${(item.value / item.total) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#ead7aa] bg-[#fff8e5] p-5">
            <h3 className="font-black text-[#604d25]">{hi ? "इंटरव्यू में 3 बातें" : "Three interview habits"}</h3>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#72623e]">
              <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-[#64863f]" />{hi ? "धीरे और अपनी भाषा में साफ़ बोलें" : "Speak slowly and clearly in your own language"}</li>
              <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-[#64863f]" />{hi ? "अनौपचारिक अनुभव को ईमानदारी से बताएँ" : "Be honest about informal experience"}</li>
              <li className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-[#64863f]" />{hi ? "सुरक्षा को हर technical answer में पहले रखें" : "Put safety first in technical answers"}</li>
            </ul>
          </section>

          <Button onClick={onComplete} className="min-h-12 w-full rounded-xl bg-[#196b4f] font-black"><Check />{hi ? "तैयारी पूरी करें" : "Finish preparation"}</Button>
        </aside>
      </div>
    </div>
  );
}