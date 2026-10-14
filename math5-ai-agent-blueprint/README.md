# Math5 AI — Agent-ready Blueprint (MVP)

> Bộ đặc tả để AI coding agent **lập kế hoạch → triển khai → test → review** ứng dụng hỗ trợ giải Toán lớp 5. Đây là **documentation + SQL migration mẫu**, chưa phải mã nguồn ứng dụng đã chạy.

## Đọc trong 5 phút

- Sản phẩm: học sinh chụp/tải ảnh đề, xác nhận OCR, tự làm/nhận gợi ý/nhận lời giải AI theo bước, xem lịch sử; giáo viên quản lý lớp và xem kết quả thực làm.
- Kiến trúc: **Nuxt 4 fullstack (Nitro)** triển khai **Vercel**, **Supabase Auth + Postgres + private Storage**, **OpenAI Responses API** qua server-only, **Tailwind CSS + Nuxt UI 4**.
- Cách đọc: `AGENTS.md` → `docs/01_PRODUCT_PRD.md` → `docs/02_TECH_STACK.md` → `docs/03_ARCHITECTURE.md` → `docs/04_DATABASE.md` → `docs/05_API_CONTRACTS.md` → `docs/06_SECURITY_PRIVACY.md` → `docs/07_IMPLEMENTATION_PLAN.md` → `docs/08_TEST_PLAN.md`.
- Các quy ước kỹ sư: `.agents/skills/senior-nuxt-engineer/SKILL.md`.
- Prompt khởi động: `PROMPT_START.md` (copy/paste cho Cursor, Claude Code, Codex, Copilot Agent).

## File index

| File | Vai trò |
|---|---|
| `AGENTS.md` | Luật bất biến cho agent, thứ tự đọc, định nghĩa hoàn thành |
| `docs/01_PRODUCT_PRD.md` | Người dùng, use cases, scope, acceptance criteria |
| `docs/02_TECH_STACK.md` | Packages, chọn/bỏ công nghệ, env, version discipline |
| `docs/03_ARCHITECTURE.md` | Mermaid architecture + sequence + source tree Nuxt 4 |
| `docs/04_DATABASE.md` | Mermaid ER diagram, quyền, migration |
| `docs/05_API_CONTRACTS.md` | Endpoints, input/output, lỗi, idempotency |
| `docs/06_SECURITY_PRIVACY.md` | Authentication, authorization, dữ liệu trẻ em, RLS, uploads |
| `docs/07_IMPLEMENTATION_PLAN.md` | Kế hoạch chia 7 milestone, việc cần làm, DoD |
| `docs/08_TEST_PLAN.md` | Test cases, golden cases toán tiểu học, quality gates |
| `docs/09_UI_UX.md` | Giao diện dành cho học sinh lớp 5 + dashboard giáo viên |
| `docs/10_AI_BEHAVIOR.md` | OCR, structured JSON, pedagogical prompting, fallback |
| `docs/11_ADR.md` | Quyết định kiến trúc, tradeoff, điều kiện nâng cấp |
| `docs/12_DEPLOYMENT.md` | Supabase, Vercel, CI/CD, môi trường và rollback |
| `supabase/migrations/*.sql` | SQL schema 7 bảng nghiệp vụ + quota table |
| `.env.example` | Danh sách key không chứa secret thật |

## Tạo ứng dụng mới

```bash
npm create nuxt@latest math5-app
cd math5-app
npx nuxt module add supabase
npm install @nuxt/ui openai zod
# Thêm @nuxt/ui vào nuxt.config.ts theo docs phiên bản cài đặt
# Copy các file docs, AGENTS.md, .agents/, supabase/ và .env.example của pack vào root repo.
```

Migrations chạy tuần tự trên Supabase project **mới**: `20261010_000001_initial.sql`, `20261010_000002_ai_quota.sql`, rồi `20261014_000003_ai_reviews.sql`. Không chạy lặp script initial trên project đang có dữ liệu. Trước production phải chạy test RLS + test chức năng với tài khoản student A / student B / teacher A / teacher B.

## Definition of success

1. OCR không tự thay/đoán con số mờ; học sinh sửa được văn bản trước khi giải.
2. Mỗi bài cho phép nộp đáp án, nhận gợi ý và lời giải từng bước; xem lời giải **không đồng nghĩa làm đúng**.
3. Giáo viên chỉ thấy lớp/học sinh mình được phân quyền.
4. Không tiết lộ API key; chống spam AI; private storage; đủ test tối thiểu.
5. MVP chạy trên Vercel sau khi kiểm thử quyền riêng tư, chất lượng toán, chi phí.

## Nguồn tài liệu chính (kiểm tra cập nhật khi triển khai)

- Nuxt 4: https://nuxt.com/docs/4.x
- Supabase Nuxt: https://supabase.nuxtjs.org/getting-started/introduction
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage security: https://supabase.com/docs/guides/storage/security/access-control
- OpenAI Vision: https://developers.openai.com/api/docs/guides/images-vision
- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- Vercel Nuxt: https://vercel.com/docs/frameworks/full-stack/nuxt
