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

### POST /api/problems/:id/solve (legacy path, work-review contract)
Request `{"requestId":"uuid","provider":"openai"|"gemini"}`. Owner only; `confirmed_text IS NOT NULL`; if a review already exists for that provider return it without consuming quota. The confirmed text must include the problem and the student's attempted work. The model identifies errors and gives a next-step hint; it must not return a full solution or final answer. Output is persisted to `ai_reviews`. The provider is a server-validated enum and resolves to an environment-configured model; the client cannot send arbitrary model IDs.
Response `{ "data": {"problemId":"uuid", "status":"has_errors", "summary":"...", "strengths":["..."], "issues":[{"location":"Dòng tính diện tích","studentWork":"18 + 12 = 30 m²","errorType":"reasoning","explanation":"...","hint":"..."}], "nextStep":"..."}, "requestId":"uuid"}`. Status is one of `correct|has_errors|needs_review|no_attempt`; it remains AI feedback and is not an authoritative grade.

### POST /api/problems/:id/attempts
Request `{"answer":"...cách làm mới...","provider":"openai"|"gemini","requestId":"uuid"}`. Owner only and requires a saved AI review first. The server sends the confirmed original work, the previous feedback/latest retry, and the new answer as three clearly separated inputs. Only the new answer is graded. The client cannot choose `verdict` or assistance level.

The response uses the same formative review shape as `/solve`, with an additional `attemptId`. Each submission is saved to `student_attempts`; `status=correct` maps to `verdict=correct`, `has_errors` maps to `incorrect`, and ambiguous output maps to `needs_review`. A wrong retry must receive another focused hint instead of the final answer.

### GET /api/problems?pageSize=20&cursor=...
History for authenticated student only. The implemented first page accepts `pageSize=1..50` and returns each problem's confirmed text, latest AI review, all saved retry attempts, derived status and timestamps. This powers both the recent sidebar and the expandable chat-history dialog. Do not ship source images as public URLs. Add cursor pagination before histories can exceed the bounded first page.

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
