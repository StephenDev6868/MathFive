---
name: senior-nuxt-engineer
description: Senior/principal engineering standard for Nuxt 4 + Supabase + OpenAI projects, focusing on secure incremental delivery, code review, test quality, pedagogy and cost containment.
---

# Senior Nuxt Engineer Skill

Apply when planning, implementing, reviewing, debugging or refactoring any Math5 feature. First obey `AGENTS.md`, `docs/06_SECURITY_PRIVACY.md`, and `docs/01_PRODUCT_PRD.md`.

## A. Requirements and architecture discipline
1. Clarify acceptance criteria from existing docs; define assumptions and ADR before implementation. Keep incremental vertical slices.
2. Prefer built-in Nuxt 4 and Nitro; no service splitting, state library, ORM, microservices or framework shopping unless measured need.
3. Design typed boundaries and use Zod request/response schemas; keep `server/` modules testable without UI. No deep implicit magic.
4. Optimize for maintenance: simple names, small composables, consistent error handling, meaningful comments *why*, not redundant comments *what*.

## B. Security senior checklist
1. Threat-model untrusted image, unauthenticated clients, forged ids, cross-class queries, prompt injection, retry abuse, public links, vulnerable dependencies.
2. AuthN via verified Supabase session; AuthZ from database membership not front-end role; service-key use is exceptional and guarded.
3. Query scoping, Zod, RLS, private storage, no token logging, not `v-html` for AI content, avoid XSS / SQL injection / mass assignment.
4. Test student A/B and teacher A/B boundary both on API and direct Supabase client; do not rely on UI route guards.

## C. AI and educational quality
1. Two-stage OCR -> editable confirmation -> solve. Preserve OCR exact digits/units, flag uncertainty rather than guessing.
2. Return structured outputs; validate with Zod and reject failures cleanly. Separate inferred AI final answer and student's recorded answer.
3. Keep prompts brief, versioned and free of private data unless required/authorized. Test on golden set of grade-5 problems and actual OCR variation.
4. Measure spend/request and latency; check image size; atomic daily quota and dedupe paid work. Do not blindly retry external calls.

## D. Implementation cadence
**Think → Plan → Implement → Test → Review → Document**.
- For each task supply risk analysis, files touched, test cases, fallback and definition of done.
- Write a small failing test (or demonstrable reproducible case) where useful, then code, then refactor.
- No speculative abstractions. Never refactor unrelated code or overwrite user changes.
- Report test commands, output summary, untested assumptions, and security considerations. Don't claim success with unrun tests.

## E. Review rubric (rank by severity)
- **BLOCKER**: leaked secret, insecure teacher/student read, unsafe public storage, unauthorized write, missing payment quota, high-confidence wrong math from ambiguous OCR.
- **HIGH**: missing schema validation, duplicate expensive calls, poor error handling, incorrect stats from AI solution rather than user submissions.
- **MEDIUM**: architectural coupling, unindexed hot query, poor accessibility, untested edge cases.
- **LOW**: names, formatting, micro-optimizations.
Every review concludes with prioritized actionable fixes.

## F. Output template
```text
Plan + acceptance criteria
Files changed
Implementation summary
Security/privacy impact
Tests executed (actual results)
Known risks / assumptions
Next task
```
