# Concrete Tech Stack / Dependencies

| Layer | Choice | Why |
|---|---|---|
| Framework | **Nuxt 4**, Vue 3, TypeScript strict | Monolith SSR+API, typed composition |
| API runtime | Nitro / h3 (built into Nuxt), Node runtime on Vercel | No separate Express/Nest server |
| Hosting | Vercel | Git-connected deployment, preview |
| DB | Supabase Postgres | relational grades/classes, SQL analytics |
| Auth | Supabase Auth + `@nuxtjs/supabase` | SSR auth integration and composables |
| File uploads | Supabase Storage (private bucket) | photos separate from DB rows |
| DB access | `@supabase/supabase-js` via Nuxt module, service-side secret restricted | avoid ORM in MVP |
| AI | OpenAI official `openai` Node SDK / Responses API | Vision OCR + step-wise reasoning |
| Validation | Zod | consistent request/response guard |
| UI | Tailwind CSS + **Nuxt UI 4** | fast responsive design without bespoke component system |
| State | Nuxt `useState` + composables | avoid Pinia until real cross-page complexity |
| Icons | Lucide via Nuxt UI | consistent icons |
| Unit tests | Vitest + @vue/test-utils | component + service |
| Nuxt integration tests | `@nuxt/test-utils` if compatible with installed version | server API/pages |
| E2E | Playwright | auth, upload, isolation, teacher dashboard |
| Lint/format | ESLint Nuxt integration + Prettier (one source of truth) | consistency |
| CI | GitHub Actions (or existing GitLab CI) | lint + test + build |
| Analytics | basic first-party aggregate counters; optional Sentry later | privacy-first |

## Version policy
- Create with `npm create nuxt@latest`; confirm Nuxt 4 installed and use Nuxt 4 `app/` layout.
- Use **current stable compatible** dependency releases; commit exact `package-lock.json`; do NOT guess fixed patches in documentation.
- Use a configuration value such as `NUXT_OPENAI_VISION_MODEL`, `NUXT_OPENAI_SOLVE_MODEL`; explicitly choose currently available vision-capable and structured-output-capable models after checking capabilities and prices. Do **not** hard-code price estimates or outdated model names.
- Use Nuxt Supabase **current** publishable key (`NUXT_PUBLIC_SUPABASE_KEY`); keep secret key private. Do not mix obsolete auth APIs without checking installed module's docs.

## Environment contract
```
NUXT_PUBLIC_SUPABASE_URL=
NUXT_PUBLIC_SUPABASE_KEY=
NUXT_SUPABASE_SECRET_KEY=
NUXT_OPENAI_API_KEY=
NUXT_OPENAI_VISION_MODEL=
NUXT_OPENAI_SOLVE_MODEL=
NUXT_AI_DAILY_OCR_LIMIT=20
NUXT_AI_DAILY_SOLVE_LIMIT=15
```
Only `NUXT_PUBLIC_*` can go to browser. Configure Nuxt private `runtimeConfig` for all `NUXT_*` secrets and AI model selectors. **Never log the API key or auth tokens**.

## Do not add now
Firebase, Redis, Prisma/Drizzle, custom OCR microservice, queues, Kubernetes, vector DB, LangChain, third-party telemetry, global chat streaming. Add only when measured constraints require it.

## Cost boundaries
- Vercel Hobby is non-commercial personal use only. Upgrade to appropriate paid plan if school/commercial/paid development use violates terms.
- Free tiers are subject to quotas, dormancy and change; record usage rather than making fixed promises.
- Track AI input/output tokens per solution, count OCR requests, and configure OpenAI organization spend alert/budget; plan an emergency kill switch.
