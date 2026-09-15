"use client";

import { useState } from "react";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, ChevronRight, CircleAlert, GraduationCap, IndianRupee, MapPin, Search, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/data/opportunities";
import type { AppLanguage, CandidateProfile, Course, OpportunityMatch } from "@/lib/product-types";
import { PageTitle, SourceCitation, StatusIcon } from "@/components/bhasha/shared";
import { OpportunityVisual } from "@/components/bhasha/opportunity-visual";

function MatchCard({ language, match, onOpen, onPrepare }: { language: AppLanguage; match: OpportunityMatch; onOpen: () => void; onPrepare: () => void }) {
  const hi = language === "hi";
  const { opportunity } = match;
  return (
    <article className="group rounded-[24px] border border-[#d9e2da] bg-white p-4 shadow-[0_12px_36px_#1c3c3109] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_#1c3c3112] sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <OpportunityVisual opportunity={opportunity} hi={hi} className="aspect-[16/9] rounded-2xl sm:aspect-auto sm:min-h-[138px]" />
        <div className="min-w-0"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-[#213f35]">{hi ? opportunity.titleHi : opportunity.title}</h3><Badge className={`${match.eligible ? "bg-[#dff0d7] text-[#3f7738]" : "bg-[#fff0cf] text-[#8b6720]"} hover:bg-current/0`}>{match.eligible ? (hi ? "पात्र" : "Eligible") : (hi ? "अभी पात्र नहीं" : "Not currently eligible")}</Badge></div><p className="mt-1 text-sm font-semibold text-[#65776f]">{opportunity.organisation}</p></div><span className={`w-fit rounded-xl px-3 py-2 text-sm font-black ${match.eligible ? "bg-[#196b4f] text-white" : "bg-[#fff5df] text-[#7a5d20]"}`}>{match.relevanceScore}% <small className="font-bold opacity-75">{hi ? "मिलान" : "match"}</small></span></div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-[#63766e]"><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f3f6f2] px-2.5 py-1.5"><MapPin className="size-3.5" />{opportunity.location}</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f3f6f2] px-2.5 py-1.5">{opportunity.type === "apprenticeship" ? <GraduationCap className="size-3.5" /> : <BriefcaseBusiness className="size-3.5" />}{opportunity.type}</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f3f6f2] px-2.5 py-1.5"><IndianRupee className="size-3.5" />{opportunity.compensation}</span></div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6d7d76]">{opportunity.summary}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-[#e4e9e4] pt-4 md:grid-cols-[1fr_auto]">
        <div><p className="mb-2 text-[11px] font-black uppercase tracking-[.1em] text-[#71827a]">{match.eligible ? (hi ? "आप क्यों पात्र हैं" : "Why you qualify") : (hi ? "क्या कमी है" : "What’s blocking eligibility")}</p><div className="grid gap-2 sm:grid-cols-2">{match.requirements.slice(0, 4).map((requirement) => <div key={requirement.id} className="flex items-start gap-2 text-xs leading-5 text-[#4d655c]"><StatusIcon status={requirement.status} /><span>{hi ? requirement.simpleHi : requirement.simple}</span></div>)}</div>{match.needsInfo.length > 0 && <p className="mt-3 text-[11px] font-bold text-[#8a651d]">{hi ? "उपलब्ध जानकारी से यह शर्त पूरी नहीं हुई है; सत्यापन ज़रूरी है।" : "This requirement still needs verification before it can be treated as a pass."}</p>}</div>
        <div className="flex flex-col items-stretch justify-end gap-2 sm:flex-row md:flex-col"><Button onClick={onOpen} variant="outline" className="min-h-10 rounded-xl border-[#cbd7cd] font-black text-[#355248]">{hi ? "पात्रता समझें" : "View eligibility"}<ChevronRight /></Button>{match.eligible && <Button onClick={onPrepare} className="min-h-10 rounded-xl bg-[#196b4f] font-black">{hi ? "इस role की तैयारी" : "Prepare for role"}<ArrowRight /></Button>}</div>
      </div>
      <div className="mt-4"><SourceCitation name={opportunity.sourceName} rowId={opportunity.sourceRowId} /></div>
    </article>
  );
}

function CourseCard({ language, course }: { language: AppLanguage; course: Course }) {
  const hi = language === "hi";
  return <article className="rounded-[22px] border border-[#d9e3da] bg-white p-5"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e4eef0] text-[#35636a]"><BookOpenCheck /></span><div><h3 className="font-black text-[#27463c]">{hi ? course.titleHi : course.title}</h3><p className="mt-1 text-sm text-[#71817a]">{course.provider}</p></div></div><div className="mt-4 grid gap-2 rounded-2xl bg-[#f5f7f4] p-4 text-sm text-[#526960]"><p><strong>{hi ? "जगह:" : "Location:"}</strong> {course.location}</p><p><strong>{hi ? "समय:" : "Duration:"}</strong> {course.duration}</p><p><strong>{hi ? "इस कमी में मदद:" : "May help with:"}</strong> {course.closesGap}</p></div><p className="mt-3 text-xs leading-5 text-[#84724b]"><CircleAlert className="mr-1.5 inline size-4" />{hi ? "यह course योग्यता की कमी पूरी करने में मदद कर सकता है; नौकरी की गारंटी नहीं है।" : "This may help close a qualification gap; it does not guarantee employment."}</p><div className="mt-4"><SourceCitation name={course.sourceName} rowId={course.sourceRowId} /></div></article>;
}

export function MatchesScreen({ language, profile, matches, onOpen, onPrepare, onResume }: { language: AppLanguage; profile: CandidateProfile; matches: OpportunityMatch[]; onOpen: (match: OpportunityMatch) => void; onPrepare: (match: OpportunityMatch) => void; onResume: () => void }) {
  const hi = language === "hi";
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const opportunityMatchesQuery = (match: OpportunityMatch) => !normalizedQuery || [match.opportunity.title, match.opportunity.titleHi, match.opportunity.organisation, match.opportunity.location, match.opportunity.type].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  const courseMatchesQuery = (course: Course) => !normalizedQuery || [course.title, course.titleHi, course.provider, course.location, course.closesGap].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  const eligible = matches.filter((match) => match.eligible && opportunityMatchesQuery(match));
  const near = matches.filter((match) => !match.eligible && opportunityMatchesQuery(match));
  const relevantCourses = courses.filter((course) => course.relatedTrades.includes(profile.trade ?? "") && courseMatchesQuery(course));
  const emptyCopy = <div className="rounded-3xl border border-dashed border-[#bfcfc2] bg-white p-12 text-center"><Search className="mx-auto size-8 text-[#7e9188]" /><h3 className="mt-3 font-black">{hi ? "कोई परिणाम नहीं मिला" : "No results found"}</h3><p className="mt-2 text-sm text-[#72817b]">{hi ? "दूसरा शब्द खोजें या search साफ़ करें।" : "Try another keyword or clear the search."}</p></div>;
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 pb-28 pt-8 sm:px-7 lg:px-12 lg:pt-10">
      <PageTitle eyebrow={hi ? "कदम 3 / 4 · पात्रता के आधार पर" : "Step 3 of 4 · Eligibility first"} title={hi ? "ऐसे अवसर जिन पर आप आगे बढ़ सकते हैं" : "Opportunities you can act on"} description={hi ? "हर ज़रूरी शर्त आपकी प्रोफ़ाइल से जाँची गई है—सिर्फ relevance score नहीं।" : "Every hard requirement is checked against your profile—not just a relevance score."} action={<Button onClick={onResume} variant="outline" className="min-h-11 rounded-xl border-[#cad8cd] bg-white font-black text-[#294b41]"><Sparkles />{hi ? "रिज़्यूमे बनाएँ" : "Build resume"}</Button>} />
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#dfd4ad] bg-[#fff9e9] p-4 text-sm text-[#6e5c2f]"><span className="grid size-8 place-items-center rounded-lg bg-[#f6d779]"><CircleAlert className="size-4" /></span><strong>{hi ? "Hackathon demo snapshot" : "Hackathon demo snapshot"}</strong><span>{hi ? "यह live portal डेटा नहीं है। कोई आवेदन या account अपने-आप नहीं बनाया जाएगा।" : "This is not live portal data. No application or external account is created for you."}</span></div>
      <Tabs defaultValue="eligible" className="gap-5">
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[#dbe4dc] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"><TabsList className="h-auto w-full max-w-full justify-start overflow-x-auto rounded-xl bg-[#edf2ed] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto"><TabsTrigger value="eligible" className="min-h-10 rounded-lg px-4 font-black data-[state=active]:bg-white">{hi ? "सबसे अच्छे मिलान" : "Best matches"}<span className="rounded-full bg-[#dff0d7] px-2 py-0.5 text-[10px] text-[#3c7435]">{eligible.length}</span></TabsTrigger><TabsTrigger value="near" className="min-h-10 rounded-lg px-4 font-black data-[state=active]:bg-white">{hi ? "करीब के मिलान" : "Near matches"}<span className="rounded-full bg-[#fff0cf] px-2 py-0.5 text-[10px] text-[#80601c]">{near.length}</span></TabsTrigger><TabsTrigger value="courses" className="min-h-10 rounded-lg px-4 font-black data-[state=active]:bg-white">{hi ? "कोर्स" : "Courses"}<span className="rounded-full bg-[#dfecef] px-2 py-0.5 text-[10px] text-[#3e6870]">{relevantCourses.length}</span></TabsTrigger></TabsList><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#87948f]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border border-[#d5dfd7] bg-[#fafbf9] pl-9 pr-3 text-sm sm:w-64" placeholder={hi ? "अवसर खोजें" : "Search opportunities"} aria-label={hi ? "अवसर खोजें" : "Search opportunities"} /></div></div>
        <TabsContent value="eligible"><div className="grid gap-4">{eligible.length ? eligible.map((match) => <MatchCard key={match.opportunity.id} language={language} match={match} onOpen={() => onOpen(match)} onPrepare={() => onPrepare(match)} />) : emptyCopy}</div></TabsContent>
        <TabsContent value="near"><div className="grid gap-4">{near.length ? near.map((match) => <MatchCard key={match.opportunity.id} language={language} match={match} onOpen={() => onOpen(match)} onPrepare={() => onPrepare(match)} />) : emptyCopy}</div></TabsContent>
        <TabsContent value="courses">
          <div className="space-y-4">
            <section className="rounded-[22px] border border-[#cdddcf] bg-[#eef5ef] p-4 sm:p-5" aria-label={hi ? "प्रोफ़ाइल से नए अवसर तक" : "Path from profile to more opportunities"}>
              <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
                {[
                  { icon: UserRound, en: "Current profile", hi: "मौजूदा प्रोफ़ाइल" },
                  { icon: CircleAlert, en: "Missing skill", hi: "कम हुनर" },
                  { icon: BookOpenCheck, en: "Helpful course", hi: "मददगार कोर्स" },
                  { icon: BriefcaseBusiness, en: "More options", hi: "ज़्यादा अवसर" },
                ].map((step, index, steps) => { const Icon = step.icon; return <div key={step.en} className="contents"><div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#dff0a7] text-[#3c6429]"><Icon className="size-4" /></span><strong className="text-xs text-[#355248]">{hi ? step.hi : step.en}</strong></div>{index < steps.length - 1 && <ArrowRight className="mx-auto hidden size-4 text-[#789081] sm:block" aria-hidden="true" />}</div>; })}
              </div>
              <p className="mt-3 text-center text-[11px] text-[#6f8078]">{hi ? "कोर्स मदद कर सकता है; नौकरी की गारंटी नहीं।" : "A course can help close a gap; it does not guarantee a job."}</p>
            </section>
            <div className="grid gap-4 md:grid-cols-2">{relevantCourses.length ? relevantCourses.map((course) => <CourseCard key={course.id} language={language} course={course} />) : <div className="md:col-span-2">{emptyCopy}</div>}</div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
