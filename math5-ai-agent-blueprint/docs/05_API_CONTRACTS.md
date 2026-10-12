# API contracts — /api/* (JSON over HTTPS)

All endpoints except login/callback require valid Supabase server-side verified user identity. JSON validated by Zod in `shared/schemas`. Every write requires ownership/class permission. Do not expose backend Supabase secret to client.

## Common response
- Success `{ data: T, requestId: string }`; pagination where relevant `{data: T[], pageInfo: { nextCursor: string|null }}`.
- Failure `{ error: { code: string, message: string, requestId: string } }` with `400 INVALID_INPUT`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT`, `413 IMAGE_TOO_LARGE`, `422 OCR_NEEDS_REVIEW`, `429 QUOTA_EXCEEDED`, `503 MODEL_UNAVAILABLE`. Never return raw model or SQL exceptions to UI.
- Timestamp ISO 8601, DB UUID as strings, no `any`.

## Student

### POST /api/problems/recognize
Request:
```json
{"imagePath":"<authenticated-uid>/<file-uuid>.jpg","requestId":"client-generated-uuid"}
```
Checks: user authenticated student; `imagePath` starts with authenticated uid; object exists in private bucket, allowed MIME/size; duplicate `requestId` handled idempotently; atomically reserves OCR quota **once**, no unrestricted external image URL. Server downloads image or sends short-lived trusted URL to Vision. Response:
```json
{"data":{"problemId":"uuid","ocrText":"Một cửa hàng...","unclearSegments":[],"status":"recognized"},"requestId":"uuid"}
```
If confidence/clarity insufficient, force manual correction. Preserve source image path.

### PATCH /api/problems/:id/confirm
Request `{"confirmedText":"..."}`. Owner only. Trims/validates length 10–5000 chars; nonempty, no model solve until confirmed; return updated problem. Do not overwrite original `ocr_text`.

### POST /api/problems/:id/solve
Request `{"requestId":"uuid"}`. Owner only; `confirmed_text IS NOT NULL`; if solution already exists return cached solution and do **not** consume quota again. Atomic solve quota reserve, OpenAI structured solution. Validate `steps` array, finalAnswer nonempty, units, reasonable size; output persisted to `solutions`.
Response `{ "data": {"problemId":"uuid", "steps":[{"title":"Bước 1","explanation":"...","calculation":"..."}], "finalAnswer":"...", "isVerified":false}, "requestId":"uuid"}`. `isVerified` is conservative unless deterministic check passed.

### POST /api/problems/:id/attempt
Request `{"submittedAnswer":"90 kg"}`. Owner only. Assistance level must be derived by server from observed interactions (or explicitly reported as unverified), never accepted as an authoritative client-reported score. Store as `ungraded` initially. `verdict` can be set to `correct/incorrect` **only** via reliable grading pipeline; ambiguous answers -> `needs_review`. Do not let client choose verdict.

### GET /api/problems?pageSize=20&cursor=...
History for authenticated student only. Return minimal list (problemId, preview, createdAt, status, hasSolution, latestAttemptVerdict); do not ship full source images as public URLs.

### GET /api/problems/:id
Owner or authorized teacher. Returns problem, solution, attempts; signed image URL only through separate server route after same permission check.

## Teacher
- `GET /api/teacher/classes` own class list.
- `POST /api/teacher/classes` body `{ name }`, authenticated `role=teacher` from DB.
- `GET /api/teacher/classes/:id/students` teacher owns class; pagination.
- `GET /api/teacher/classes/:id/stats?from=YYYY-MM-DD&to=YYYY-MM-DD` aggregated counts: `problems_count`, `attempts_graded`, `correct_count`, `hinted_attempts`, `needs_review`, `active_students`. No claim of learning performance if no graded attempts.
- `POST /api/teacher/attempts/:id/review` with `{ "verdict": "correct"|"incorrect", "feedback": "..." }`. Teacher must have active ownership of a class containing that attempt's student. This is the authoritative human-review path for ambiguous/ungraded submissions. For simple numeric answers, a deterministic checker may propose verdict but must normalize units and equivalent fractions; otherwise mark `needs_review`.
- Staff-assisted membership writes: `POST /api/teacher/classes/:id/students` body `{ studentId }`, teacher ownership verified, student role validated. For production, replace with invited/consented join flow as policy requires.

## Abuse/race/idempotency
- `requestId` should be backed by **persisted operation idempotency** (recommended `ai_requests` table when implementing robust retry), not just in-memory map in serverless functions. If not yet implemented, client must prevent double-submit and backend return existing `solution` instead of duplicate charges where possible; flag remaining risk in checklist.
- `ai_usage_daily` reservation is atomic across concurrent functions; service-side secret cannot be accessed by student clients.
- Use scoped limits per user; add basic IP throttling only as supplemental (not identity substitute).
