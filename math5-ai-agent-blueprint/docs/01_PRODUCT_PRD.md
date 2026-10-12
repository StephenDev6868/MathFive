# Product Requirements — AI Toán lớp 5

## Product vision
Ứng dụng tiếng Việt hỗ trợ học sinh tiểu học **hiểu cách giải** Toán lớp 5 qua ảnh đề bài, hướng dẫn từng bước, đánh giá bài tự làm; giáo viên nắm hoạt động và kết quả học sinh theo lớp.

## Personas
- **Student**: tài khoản do phụ huynh/nhà trường hỗ trợ khởi tạo; chụp ảnh/tải ảnh, xác nhận đề, tự làm, gợi ý, xem lời giải, lịch sử.
- **Teacher**: tạo lớp, cấp mã mời, xem danh sách học sinh trong lớp, xem số bài giải, tỷ lệ kết quả **tự làm**, các lỗi thường gặp.
- **Admin (vận hành, ngoài giao diện MVP)**: duyệt/tạo tài khoản giáo viên và hỗ trợ xử lý dữ liệu; không phát triển dashboard admin trong MVP.

## P0 features và acceptance criteria

### F1 Authentication + class membership
- Student/teacher sign in/out; phân quyền dựa trên `profiles.role` DB; teacher role chỉ do admin provisioning.
- Teacher tạo lớp; student tham gia lớp **bằng mã mời có hết hạn / quyền từ server** (cơ chế mã mời cần schema bổ sung trước khi implement; phương án MVP tối giản là giáo viên nhập danh sách và admin thêm membership qua server trong pilot). Không tự tạo teacher từ form.
- Student A không đọc được student B; Teacher A không đọc Teacher B's lớp.

### F2 Upload → OCR → confirmation
- Chụp ảnh từ mobile hoặc tải JPG/PNG/WebP; tối đa 5 MB, nén ở client trước upload nếu cần.
- Ảnh nằm trong private bucket `math-problems` dưới `<user_uid>/<uuid>.jpg`; metadata trong Postgres.
- OCR trả văn bản và danh sách điểm chưa rõ. Nếu OCR kém/thiếu đề, hiển thị trạng thái `needs_confirmation` ở UI (DB lưu `recognized` cho tới khi confirmed_text được gửi).
- Student phải nhìn lại, sửa và **ấn Xác nhận đề** trước khi `solve`.

### F3 Solve + pedagogy
- Student nhập đáp án trước hoặc xin gợi ý; tối thiểu các mức trợ giúp: `0: no hint`, `1: hint`, `2: viewed solution`.
- Giải từng bước bằng tiếng Việt phù hợp Toán lớp 5, có phép tính và đơn vị; cảnh báo ảnh thiếu/sai đề; không bịa thêm dữ kiện.
- Trả về structured JSON và kiểm tra schema. Lỗi model phải được hiển thị thân thiện; có retry idempotent có hạn mức.

### F4 History
- Student xem list theo thời gian, mở lại đề xác nhận, lời giải và bài nộp. Có trạng thái OCR/solved/failed.
- Chỉ xem lịch sử của chính mình; teacher chỉ thấy học sinh trong lớp thuộc quyền.

### F5 Teacher dashboard
- Danh sách lớp và học sinh; tổng số bài trong kỳ, số lượt nộp, tỷ lệ đúng của những bài đã được chấm, tỷ lệ sử dụng gợi ý.
- Giáo viên có thể xác nhận đúng/sai cho bài `ungraded/needs_review` thuộc học sinh trong lớp; phép tính đơn giản có thể chấm tự động chỉ khi bộ kiểm tra đáng tin cậy.
- Cột `ungraded/needs_review` không tính là đúng; phân biệt **AI solution** và **student attempt**.
- Dashboard xử lý trường hợp chưa có dữ liệu và lớp có ít học sinh.

## Out of scope (P1/P2)
Payments, chat realtime liên tục, bảng xếp hạng công khai, bài giảng/video AI, tuyển sinh, OCR offline, vector database, gamification, trợ giảng giọng nói, ứng dụng native, phụ huynh dashboard, chấm điểm phức tạp, đa môn/lớp.

## Product metrics
- OCR correction rate (bao nhiêu đề cần sửa), giải thành công, tỷ lệ timeout, median latency, ước tính chi phí/bài.
- Learning: attempted count, independently correct rate, hint usage; **không** lấy số lời giải AI làm chất lượng học tập.
- Error/privacy: count 403 cross-user attempts, RLS violations (không log PII), failure rate.

## Open questions before a real school launch
Ai tạo student accounts? Cơ chế cấp mã lớp? Chính sách consent của phụ huynh/nhà trường? Thời gian lưu ảnh? Có cần teacher export dữ liệu? Không bịa quyết định; ghi lại tại `docs/11_ADR.md` và chặn sản xuất nếu chưa giải quyết.
