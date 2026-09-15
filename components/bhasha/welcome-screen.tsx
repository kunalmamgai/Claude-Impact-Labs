"use client";

import { ArrowRight, Check, Headphones, Mic, ShieldCheck, Sparkles, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLanguage, CandidateProfile } from "@/lib/product-types";
import { demoCandidates } from "@/data/candidates";

export function WelcomeScreen({ language, onStart, onDemo }: { language: AppLanguage; onStart: (mode?: "voice" | "type") => void; onDemo: (candidate: CandidateProfile) => void }) {
  const hi = language === "hi";
  return (
    <div className="mx-auto w-full max-w-[1420px] px-4 pb-28 pt-7 sm:px-7 sm:pt-11 lg:px-12 lg:pt-14">
      <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(430px,.85fr)] lg:gap-14">
        <div className="max-w-3xl py-3">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce6dc] bg-white px-3.5 py-2 text-xs font-extrabold text-[#4f6f63] shadow-sm"><span className="size-2 rounded-full bg-[#73a943]" /> {hi ? "आवाज़ से अवसर तक · लगभग 1 मिनट" : "From voice to opportunity · about 1 minute"}</div>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,6.25rem)] font-bold leading-[.93] tracking-[-.055em] text-[#17332d]">
            {hi ? <>अपनी कहानी <span className="relative text-[#196b4f]">बोलिए।<svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 220 14" aria-hidden="true"><path d="M3 9c53-7 136-8 214-3" fill="none" stroke="#d0e483" strokeWidth="7" strokeLinecap="round" /></svg></span><br />हम रास्ता दिखाएँगे।</> : <>Tell us your <span className="relative text-[#196b4f]">story.<svg className="absolute -bottom-2 left-0 h-3 w-full" viewBox="0 0 220 14" aria-hidden="true"><path d="M3 9c53-7 136-8 214-3" fill="none" stroke="#d0e483" strokeWidth="7" strokeLinecap="round" /></svg></span><br />We&apos;ll find the way.</>}
          </h1>
          <p className="mt-8 max-w-2xl text-[17px] leading-8 text-[#61746d] sm:text-lg">{hi ? "अपनी पढ़ाई, हुनर और काम के बारे में हिंदी, English या Hinglish में बोलिए। हम आपकी करियर प्रोफ़ाइल बनाएँगे, ऐसे अवसर दिखाएँगे जिनके लिए आप सच में पात्र हैं, और अगले कदम की तैयारी कराएँगे।" : "Speak naturally in Hindi, English or Hinglish about your education, skills and work. We’ll build your career profile, find opportunities you can actually act on, and prepare you for the next step."}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => onStart("voice")} className="min-h-14 rounded-2xl bg-[#196b4f] px-6 text-base font-black shadow-[0_15px_30px_#196b4f27] hover:bg-[#125d43]"><Mic className="size-5" />{hi ? "अपनी आवाज़ से शुरू करें" : "Start with your voice"}<ArrowRight /></Button>
            <Button onClick={() => onStart("type")} variant="outline" className="min-h-14 rounded-2xl border-[#cedbd1] bg-white px-6 text-base font-extrabold text-[#294b41]"><Type className="size-5" />{hi ? "लिखकर बताएँ" : "Type instead"}</Button>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#64786f]">
            <span className="flex items-center gap-2"><Check className="size-4 text-[#4b8b42]" />{hi ? "रिज़्यूमे की ज़रूरत नहीं" : "No resume needed"}</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-[#4b8b42]" />{hi ? "रिकॉर्डिंग सेव नहीं होती" : "Recording isn’t retained"}</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-[#4b8b42]" />{hi ? "कोई आवेदन अपने-आप नहीं" : "No automatic applications"}</span>
          </div>
        </div>

        <div className="relative rounded-[32px] border border-[#d7e2d8] bg-white p-4 shadow-[0_35px_90px_#1c3d3217] sm:p-6">
          <div className="absolute -right-3 -top-3 hidden rounded-2xl bg-[#f3b74a] px-4 py-3 text-sm font-black text-[#533d12] shadow-xl sm:block">{hi ? "कोई फॉर्म नहीं ✦" : "No long forms ✦"}</div>
          <div className="rounded-[24px] bg-[linear-gradient(145deg,#edf5ee,#f9fbf6)] p-6 text-center sm:p-8">
            <div className="mx-auto grid size-24 place-items-center rounded-full border-[7px] border-white bg-[#196b4f] text-white shadow-[0_16px_35px_#196b4f3b]"><Mic className="size-10" /></div>
            <h2 className="mt-5 text-xl font-black text-[#17332d]">{hi ? "बस अपनी तरह बोलिए" : "Just speak naturally"}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#71827b]">{hi ? "नाम, पढ़ाई, कोई सर्टिफिकेट, आप क्या काम जानते हैं, और किस तरह की नौकरी चाहते हैं।" : "Your name, education, certificates, work you know, and the kind of opportunity you want."}</p>
            <div className="my-7 flex h-16 items-center justify-center gap-[5px]" aria-label="Voice waveform preview">
              {[18,34,26,49,62,38,54,28,45,65,31,52,23,39,58,29,20].map((height, index) => <span key={index} className="w-1.5 rounded-full bg-[#4f936f]" style={{ height }} />)}
            </div>
            <div className="rounded-2xl border border-[#dbe5dc] bg-white p-4 text-left text-sm leading-6 text-[#425f55] shadow-sm"><Headphones className="mr-2 inline size-4 text-[#196b4f]" />“Main Bhopal mein rehta hoon. Maine 12th aur ITI Electrician kiya hai…”</div>
          </div>
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#fff7e5] p-4 text-xs leading-5 text-[#725b29]"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><span><strong className="block">{hi ? "आपकी निजता पहले" : "Privacy comes first"}</strong>{hi ? "आवाज़ केवल इस प्रोफ़ाइल के लिए उपयोग होती है और प्रक्रिया के बाद हटा दी जाती है।" : "Your voice is only used to build this profile and is removed after processing."}</span></div>
        </div>
      </section>

      <section className="mt-14 border-t border-[#d8e1d8] pt-9">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#5f8175]">{hi ? "जज डेमो · Demo mode" : "Judge demo · Demo mode"}</p><h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">{hi ? "तैयार उदाहरण से पूरी यात्रा देखें" : "Explore the full journey with a ready profile"}</h2></div><span className="text-xs text-[#76857f]">{hi ? "किसी microphone permission की ज़रूरत नहीं" : "No microphone permission needed"}</span></div>
        <div className="grid gap-3 sm:grid-cols-3">
          {demoCandidates.map((candidate, index) => (
            <button key={candidate.id} onClick={() => onDemo(candidate)} className="group flex min-h-28 w-full min-w-0 items-center gap-4 rounded-2xl border border-[#d9e2da] bg-white p-4 text-left shadow-[0_8px_25px_#23423709] transition hover:-translate-y-1 hover:border-[#a9c1b2] hover:shadow-[0_18px_40px_#23423712]">
              <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-black ${index === 0 ? "bg-[#dff0a7] text-[#375725]" : index === 1 ? "bg-[#fee8b9] text-[#77571d]" : "bg-[#dceeea] text-[#315f57]"}`}>{candidate.initials}</span>
              <span className="min-w-0 flex-1"><strong className="block text-sm text-[#223d34]">{candidate.name}</strong><small className="mt-1 block truncate text-xs text-[#72827c]">{candidate.certification} · {candidate.location.split(",")[0]}</small><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#196b4f]">{hi ? "डेमो चलाएँ" : "Try profile"}<ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span></span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#7b8984]"><Sparkles className="size-4 text-[#698d48]" /> {hi ? "यह एक विश्वसनीय hackathon demo snapshot है—live नौकरी डेटा नहीं।" : "This uses a reliable hackathon demo snapshot, not live job data."}</div>
      </section>
    </div>
  );
}
