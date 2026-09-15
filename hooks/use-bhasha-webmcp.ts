"use client";

import { useEffect } from "react";
import type { Screen } from "@/lib/product-types";

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

function asRecord(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Input must be an object.");
  return input as Record<string, unknown>;
}

export function useBhashaWebMcp({ onStart, onDemo, onNavigate }: { onStart: (mode: "voice" | "type") => void; onDemo: (candidateId: "rahul" | "pooja" | "imran") => void; onNavigate: (screen: Screen) => void }) {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Tool) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* Unsupported preview implementation. */ }
    };

    register({
      name: "start_profile_intake",
      title: "Start profile intake",
      description: "Open BhashaHire's voice or typed introduction step so the candidate can begin a career profile.",
      inputSchema: { type: "object", properties: { mode: { type: "string", enum: ["voice", "type"] } }, required: ["mode"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) { const mode = asRecord(input).mode; if (mode !== "voice" && mode !== "type") throw new Error("mode must be voice or type"); onStart(mode); return { screen: "voice", mode }; },
    });
    register({
      name: "load_demo_candidate",
      title: "Load demo candidate",
      description: "Load one of the three deterministic hackathon candidate profiles and begin profile processing.",
      inputSchema: { type: "object", properties: { candidateId: { type: "string", enum: ["rahul", "pooja", "imran"] } }, required: ["candidateId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) { const candidateId = asRecord(input).candidateId; if (candidateId !== "rahul" && candidateId !== "pooja" && candidateId !== "imran") throw new Error("Unknown demo candidate"); onDemo(candidateId); return { screen: "processing", candidateId }; },
    });
    register({
      name: "open_job_ready_section",
      title: "Open job-ready section",
      description: "Navigate to a completed BhashaHire section for the active candidate session.",
      inputSchema: { type: "object", properties: { destination: { type: "string", enum: ["profile", "matches", "resume", "interview", "complete", "counsellor"] } }, required: ["destination"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) { const destination = asRecord(input).destination; const allowed: Screen[] = ["profile", "matches", "resume", "interview", "complete", "counsellor"]; if (typeof destination !== "string" || !allowed.includes(destination as Screen)) throw new Error("Unknown destination"); onNavigate(destination as Screen); return { screen: destination }; },
    });

    return () => lifecycle.abort();
  }, [onDemo, onNavigate, onStart]);
}
