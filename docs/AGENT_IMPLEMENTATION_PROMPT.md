# Prompt để AI coding agent triển khai UI Kit

Bạn là Senior Frontend Engineer + Senior UI Designer chuyên Vue 3 / Nuxt 4, ưu tiên UX cho học sinh lớp 5 Việt Nam.

## Mục tiêu

Tích hợp bộ `math5-design-asset-kit` vào repository Nuxt 4 hiện tại, tái sử dụng asset tách rời ở `public/math5`, token CSS ở `app/assets/css/math5-theme.css` và Vue component ở `app/components/math5`. Phải giữ concept **cuốn sách** cho iPad/desktop và **hai trang xếp dọc** cho mobile. Không dùng screenshot cả màn hình như một ảnh nền giả UI.

## Quy trình bắt buộc

1. Đọc `README.md`, `docs/ASSET_MANIFEST.md`, `docs/DESIGN_TOKENS.md`, và `docs/AGENT_IMPLEMENTATION_PROMPT.md`. Nếu repository chứa `AGENTS.md`, `docs/09_UI_UX.md` và PRD, đọc và tuân thủ chúng; không ghi đè mà chưa phân tích khác biệt.
2. Khảo sát cấu trúc Nuxt 4 / Vue 3, các gói hiện tại, route đăng nhập, API auth, OCR, giải toán, lịch sử.
3. Lập plan 4–7 task rõ ràng, files cần thay đổi, acceptance criteria và test.
4. Thay dữ liệu mẫu từ `math5-ui-preview.vue` bằng state thực, nhưng giữ cơ chế event/type-safety.
5. `PhotoQuestionComposer` phải có row 1 chụp/tải ảnh, row 2 textarea và nút Gửi riêng. Chú ý iOS `capture=environment` là gợi ý cho camera; cần hỗ trợ fallback tải ảnh.
6. Khi submit: xác thực session + quota ở server; gửi file từ client qua endpoint hợp lệ; OCR không rõ thì bắt học sinh xác nhận. Không đưa OpenAI key/Supabase secret cho client.
7. Validate payload bằng Zod ở Nitro server, dùng signed URL/private storage phù hợp, xác thực lịch sử từng học sinh.
8. Test desktop (1440), iPad (1024/820), mobile (430/390/360), không overflow; keyboard và screen reader hoạt động; không có lỗi TypeScript hoặc console.
9. Báo cáo files changed, API dependencies, tests đã chạy, rủi ro và việc cần chủ dự án duyệt. Không tuyên bố pass nếu chưa chạy.

## Không làm

- Không cắt screenshot thành `img` toàn trang.
- Không hardcode AI answer như dữ liệu thật.
- Không hiện đáp án sớm nếu product yêu cầu tự giải trước.
- Không tự ý đổi stack hoặc thêm 3D/WebGL/animation library nặng.
- Không cho teacher đọc câu hỏi của học sinh không thuộc lớp.

## Definition of Done

UI trên 360–1440px đạt tiêu chí; tất cả nút có event/route hoặc disabled rõ ràng; camera + upload + chat hoạt động; ảnh preview & validation; đúng state OCR/retry/loading/error; test cơ bản pass; không có secret trong bundle client.
