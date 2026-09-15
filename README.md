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
8. **Job-ready completion pack** plus a counsellor review-and-override dashboard

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
- Google OAuth with a signed, HTTP-only session and post-verification user/counsellor role choice
- Counsellor controls to approve, reorder, or reject shortlist items and import validated CSV snapshots
- Server-side profile extraction, hard-eligibility matching, PDF generation, interview prep, health and pilot metrics APIs
- Accessible semantics, focus states, reduced-motion support, and non-colour status labels
- WebMCP actions for starting intake, loading demo candidates, and opening job-ready sections when supported by the browser

## Architecture

```text
app/                         Next.js App Router entry and global styling
components/bhasha/           Product shell and screen-level components
components/ui/               Reusable accessible interface primitives
data/candidates.ts           Deterministic candidate demo profiles
data/opportunities.ts        Frontend demo opportunity contracts
data/snapshots/              CSV opportunity and course snapshots used by the backend
hooks/use-bhasha-webmcp.ts   Optional browser agent actions
lib/ai/                      Server-backed profile extraction adapter
lib/backend/                 Validation, CSV, auth-independent matching, metrics and adapters
lib/product-types.ts         Shared TypeScript product contracts
```

Candidate work stays in the current session and voice recordings are never sent to or retained by the backend. The backend uses the configured OpenAI-compatible LLM endpoint when available and otherwise uses a conservative deterministic extractor. Hard eligibility and scoring are always deterministic and reproducible from the same profile and CSV snapshot.

## Tech stack

- Next.js App Router + TypeScript
- React 19
- Tailwind CSS
- Lucide icons
- Radix-based accessible UI primitives
- Cloudflare-compatible Vinext production build
- Next.js route handlers for OAuth and backend APIs
- Zod validation and PDFKit resume output

## Run locally

Requires Node.js 22.13 or later.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

For a no-credential local walkthrough, set `AUTH_DEMO_MODE=true`. Real Google sign-in requires an OAuth web client with this authorised redirect URI:

```text
http://localhost:5173/api/auth/google/callback
```

Set a long random `AUTH_SECRET`. Keep `GOOGLE_CLIENT_SECRET`, `LLM_API_KEY`, and `ADMIN_API_KEY` out of Git.

Production verification:

```bash
npm run build
```

## Backend API

Health check:

```bash
curl http://localhost:5173/api/health
```

Extract a Hindi/Hinglish transcript:

```bash
curl -X POST http://localhost:5173/api/profile/extract -H "Content-Type: application/json" -d "{\"transcript\":\"Maine 12th pass kiya hai aur Bhopal mein retail billing aur stock ka kaam kiya hai.\"}"
```

Match a structured profile:

```bash
curl -X POST http://localhost:5173/api/matches -H "Content-Type: application/json" -d "{\"profile\":{\"location_city\":\"Bhopal\",\"location_state\":\"Madhya Pradesh\",\"education\":[{\"level\":\"12th\"}],\"certifications\":[],\"skills\":[\"billing\",\"stock management\",\"customer handling\"],\"work_experience\":[],\"languages\":[\"Hindi\"],\"availability\":{},\"constraints\":{}},\"options\":{\"max_results\":6}}"
```

Generate a resume PDF by posting the same `profile` shape plus `"language":"bilingual"` to `/api/resume/generate`. Generate interview questions by posting `profile`, a returned `opportunity`, and `language` to `/api/interview/generate`.

Counsellors can upload a snapshot through the dashboard. Scripted imports may use the admin key:

```bash
curl -X POST http://localhost:5173/api/admin/import-csv -H "x-admin-api-key: change-me" -F "type=opportunities" -F "file=@data/snapshots/opportunities.csv"
```

The CSV files contain fake but realistic hackathon records. There is no live scraping, account creation, or automatic application workflow.

## Demo mode

Use any of the three profile cards on the welcome screen to complete the entire journey without granting microphone access:

- **Rahul Verma** — 12th + ITI Electrician, Bhopal, informal residential wiring exposure
- **Pooja Kushwaha** — 12th + basic computer certificate, practical tuition-centre record keeping
- **Imran Khan** — ITI Fitter, Sehore, supervised workshop exposure

Opportunity, course, and interview outputs change with the selected persona. All listing content is explicitly labelled as a **hackathon demo snapshot**, not live portal data. The counsellor role opens directly into the pilot dashboard; the user role opens the seeker journey.

## Privacy, fairness, and product boundaries

- Voice is held only in the current browser session and is released after use.
- No application is submitted and no external account is created.
- Caste, religion, and gender are not collected or used for matching.
- Every opportunity and course cites its snapshot source and row ID.
- Unknown requirements do not silently pass eligibility checks.
- Courses are described as possible gap-closing steps, never job guarantees.
- Informal experience is not misrepresented as formal employment.
