# Architecture — modular monolith

## System context (Mermaid)

```mermaid
flowchart TD
  S[Học sinh - Mobile/Web] --> UI[Nuxt 4 Frontend]
  T[Giáo viên - Dashboard] --> UI
  UI -->|SSR/session| AUTH[Supabase Auth]
  UI -->|HTTPS| API[Nuxt 4 Nitro server/api on Vercel]
  UI -->|Authenticated & RLS-limited reads| DB[(Supabase Postgres)]
  UI -->|Auth + storage policy| STORAGE[(Supabase Private Storage)]
  API -->|verified auth & permissions| DB
  API -->|trusted ops; secret server only| DBA[(Service-side Supabase access)]
  DBA --> DB
  API -->|server-side Vision + Solutions| AI[OpenAI Responses API]
  API -->|authorized signed-url only| STORAGE
```

## OCR + solve (sequence)

```mermaid
sequenceDiagram
  actor Stu as Học sinh
  participant UI as Nuxt UI
  participant ST as Private Storage
  participant API as Nitro API
  participant DB as Postgres
  participant AI as OpenAI
  Stu->>UI: Chụp / chọn ảnh
  UI->>ST: Upload vào own uid path
  UI->>API: POST /api/problems/recognize {imagePath, requestId}
  API->>API: Verify session, path ownership, type/size, quota
  API->>ST: Retrieve authorized file
  API->>AI: Vision OCR JSON
  AI-->>API: recognizedText, unclearSegments
  API->>DB: Persist draft/recognized
  API-->>UI: editable recognizedText
  Stu->>UI: Sửa và xác nhận đề
  UI->>API: PATCH /api/problems/:id/confirm
  API->>DB: ownership + confirmedText
  Stu->>UI: Tự nộp bài / yêu cầu hướng dẫn
  UI->>API: POST /api/problems/:id/solve
  API->>API: Verify ownership + atomically reserve quota
  API->>AI: Solve confirmed text (structured JSON)
  AI-->>API: Steps, answer, usage
  API->>API: Zod validation + sanity checks
  API->>DB: Save solution & usage
  API-->>UI: Step-by-step answer
```

## Runtime boundaries
- Frontend: presentation, auth navigation, image compression, user-supplied input, permission-aware UX (not security boundary).
- Backend: verified identity, ownership/class checks, all paid AI calls, rate limits, privileged writes, error mapping, signed image access.
- Postgres: relational integrity, RLS, topic seed, quota counters. Never treat Supabase `service_role` as a user identity.
- Storage: private; owner-only direct client upload/read; teachers obtain image preview only through authorized short-lived signed URL issued by server.
- OpenAI: OCR and solving are separate provider calls; never trust model output as raw HTML/SQL/validated proof.

## Nuxt 4 folder convention
```text
app/
  app.vue
  pages/login.vue
  pages/student/index.vue
  pages/student/solve.vue
  pages/student/history.vue
  pages/teacher/index.vue
  pages/teacher/classes/[id].vue
  layouts/default.vue
  components/math/{ImageUploader,OCRReview,SolutionSteps,AnswerForm}.vue
  components/teacher/{ClassSummary,StudentProgress}.vue
  composables/{useProblem,useStudentHistory}.ts
  middleware/auth.ts
  assets/css/main.css
server/
  api/problems/recognize.post.ts
  api/problems/[id]/confirm.patch.ts
  api/problems/[id]/solve.post.ts
  api/problems/[id]/attempt.post.ts
  api/problems/index.get.ts
  api/teacher/classes/index.get.ts
  api/teacher/classes/[id]/students.get.ts
  api/teacher/classes/[id]/stats.get.ts
  api/images/[id].get.ts
  utils/{requireUser,authorize,quota,openai,errors}.ts
shared/
  schemas/{problem,solution,attempt}.ts
  types/api.ts
supabase/migrations/
tests/{unit,integration,e2e}/
nuxt.config.ts
```

## Failure model
Invalid/blur image -> request correction; model timeout -> retry message without leaking error; quota exhausted -> 429; unauthorized -> 403/404; provider unavailable -> 503; invalid model JSON -> retry once if safe then marked failed. Keep images private and preserve any student's confirmed text on failure.
