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

export function BhashaHireApp() {
  const [language, setLanguage] = useState<AppLanguage>("hi");
  const [screen, setScreen] = useState<Screen>("welcome");
  const [captureMode, setCaptureMode] = useState<"voice" | "type">("voice");
  const [profile, setProfile] = useState<CandidateProfile>(demoCandidates[0]);
  const [pendingTranscript, setPendingTranscript] = useState(profile.transcript);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");

  const matches = useMemo(() => getMatches(profile), [profile]);
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

  const start = useCallback((mode: "voice" | "type" = "voice") => {
    setCaptureMode(mode);
    navigate("voice");
  }, [navigate]);

  const startDemo = useCallback((candidate: CandidateProfile) => {
    setProfile(candidate);
    setPendingTranscript(candidate.transcript);
    setSelectedMatchId("");
    navigate("processing");
  }, [navigate]);

  const startDemoById = useCallback((candidateId: "rahul" | "pooja" | "imran") => {
    const candidate = demoCandidates.find((item) => item.id === candidateId) ?? demoCandidates[0];
    startDemo(candidate);
  }, [startDemo]);

  const useRecording = (transcript: string) => {
    setPendingTranscript(transcript);
    navigate("processing");
  };

  const finishProcessing = useCallback(async () => {
    const result = await profileExtractor.extract({ transcript: pendingTranscript, demoCandidateId: profile.id });
    setProfile(result.profile);
    setSelectedMatchId("");
    setScreen("profile");
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
    navigate(next);
  }, [currentMatch, navigate]);

  useBhashaWebMcp({ onStart: start, onDemo: startDemoById, onNavigate: headerNavigate });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_4%,#ffffff_0,#f6f7f2_34%,#eef2eb_100%)] text-[#17332d]">
      <AppHeader language={language} screen={screen} initials={profile.initials} onLanguage={() => setLanguage((value) => value === "hi" ? "en" : "hi")} onNavigate={headerNavigate} />
      <div key={screen} className="animate-screen-in">
        {screen === "welcome" && <WelcomeScreen language={language} onStart={start} onDemo={startDemo} />}
        {screen === "voice" && <VoiceScreen language={language} initialMode={captureMode} onBack={() => navigate("welcome")} onUse={useRecording} onDemo={() => startDemo(demoCandidates[0])} />}
        {screen === "processing" && <ProcessingScreen language={language} onComplete={finishProcessing} />}
        {screen === "profile" && <ProfileScreen language={language} profile={profile} onProfileChange={setProfile} onContinue={() => navigate("matches")} />}
        {screen === "matches" && <MatchesScreen language={language} profile={profile} matches={matches} onOpen={openMatch} onPrepare={prepareMatch} onResume={() => navigate("resume")} />}
        {screen === "detail" && currentMatch && <OpportunityDetailScreen language={language} profile={profile} match={currentMatch} onBack={() => navigate("matches")} onPrepare={() => prepareMatch(currentMatch)} onResume={() => navigate("resume")} />}
        {screen === "resume" && <ResumeScreen language={language} profile={profile} onBack={() => navigate("profile")} onInterview={() => navigate("interview")} onComplete={() => navigate("complete")} />}
        {screen === "interview" && interviewMatch && <InterviewScreen language={language} profile={profile} match={interviewMatch} onBack={() => navigate("matches")} onComplete={() => navigate("complete")} />}
        {screen === "complete" && <CompleteScreen language={language} profile={profile} matches={matches} onMatches={() => navigate("matches")} onResume={() => navigate("resume")} onInterview={() => navigate("interview")} onCounsellor={() => navigate("counsellor")} />}
        {screen === "counsellor" && <CounsellorScreen language={language} profile={profile} matches={matches} onBack={() => navigate("profile")} onResume={() => navigate("resume")} />}
      </div>
    </main>
  );
}
