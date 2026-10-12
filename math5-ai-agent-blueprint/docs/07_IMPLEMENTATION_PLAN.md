# Implementation plan — 7 vertical milestones

Each milestone needs: plan → minimal code → typed validation → tests → docs update → review. **Do not do all milestones in one giant AI response/PR.**

| Order | Milestone | Scope | Definition of Done |
|---|---|---|---|
| M0 | Repository foundation | Nuxt4 scaffold, Nuxt UI, TypeScript strict, configs, CI, base layout | `build`, `typecheck`, lint, smoke page pass |
| M1 | Supabase & Auth | migrations, local profiles, sign in/out, guarded routes, role provisioning | RLS tests pass; student cannot become teacher |
| M2 | Classes | teacher creates/list class, staff-assisted enrollment, class auth | cross-class isolation tests pass |
| M3 | Upload + OCR | private upload, image preview, recognize endpoint, confirmation editor | wrong/blurred images can be corrected; private access verified |
| M4 | Solve + history | quota atomic, AI solve, structured output, cached solution, student history | token usage saved; duplicate solve doesn't double spend ideally; safe errors |
| M5 | Attempt + teacher stats | student answers, verdict pipeline, class dashboard | teacher sees attempt stats, not AI-answer count; permission tests |
| M6 | Polish & release | mobile UX, tests, observability, documentation, production checks | E2E critical paths green; privacy/cost checklist approved |

## M0: files / implementation steps
- `app/app.vue`, `app/layouts/default.vue`, `app/pages/index.vue`, global colors/typography, shared nav, `nuxt.config.ts`.
- Add `@nuxtjs/supabase`, Nuxt UI, Zod, OpenAI, Vitest, Playwright according to verified docs.
- Add lint, `npm run typecheck`, `npm run test`, `npm run build` scripts, `.env.example`; no real credentials in repo.

## M1: database and authentication
- Apply migrations on test project, seed topics, create test roles. Connect Supabase SSR cookie auth.
- Student signup/signin and logout; teacher account created by admin with role controlled in DB.
- Tests: role escalation, unauthorized 401, stale session, RLS cross-user.

## M2: teacher class management
- Build create/list class and membership API with explicit owner auth. **Decision needed:** staff-assisted enrollment vs invite mechanism; no insecure auto-join.
- Tests: duplicate membership, cross-class read, teacher role spoofing.

## M3: photo OCR flow
- Client camera/file, compression, image quality notice, upload progress; server sees own private object, uses Vision model selected from ENV.
- Editable OCR confirmation; invalid digits highlighted if uncertain; save both OCR and confirmed text.
- Tests: screenshot/photo Vietnamese, fractions, decimals, angled photos, invalid MIME, >5MB, quota.

## M4: AI solution
- Structured Outputs type, timeout/retry, possible arithmetic cross-check, safe rendering, teacher-readable saved solution.
- Build history list/detail pagination, duplicate-click protection and atomic quota. Add persisted idempotency table if retries cause duplicate charges.
- Tests: provider timeout, malformed output, already solved, missing confirmed text, daily quota concurrency.

## M5: student attempt + teacher dashboard
- Answer input, student attempt record; basic deterministic grading only for safe cases, otherwise teacher review endpoint to set verified verdict.
- Teacher stats from `student_attempts` with count of graded-only and hint rate; date filters/pagination.
- Tests: teacher A vs teacher B, ungraded excluded from denominator, zero data state.

## M6: readiness
- Accessibility focus order, contrast, thumb targets, responsive mobile, loading/error/empty screens, minimum meaningful logging.
- CI + E2E critical path; Vercel preview vs prod secrets and Supabase redirect URLs; manual privacy review and spend alerts.

## Task-card template
```text
Task: M3-04 Confirm OCR
Read: AGENTS.md + relevant docs
Input: problemId, confirmedText
Files: ...
Acceptance: own problem only; original OCR preserved; 422 if empty; cannot solve unconfirmed
Tests: owner success, other-user denied, invalid input
Commands: npm run typecheck; npm run test; npm run build
Output: changed files, test summary, risks
```

## Release gate
No launch if cross-account read possible, data deletion/consent unresolved, budget monitoring absent, OCR auto-solves without student confirmation, or math solution quality has not passed evaluation set.
