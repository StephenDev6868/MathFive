# Deployment runbook — Nuxt 4 + Vercel + Supabase

## Environments
- Local: `.env` from `.env.example`; test credentials, test Supabase project.
- Preview: Vercel preview URLs, **separate non-production Supabase project** preferred; ensure auth callback/redirect links are configured.
- Production: own Supabase project, Vercel project and separate OpenAI key/budget; never re-use test student data.

## Sequence
1. Create Supabase project; choose geographic region compliant with institution's policy and close to users; Auth URL & callback config.
2. Apply SQL migrations in order **once** using Supabase CLI or controlled SQL Editor. Seed topics and staff provisioning.
3. Create private storage bucket and test upload/read restrictions from student A, student B, teacher A.
4. In Vercel create Nuxt project from repository; set public keys and private env vars for each target environment. Verify build output and Nitro API handlers.
5. Run CI `typecheck → lint → unit → build`, plus integration/RLS tests against a disposable DB, E2E smoke on preview.
6. Enable OpenAI spend budgets/alerts, quota settings, log sanitization, backup/restore plan.
7. Validate domain HTTPS and auth redirects, callback, camera in secure context, mobile Safari/Chrome.
8. Production release after privacy & math quality gates; make a rollback plan for app deploy and SQL migration.

## Important billing / runtime
Vercel Hobby is for personal non-commercial usage; organizational/commercial use may require Vercel Pro. Supabase free tiers have capacity and inactivity restrictions. OpenAI calls billed by actual token/image usage; recheck prices in provider console and budget caps at launch.

## Example commands
```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
# With Supabase CLI installed & configured:
supabase db reset
supabase test db
# Deployment may be via Git integration; not necessary to run CLI manually.
```
Commands require their scripts/packages to exist, implemented in M0; do not pretend command ran based on the docs alone.
