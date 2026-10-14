# Math5 UI Asset Kit — Học cùng bạn

Bộ giao diện có thể tích hợp vào **Nuxt 4** từ concept mobile/iPad đã chốt. Đây là **asset kit + component tham khảo**, KHÔNG phải backend AI/OCR hoàn chỉnh. Giao diện hiện có dữ liệu bài toán ví dụ; sự kiện gửi bài do ứng dụng thực tế xử lý.

## Thành phần

- `public/math5/backgrounds/`: 2 hình nền WebP + 1 hình nền SVG responsive, dùng làm trang trí (ảnh concept được phóng to, hơi mềm khi zoom lớn).
- `public/math5/illustrations/`: 6 mascot mèo dạng PNG nền trong suốt được tách từ concept artwork; có thể còn một số viền mềm ở mép.
- `public/math5/decorations/`: 8 SVG trang trí có thể co giãn, và `diagrams/garden-18x12.svg` (hình minh họa Toán lớp 5 sắc nét).
- `app/assets/css/math5-theme.css`: design tokens, màu, cỡ chữ, responsive CSS cho điện thoại/iPad/desktop.
- `app/components/math5/`: component Vue tái sử dụng.
- `app/pages/math5-ui-preview.vue`: trang demo có layout và dữ liệu mẫu, tương tác cục bộ.
- `docs/`: đặc tả, icon mapping, hướng dẫn đưa vào AI agent.
- `preview/`: moodboard gốc làm hình tham chiếu, cùng trang HTML xem giao diện.

## Cài vào Nuxt 4

1. Giải nén bộ kit **vào root repository Nuxt 4** (copy thư mục `public/`, `app/` và `docs/` vào dự án; không ghi đè file hiện có mà chưa so sánh).
2. Cài icons:
   ```bash
   npm install lucide-vue-next
   ```
3. Thêm dòng này vào `nuxt.config.ts` hiện tại:
   ```ts
   css: ['~/assets/css/math5-theme.css'],
   ```
4. Chạy `npm run dev` và mở `/math5-ui-preview`.
5. Tích hợp `PhotoQuestionComposer @submit` vào API Nitro thật (`recognize`/`solve`); cập nhật `WorkReview :review` bằng dữ liệu nhận xét.
6. Kiểm thử trên mobile 360/390/430px, iPad 768/820/1024px, và desktop ≥ 1280px.

### Quan trọng

- Các icon tương tác dùng **Lucide** (SVG render từ Vue), KHÔNG cắt từ screenshot làm nút.
- Cuốn sách, ô nhập, nút bấm, thẻ lời giải là **HTML/CSS**, có thể responsive và đổi nội dung.
- Không coi ảnh mẫu có OCR hoặc câu trả lời AI thực. Khi gắn AI, phải xác nhận văn bản OCR trước khi giải và kiểm tra kết quả bài toán.
- Không đưa API key lên frontend. Server xác thực và kiểm tra hạn mức trước khi gọi AI.
- Khi triển khai thực tế cho trẻ em, đảm bảo dữ liệu riêng tư, quyền truy cập lịch sử, lưu ảnh riêng tư.

## Tên component

| Component | Vai trò | Ghi chú |
|---|---|---|
| `BookSpread.vue` | 2 trang sách iPad, xếp dọc mobile | Slots `question`, `answer` |
| `PhotoQuestionComposer.vue` | **Row 1** camera/upload; **Row 2** chat; nút gửi | Emits `submit({question,image,source})` |
| `WorkReview.vue` | Phát hiện lỗi và gợi ý tự sửa | Prop `review`, `pending` |
| `QuickActions.vue` | Lịch sử, mẹo, lưu, gợi ý | Emits `select(action)` |
| `CatMascot.vue` | Chọn 6 tư thế mèo | Prop `pose` |

Tài liệu chi tiết: `docs/ASSET_MANIFEST.md`, `docs/DESIGN_TOKENS.md`, `docs/AGENT_IMPLEMENTATION_PROMPT.md`.
