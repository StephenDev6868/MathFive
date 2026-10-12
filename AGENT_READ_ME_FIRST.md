# AI coding agent: đọc file này trước

Ngữ cảnh: Đây là bộ asset được tách từ concept minh họa cho app hỗ trợ Toán lớp 5. Mục tiêu là tích hợp vào repo Nuxt 4 hiện có một cách sạch, thay đổi được, và responsive.

1. Đọc `README.md` và `docs/AGENT_IMPLEMENTATION_PROMPT.md`.
2. Đọc `ASSET_MANIFEST.json` để biết chính xác các file có sẵn.
3. Kiểm tra route/API/Auth đang có trong dự án. Không mặc định project trống.
4. Không lấy ảnh screenshot từ `preview/` làm giao diện app. Chỉ lấy mascot, sticker, background độc lập từ `public/math5/`. Dựng nội dung thật bằng Vue/CSS.
5. Copy CSS và 5 component Vue trong `components/math5/` + types. Không ghi đè `nuxt.config.ts` mà chỉ merge `css`.
6. Giữ UX mobile: camera + upload cùng row, chat input row kế, nút gửi row riêng. Book two pages trên iPad, một cột trên mobile.
7. `math5-ui-preview.vue` chỉ minh họa, cần kết nối API thật, OCR xác nhận và auth khi thực thi sản phẩm.
8. Check typecheck, test, build và responsive sau khi tích hợp. Báo cáo trạng thái thật, không tuyên bố kiểm thử khi chưa chạy.
