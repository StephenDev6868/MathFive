# Design system và responsive

## Màu

| Token | HEX | Vai trò |
|---|---|---|
| `--m5-coral` | `#FA604E` | CTA, keyword kết quả |
| `--m5-coral-deep` | `#E84D3A` | trạng thái active |
| `--m5-ink` | `#19345A` | chữ chính |
| `--m5-text` | `#344868` | nội dung |
| `--m5-mint` | `#D9FBF1` | nền tải ảnh |
| `--m5-sky` | `#E3F3FF` | nền bước 1 |
| `--m5-rose` | `#FFE8EC` | nền bước 2 |
| `--m5-sun` | `#FFF0C9` | nền bước 3 |
| `--m5-paper` | `#FFFAF0` | giấy sách |
| `--m5-wood` | `#B7774C` | viền sách |

## Typography

- Tiêu đề: Baloo 2 (Google Fonts, có fallback hệ thống), 22–35 px; điểm nhấn vui nhộn.
- Nội dung: Nunito, 13–17 px tùy viewport, font-weight 650–800.
- Đề toán: chữ dễ đọc, tránh quá nhiều font hoặc màu.
- Công thức / đáp án: nhấn bằng đậm và coral; toán tử + đơn vị cần chính xác.
- Đáp án: số lớn, nhưng không nên hiện trước khi học sinh thử giải nếu flow giáo dục yêu cầu.

## Layout breakpoints

| Viewport | Mô hình |
|---|---|
| `>= 1100px` | Cuốn sách hai trang; tiện ích ở phía trên |
| `768–1099px` | Hai trang iPad rút gọn; font/gap giảm |
| `<= 767px` | Trang hỏi rồi trang lời giải theo chiều dọc; bottom navigation cố định |
| `<= 365px` | Thu gọn một số icon/phụ đề, vẫn 2 nút ảnh ngang hàng |

## Mobile input structure (bắt buộc)

```
ROW 1  [📸 Chụp ảnh bài tập] [🖼️ Tải ảnh lên]
ROW 2  [✏️ Hoặc nhập câu hỏi của bạn........]
ROW 3  [         Gửi cho AI             ]
```

Không ghép input text cùng hàng với nút ảnh trên mobile.

## Trạng thái cần implement sau

- No image / selected image / invalid format / max size.
- Đang nhận diện ảnh / OCR không rõ / học sinh chỉnh sửa đề.
- Đang giải / lời giải thành công / cần hỏi thêm / lỗi mạng / hết quota.
- Lời giải theo bước, gợi ý, tự làm trước khi hiện đáp án.
- Loading skeleton, trạng thái retry, keyboard focus, touch target tối thiểu ~44px.

## Contrast và accessibility

Giữ độ tương phản chữ tốt trên giấy trắng/kem, tránh dùng sắc pastel làm màu chữ nội dung. Không chỉ dùng màu để phân biệt trạng thái. Không nhét ảnh nguyên màn hình vào một thẻ `<img>` để thay UI.
