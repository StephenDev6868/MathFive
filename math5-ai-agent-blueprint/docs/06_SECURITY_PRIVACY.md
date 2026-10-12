# Security & child-data privacy — non-negotiable

## Authorization checklist
- Resolve actual user via Supabase verified auth server-side, not userId/role fields in request or untrusted JWT decoding alone.
- For student endpoints: assert `problem.student_id === sessionUser.id`.
- For teacher endpoints: assert `role=teacher` in database, `classroom.teacher_id === sessionUser.id`, and membership of each child before returning stats/attempts/images.
- Query using both exact requested ID and authorization scope; return 404 for objects not visible to avoid ID enumeration.
- `service_role` / secret key bypasses RLS: use only server side in minimal functions with explicit assertions, documented tests and least privilege. All browser database reads remain protected by RLS.
- Disable direct arbitrary writes to exposed Postgres tables; role assignment controlled through admin workflow, never normal signup.

## File / image protection
- Private storage bucket, not public. Student path `<userId>/<uuid>.<ext>`, ownership policy and MIME checks; validate actual content/size (not only filename or Content-Type claim).
- If teacher previews image: server checks class relationship before short-lived signed URL. Avoid logging Storage signed URLs.
- Strip metadata / EXIF if possible; client compresses large image, but server remains authority on limits.
- Restrict uploads to JPEG/PNG/WebP, 5 MB maximum and reject SVG/HTML/polyglots where possible.

## AI / prompt injection
- OCR image may contain malicious instructions as text. Treat all image/text data as **untrusted student input**, not developer/system instruction. Never allow content to change system behavior or expose hidden prompts/secrets.
- OpenAI secret only on server; structured output decoded then Zod validated; reject overlong/malformed JSON, sanitize rendered content; render Markdown with safe subset or plain text, never `v-html` from AI.
- Timeout/provider failure / quota exhaustion should not leak personal information.
- Put `requestId`, `model`, `token_usage`, status in logs; do not log entire uploaded homework, user tokens or legal name.

## Privacy by design
- Data subjects are children. Use display names/pseudonyms; collect no birthdate/phone/address by default; configure legal consent/parent or school authorization before public release.
- Establish documented retention: e.g. pilot 30 days images / 12 months derived learning records **only if legally approved**. Provide authorized deletion/export requests and cascading deletion policy.
- Keep accounts private; no public ranking; no ads/trackers in MVP; data transfer to AI provider must be included in the privacy notice.
- Access for teachers limited to current verified class membership; design revocation behavior when student leaves class (teacher no longer sees historical activity unless policy explicitly permits).

## Critical tests
1. Student A cannot view/edit student B's problem, attempt or image.
2. Teacher A cannot access teacher B's classroom members/images/stats, even with guessed ID.
3. Student cannot escalate `role` or add themselves to arbitrary classes.
4. Client cannot consume OpenAI bypassing server quota.
5. Fake Supabase cookie/token denied; invalid MIME/oversized file rejected.
6. OCR prompt-injection instructions ignored and not interpreted as app commands.
7. RLS tests for all `anon`, authenticated user variations and service-side helpers.

## Operational caveat
This document is engineering guidance, not legal advice. Before deploying to schools, confirm applicable children's privacy rules, terms of service, retention, hosting-region and guardian/school consent requirements with appropriate advisors.
