# Architecture Decision Records

## ADR-001: Nuxt 4 monolith on Vercel — accepted
Reason: low ops overhead, one TypeScript codebase, backend in Nitro. Tradeoff: serverless execution timeout; revisit background queue for expensive, multi-step AI.

## ADR-002: Supabase Postgres + Auth + Storage over Firebase — accepted
Reason: relational teacher/student/classes/history/stats, SQL reporting, Postgres portability. Tradeoff: RLS and SQL migration design requires care.

## ADR-003: Vision OCR + separate solving — accepted
Reason: independent OCR verification prevents solving a misread number; greater education quality. Tradeoff: two model calls, may cost more.

## ADR-004: Do not treat AI answer as student learning result — accepted
Only `student_attempts` is evidence of user submission. Correctness indicator must be derived by validated grading process. Viewing a solution is recorded via `assistance_level`.

## ADR-005: Private storage with signed server access — accepted
Teacher/student sensitive images remain private. Only owner directly reads; teacher access requires active verified class relationship and short-lived server-signed link.

## ADR-006: Atomic DB quota per user/day — accepted
Serverless instances cannot safely maintain shared counters in memory. Use `ai_usage_daily` plus database transaction/RPC. Higher-level billing caps remain needed.

## ADR-007: Enrollment workflow — PENDING
Pilot: teacher staff-assisted enrollment via authenticated protected endpoint after student consent. Production: decide invite token lifecycle and build `class_invites` migration if needed.

## ADR-008: Idempotent AI requests — PENDING for production readiness
Existing `solutions.problem_id UNIQUE` prevents duplicate persisted solutions but cannot alone prevent double provider charges under races. Implement `ai_requests` lock/status/idempotency table before broad launch, or serialize solve job using a DB lock/routine.

## ADR-009: Assistance tracking — PENDING before reliable KPI
Client-supplied `assistance_level` is not trustworthy. Track observed hint/solution reveals in a server-maintained field or interaction log, or label the metric as self-reported and do not use it to grade student independence.

## ADR-010: Privacy/retention/consent — PENDING
School/parent authorization, retention windows, access revocation, data deletion and vendor transfer notice require decision before deploying to minors.

## ADR-011: Formative error review replaces answer generation — accepted
The primary student flow reviews the work already attempted: preserve OCR mistakes verbatim, identify the exact location and type of each error, explain why it needs revision, and provide only the next hint. It must not generate a complete worked solution or final answer. Reviews are stored in `ai_reviews`, separate from the legacy `solutions` table, so model feedback cannot be mistaken for a verified student result. The legacy `/solve` route remains temporarily for client compatibility but returns the review contract.
