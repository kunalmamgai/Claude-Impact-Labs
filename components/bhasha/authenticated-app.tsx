"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { BhashaHireApp } from "@/components/bhasha/bhasha-hire-app";
import type { AuthSession } from "@/lib/auth";

export function AuthenticatedApp() {
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ session: AuthSession | null }>)
      .then((result) => {
        const authenticated = (result as { session: AuthSession | null }).session;
        if (!authenticated) window.location.replace("/login");
        else if (!authenticated.role) window.location.replace("/choose-role");
        else setSession(authenticated);
      })
      .catch(() => window.location.replace("/login?error=session_check_failed"));
  }, []);

  if (!session) return <main className="grid min-h-screen place-items-center bg-[#f4f6f1] text-[#196b4f]"><LoaderCircle className="size-9 animate-spin" aria-label="Checking sign-in" /></main>;
  return <BhashaHireApp session={session} />;
}
