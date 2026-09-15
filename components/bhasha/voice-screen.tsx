"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Check, FileAudio, Keyboard, LockKeyhole, Mic, RotateCcw, Square, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AppLanguage, CaptureLanguage } from "@/lib/product-types";

const sampleTranscript = "Main Bhopal mein rehta hoon. Maine 12th complete ki hai aur ITI electrician kiya hai. Main fresher hoon lekin ghar aur aas-paas wiring ka kaam kiya hai. Main full-time kaam kar sakta hoon.";
const bars = [20, 33, 46, 28, 58, 72, 42, 63, 35, 78, 54, 30, 61, 82, 49, 68, 38, 57, 29, 45, 70, 40, 56, 24, 35, 64, 47, 31, 52, 26];

export function VoiceScreen({ language, initialMode, onBack, onUse, onDemo }: { language: AppLanguage; initialMode: "voice" | "type"; onBack: () => void; onUse: (transcript: string) => void; onDemo: () => void }) {
  const hi = language === "hi";
  const [mode, setMode] = useState<"voice" | "type">(initialMode);
  const [captureLanguage, setCaptureLanguage] = useState<CaptureLanguage>("hinglish");
  const [status, setStatus] = useState<"idle" | "recording" | "recorded" | "error">("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState(sampleTranscript);
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (status !== "recording") return;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value >= 59) {
        mediaRecorderRef.current?.stop();
        return 60;
      }
      return value + 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const startRecording = async () => {
    setError("");
    setSeconds(0);
    chunksRef.current = [];
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setError(hi ? "इस browser में recording उपलब्ध नहीं है। नीचे demo profile चुनें।" : "Recording is unavailable in this browser. Use the demo profile below.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        setStatus("recorded");
      };
      recorder.start();
      setStatus("recording");
    } catch {
      setStatus("error");
      setError(hi ? "Microphone की अनुमति नहीं मिली। आप लिखकर बता सकते हैं या demo profile चला सकते हैं।" : "Microphone access wasn’t available. You can type instead or continue with a demo profile.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl("");
    setStatus("idle");
    setSeconds(0);
    setError("");
  };

  const formattedTime = `00:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-7 sm:px-7 sm:pt-10 lg:px-12">
      <button onClick={onBack} className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-extrabold text-[#557067] hover:bg-[#e9f1ea]"><ArrowLeft className="size-4" />{hi ? "वापस" : "Back"}</button>
      <div className="mb-7 text-center"><p className="text-xs font-black uppercase tracking-[.12em] text-[#5e8174]">{hi ? "कदम 1 / 4 · आपकी कहानी" : "Step 1 of 4 · Your story"}</p><h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.04em] sm:text-5xl">{hi ? "अपने बारे में बताइए" : "Tell us about yourself"}</h1><p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[#6b7c75]">{hi ? "आप सामान्य तरीके से बोल सकते हैं—सही शब्द चुनने या English बोलने की चिंता न करें।" : "Speak the way you normally do—there’s no need to find formal words or speak only in English."}</p></div>

      <div className="mb-5 flex justify-center"><div className="inline-grid grid-cols-2 rounded-xl bg-[#e9efea] p-1"><button onClick={() => setMode("voice")} className={cn("flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-extrabold", mode === "voice" ? "bg-white text-[#17332d] shadow-sm" : "text-[#66766f]")}><Mic className="size-4" />{hi ? "बोलकर" : "By voice"}</button><button onClick={() => setMode("type")} className={cn("flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-extrabold", mode === "type" ? "bg-white text-[#17332d] shadow-sm" : "text-[#66766f]")}><Keyboard className="size-4" />{hi ? "लिखकर" : "By typing"}</button></div></div>

      {mode === "voice" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,.7fr)]">
          <section className="overflow-hidden rounded-[28px] border border-[#d8e2d9] bg-white shadow-[0_24px_70px_#29483d10]">
            <div className="border-b border-[#e0e7e0] p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-lg font-black">{hi ? "1-मिनट का परिचय" : "Your 1-minute introduction"}</h2><p className="mt-1 text-sm text-[#75857f]">{hi ? "पढ़ाई · हुनर · अनुभव · जगह · पसंद का काम" : "Education · skills · experience · location · preferred work"}</p></div><div role="group" aria-label="Recording language" className="flex rounded-xl bg-[#f0f4ef] p-1">{(["hindi", "english", "hinglish"] as CaptureLanguage[]).map((item) => <button key={item} onClick={() => setCaptureLanguage(item)} className={cn("min-h-9 rounded-lg px-3 text-xs font-bold capitalize", captureLanguage === item ? "bg-white text-[#196b4f] shadow-sm" : "text-[#6d7d76]")}>{item === "hindi" ? "हिंदी" : item === "english" ? "English" : "Hinglish"}</button>)}</div></div>
            </div>
            <div className="flex min-h-[350px] flex-col items-center justify-center p-6 text-center sm:p-9">
              <div className={cn("relative grid size-32 place-items-center rounded-full transition", status === "recording" ? "bg-[#e3f0e8]" : "bg-[#eef4ef]")}>
                {status === "recording" && <><span className="absolute inset-0 animate-ping rounded-full border border-[#6ca184] opacity-40" /><span className="absolute -inset-4 animate-pulse rounded-full border border-[#bdd4c4]" /></>}
                <button onClick={status === "recording" ? stopRecording : startRecording} className={cn("relative z-10 grid size-24 place-items-center rounded-full border-[7px] border-white text-white shadow-[0_18px_35px_#196b4f3a] transition hover:scale-105", status === "recording" ? "bg-[#c24f40]" : "bg-[#196b4f]")} aria-label={status === "recording" ? "Stop recording" : "Start recording"}>{status === "recording" ? <Square className="size-8" fill="currentColor" /> : <Mic className="size-10" />}</button>
              </div>
              <p className="mt-5 font-mono text-3xl font-black tracking-tight" aria-live="polite">{formattedTime} <span className="text-base font-semibold text-[#9aa59f]">/ 01:00</span></p>
              <p className="mt-2 text-sm font-semibold text-[#6f8078]">{status === "recording" ? (hi ? "सुन रहे हैं… रोकने के लिए लाल बटन दबाएँ" : "Listening… tap the red button when you’re done") : status === "recorded" ? (hi ? "रिकॉर्डिंग तैयार है" : "Your recording is ready") : (hi ? "तैयार हों तो microphone दबाएँ" : "Tap the microphone when you’re ready")}</p>
              <div className="mt-7 flex h-20 w-full max-w-2xl items-center justify-center gap-[3px] overflow-hidden rounded-2xl bg-[#f5f7f3] px-4" aria-label={status === "recording" ? "Live recording waveform" : "Audio waveform"}>{bars.map((height, index) => <span key={index} className={cn("w-1.5 rounded-full transition-all", status === "recording" ? "animate-wave bg-[#2f8461]" : "bg-[#b2c2b7]")} style={{ height: `${status === "recording" ? height : Math.max(10, height * .48)}%`, animationDelay: `${index * 42}ms` }} />)}</div>
              {audioUrl && <audio className="mt-5 w-full max-w-lg" src={audioUrl} controls aria-label="Recorded introduction" />}
              {error && <div className="mt-5 flex max-w-xl items-start gap-2 rounded-xl bg-[#fff0ed] p-3 text-left text-sm leading-6 text-[#973d35]" role="alert"><AlertCircle className="mt-1 size-4 shrink-0" />{error}</div>}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {(status === "idle" || status === "error") && <Button onClick={startRecording} className="min-h-12 rounded-xl bg-[#196b4f] px-5 font-black"><Mic />{hi ? "बोलना शुरू करें" : "Start speaking"}</Button>}
                {status === "recording" && <Button onClick={stopRecording} className="min-h-12 rounded-xl bg-[#c24f40] px-5 font-black hover:bg-[#aa4135]"><Square fill="currentColor" />{hi ? "रिकॉर्डिंग रोकें" : "Stop recording"}</Button>}
                {status === "recorded" && <><Button onClick={() => onUse(transcript)} className="min-h-12 rounded-xl bg-[#196b4f] px-5 font-black"><Check />{hi ? "इस रिकॉर्डिंग का उपयोग करें" : "Use this recording"}</Button><Button onClick={resetRecording} variant="outline" className="min-h-12 rounded-xl border-[#ced9d0] px-5 font-black"><RotateCcw />{hi ? "दोबारा रिकॉर्ड करें" : "Record again"}</Button></>}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[#d9e2da] bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-black">{hi ? "लाइव लिखाई" : "Live transcription"}</h2><span className="rounded-full bg-[#e9f3e9] px-2.5 py-1 text-[11px] font-black text-[#467441]">{captureLanguage}</span></div><Textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} className="mt-4 min-h-44 resize-none rounded-2xl border-[#dce4dc] bg-[#f8faf7] p-4 text-[15px] leading-7" aria-label="Editable transcript" /><p className="mt-3 text-xs text-[#76867f]">{hi ? "आप इसे बदल सकते हैं। Demo mode में speech-to-text का नमूना दिखाया गया है।" : "You can edit this. Demo mode shows a sample speech-to-text result."}</p></div>
            <div className="rounded-3xl border border-[#eeddb8] bg-[#fff8e9] p-5"><h3 className="flex items-center gap-2 font-black text-[#604d25]"><LockKeyhole className="size-5" />{hi ? "रिकॉर्डिंग सेव नहीं होगी" : "Your recording won’t be stored"}</h3><p className="mt-2 text-sm leading-6 text-[#79683e]">{hi ? "आवाज़ इस session में profile बनने तक रहती है, फिर browser से हटा दी जाती है।" : "Audio stays only in this session until the profile is created, then it is removed from the browser."}</p></div>
            <Button onClick={onDemo} variant="outline" className="min-h-12 w-full rounded-2xl border-[#a9c9b5] bg-[#edf5ef] font-black text-[#196b4f]"><FileAudio />{hi ? "Microphone नहीं चला? Demo profile चलाएँ" : "Mic not working? Try demo profile"}</Button>
          </aside>
        </div>
      ) : (
        <section className="mx-auto max-w-3xl rounded-[28px] border border-[#d8e2d9] bg-white p-6 shadow-[0_24px_70px_#29483d10] sm:p-9"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#e8f2ea] text-[#196b4f]"><Keyboard /></span><div><h2 className="text-lg font-black">{hi ? "अपनी कहानी लिखें" : "Type your story"}</h2><p className="text-sm text-[#74837d]">{hi ? "साधारण भाषा या Hinglish बिल्कुल ठीक है।" : "Plain language or Hinglish is completely fine."}</p></div></div><Textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} className="mt-6 min-h-64 rounded-2xl border-[#d6e0d7] bg-[#f8faf7] p-5 text-base leading-8" /><div className="mt-5 flex flex-col-reverse justify-between gap-3 sm:flex-row"><Button onClick={() => setTranscript("")} variant="ghost" className="min-h-11 rounded-xl text-[#6d7b76]"><Trash2 />{hi ? "साफ़ करें" : "Clear"}</Button><Button disabled={!transcript.trim()} onClick={() => onUse(transcript)} className="min-h-12 rounded-xl bg-[#196b4f] px-6 font-black"><Check />{hi ? "मेरी प्रोफ़ाइल बनाएँ" : "Build my profile"}</Button></div></section>
      )}
    </div>
  );
}
