# BhashaHire

**From a voice note to a job-ready profile.**

BhashaHire is a PS-4 hackathon prototype for first-generation job seekers in Bhopal and Madhya Pradesh. A candidate speaks naturally for about a minute; the product turns that story into an editable career profile, checks real eligibility rules against a bounded opportunity snapshot, explains every result in plain language, and prepares a bilingual resume and interview pack.

## Product flow

1. **Voice or typed introduction** in Hindi, English, or Hinglish
2. **Career Passport** with editable fields, skill evidence, confidence, and an adaptive clarification
3. **Eligibility-aware shortlist** that separates complete eligibility from relevance
4. **Plain-language requirements** with met, missing, and unknown states
5. **Gap-to-course guidance** for near matches, without promising employment
6. **Bilingual one-page resume** with print/PDF and Web Share support
7. **Role-specific interview preparation** with five model answers and a demo feedback interaction
8. **Job-ready completion pack** plus a lightweight counsellor summary

## Key features

- Functional browser microphone recording using `MediaRecorder`
- Graceful typed-input and deterministic demo fallbacks
- Three distinct candidate personas: Rahul, Pooja, and Imran
- Typed local opportunity and course datasets with a source row on every record
- Reusable, deterministic matching logic that treats unknown evidence as ineligible—not as a pass
- Hindi/English core UI switching across every screen
- Mobile-first navigation and layouts for 375px, 768px, and desktop widths
- Editable extracted profile and skill evidence trail
- Honest separation of practical/informal experience from formal employment
- Printable A4 resume, shareable summary, and counsellor view
- Accessible semantics, focus states, reduced-motion support, and non-colour status labels
- WebMCP actions for starting intake, loading demo candidates, and opening job-ready sections when supported by the browser

## Architecture

```text
app/                         Next.js App Router entry and global styling
components/bhasha/           Product shell and screen-level components
components/ui/               Reusable accessible interface primitives
data/candidates.ts           Deterministic candidate demo profiles
data/opportunities.ts        Bounded jobs, apprenticeships, courses, and questions
hooks/use-bhasha-webmcp.ts   Optional browser agent actions
lib/ai/                      AI provider boundary and reliable mock adapter
lib/matching.ts              Eligibility and relevance assessment
lib/product-types.ts         Shared TypeScript product contracts
```

The frontend keeps candidate/session state in memory and does not create accounts or persist recordings. `lib/ai` exposes a small profile-extraction boundary so a secure server-side Claude adapter can be added later without rewriting product screens. The current build always uses the polished deterministic adapter, so the demo works without an API key or network dependency.

## Tech stack

- Next.js App Router + TypeScript
- React 19
- Tailwind CSS
- Lucide icons
- Radix-based accessible UI primitives
- Cloudflare-compatible Vinext production build

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Production verification:

```bash
npm run build
```

No environment variables are required.

## Demo mode

Use any of the three profile cards on the welcome screen to complete the entire journey without granting microphone access:

- **Rahul Verma** — 12th + ITI Electrician, Bhopal, informal residential wiring exposure
- **Pooja Kushwaha** — 12th + basic computer certificate, practical tuition-centre record keeping
- **Imran Khan** — ITI Fitter, Sehore, supervised workshop exposure

Opportunity, course, and interview outputs change with the selected persona. All listing content is explicitly labelled as a **hackathon demo snapshot**, not live portal data.

## Privacy, fairness, and product boundaries

- Voice is held only in the current browser session and is released after use.
- No application is submitted and no external account is created.
- Caste, religion, and gender are not collected or used for matching.
- Every opportunity and course cites its snapshot source and row ID.
- Unknown requirements do not silently pass eligibility checks.
- Courses are described as possible gap-closing steps, never job guarantees.
- Informal experience is not misrepresented as formal employment.
