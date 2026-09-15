"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/bhasha/shared";
import { CompleteScreen } from "@/components/bhasha/complete-screen";
import { CounsellorScreen } from "@/components/bhasha/counsellor-screen";
import { InterviewScreen } from "@/components/bhasha/interview-screen";
import { MatchesScreen } from "@/components/bhasha/matches-screen";
import { OpportunityDetailScreen } from "@/components/bhasha/opportunity-detail-screen";
import { ProcessingScreen } from "@/components/bhasha/processing-screen";
import { ProfileScreen } from "@/components/bhasha/profile-screen";
import { ResumeScreen } from "@/components/bhasha/resume-screen";
import { VoiceScreen } from "@/components/bhasha/voice-screen";
import { WelcomeScreen } from "@/components/bhasha/welcome-screen";
import { demoCandidates } from "@/data/candidates";
import { profileExtractor } from "@/lib/ai";
import { getMatches } from "@/lib/matching";
import type { AppLanguage, CandidateProfile, OpportunityMatch, Screen } from "@/lib/product-types";
import { useBhashaWebMcp } from "@/hooks/use-bhasha-webmcp";
import { getBackendMatches } from "@/lib/backend-client";
import type { AuthSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function BhashaHireApp({ session }: { session: AuthSession }) {
  const router = useRouter();
  const [language, setLanguage] = useState<AppLanguage>("hi");
  const [screen, setScreen] = useState<Screen>(session.role === "counsellor" ? "counsellor" : "welcome");
  const [captureMode, setCaptureMode] = useState<"voice" | "type">("voice");
  const [profile, setProfile] = useState<CandidateProfile>(demoCandidates[0]);
  const [expectedProfile, setExpectedProfile] = useState<CandidateProfile>(demoCandidates[0]);
  const [pendingTranscript, setPendingTranscript] = useState(profile.transcript);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [matches, setMatches] = useState<OpportunityMatch[]>(() => getMatches(profile));
  const [processingError, setProcessingError] = useState("");
  const [sessionStartedAt] = useState(() => Date.now());

  const currentMatch = useMemo(
    () => matches.find((match) => match.opportunity.id === selectedMatchId) ?? matches.find((match) => match.eligible) ?? matches[0],
    [matches, selectedMatchId],
  );
  const interviewMatch = currentMatch?.eligible ? currentMatch : matches.find((match) => match.eligible) ?? currentMatch;

  const navigate = useCallback((next: Screen) => {
    if (next === "detail" && !currentMatch) next = "matches";
    setScreen(next);
  }, [currentMatch]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen]);
  useEffect(() => { document.documentElement.lang = language === "hi" ? "hi" : "en"; }, [language]);
  useEffect(() => {
    let current = true;
    getBackendMatches(profile).then((results) => { if (current && results.length) setMatches(results); }).catch(() => { if (current) setMatches(getMatches(profile)); });
    return () => { current = false; };
  }, [profile]);

  const start = useCallback((mode: "voice" | "type" = "voice") => {
    setCaptureMode(mode);
    navigate("voice");
  }, [navigate]);

  const startDemo = useCallback((candidate: CandidateProfile) => {
    setProfile(candidate);
    setExpectedProfile(candidate);
    setPendingTranscript(candidate.transcript);
    setSelectedMatchId("");
    setProcessingError("");
    navigate("processing");
  }, [navigate]);

  const startDemoById = useCallback((candidateId: "rahul" | "pooja" | "imran") => {
    const candidate = demoCandidates.find((item) => item.id === candidateId) ?? demoCandidates[0];
    startDemo(candidate);
  }, [startDemo]);

  const useRecording = (transcript: string) => {
    setPendingTranscript(transcript);
    setProcessingError("");
    navigate("processing");
  };

  const finishProcessing = useCallback(async () => {
    try {
      setProcessingError("");
      const result = await profileExtractor.extract({ transcript: pendingTranscript, demoCandidateId: profile.id });
      setProfile(result.profile);
      setSelectedMatchId("");
      setScreen("profile");
    } catch (error) {
      setProcessingError(error instanceof Error ? error.message : "Profile extraction failed. Please retry.");
    }
  }, [pendingTranscript, profile.id]);

  const openMatch = (match: OpportunityMatch) => {
    setSelectedMatchId(match.opportunity.id);
    navigate("detail");
  };

  const prepareMatch = (match: OpportunityMatch) => {
    setSelectedMatchId(match.opportunity.id);
    navigate("interview");
  };

  const headerNavigate = useCallback((next: Screen) => {
    if (next === "interview" && !currentMatch) return;
    if (next === "counsellor" && session.role !== "counsellor") return;
    navigate(next);
  }, [currentMatch, navigate, session.role]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  useBhashaWebMcp({ onStart: start, onDemo: startDemoById, onNavigate: headerNavigate });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_4%,#ffffff_0,#f6f7f2_34%,#eef2eb_100%)] text-[#17332d]">
      <AppHeader language={language} screen={screen} initials={profile.initials} session={session} onLanguage={() => setLanguage((value) => value === "hi" ? "en" : "hi")} onNavigate={headerNavigate} onLogout={logout} onChangeRole={() => router.push("/choose-role")} />
      <div key={screen} className="animate-screen-in">
        {screen === "welcome" && <WelcomeScreen language={language} onStart={start} onDemo={startDemo} />}
        {screen === "voice" && <VoiceScreen language={language} initialMode={captureMode} onBack={() => navigate("welcome")} onUse={useRecording} onDemo={() => startDemo(demoCandidates[0])} />}
        {screen === "processing" && <ProcessingScreen language={language} error={processingError} onComplete={finishProcessing} onRetry={finishProcessing} onBack={() => navigate("voice")} />}
        {screen === "profile" && <ProfileScreen language={language} profile={profile} onProfileChange={setProfile} onContinue={() => navigate("matches")} />}
        {screen === "matches" && <MatchesScreen language={language} profile={profile} matches={matches} onOpen={openMatch} onPrepare={prepareMatch} onResume={() => navigate("resume")} />}
        {screen === "detail" && currentMatch && <OpportunityDetailScreen language={language} profile={profile} match={currentMatch} onBack={() => navigate("matches")} onPrepare={() => prepareMatch(currentMatch)} onResume={() => navigate("resume")} />}
        {screen === "resume" && <ResumeScreen language={language} profile={profile} onBack={() => navigate("profile")} onInterview={() => navigate("interview")} onComplete={() => navigate("complete")} />}
        {screen === "interview" && interviewMatch && <InterviewScreen language={language} profile={profile} match={interviewMatch} onBack={() => navigate("matches")} onComplete={() => navigate("complete")} />}
        {screen === "complete" && <CompleteScreen language={language} profile={profile} matches={matches} onMatches={() => navigate("matches")} onResume={() => navigate("resume")} onInterview={() => navigate("interview")} onCounsellor={() => navigate("counsellor")} />}
        {screen === "counsellor" && session.role === "counsellor" && <CounsellorScreen language={language} profile={profile} expectedProfile={expectedProfile} matches={matches} onMatchesChange={setMatches} sessionStartedAt={sessionStartedAt} onBack={() => navigate("profile")} onResume={() => navigate("resume")} />}
      </div>
    </main>
  );
}
