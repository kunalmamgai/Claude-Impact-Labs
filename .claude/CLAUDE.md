# Claude local project instructions

This repo already has authoritative guidance in [AGENTS.md](../AGENTS.md) and [CLAUDE.md](../CLAUDE.md). Follow those first.

## Project context
- This is BhashaHire, a multilingual job-readiness prototype for candidates and counsellors.
- The product must be conservative and explainable.
- Unknown evidence is not a pass.

## Working rules
- Prefer small, targeted edits over broad rewrites.
- Treat eligibility as a strict gate: missing or unverifiable evidence should not be labelled as eligible.
- If changing matching logic or user-facing eligibility messaging, add a regression test under the lib folder.
- Keep explanations simple, honest, and user-friendly.
- Do not claim completion without verifying the relevant checks.

## Required verification
Before finalizing work, run the smallest relevant checks:
1. `npx tsx --test lib/*.test.ts` for targeted matching/extraction tests
2. `npm run build` for a production compile check

## Repo-specific conventions
- Keep evaluation logic conservative and deterministic.
- Separate three states clearly: met, missing, and needs verification.
- When UI text or recommendation gates change, also update the corresponding user-facing copy.
- Prefer real behavior over mock-only validation.
