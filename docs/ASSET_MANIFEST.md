# Asset Manifest — Math5

## Hình nền (WebP)

| Đường dẫn trong public | Vai trò | Cách dùng |
|---|---|---|
| `/math5/backgrounds/classroom-window.webp` | Cửa sổ lớp học, cây, bầu trời | Hero/backdrop, phủ gradient fade-out |
| `/math5/backgrounds/study-desk.webp` | Góc học tập pastel với mèo | Trang welcome / trạng thái empty |

**Lưu ý:** Nền được trích từ moodboard nên độ phân giải gốc tương đối nhỏ; không dùng làm nội dung bài toán quan trọng và hạn chế phóng lớn sắc nét.

| `/math5/backgrounds/pastel-classroom.svg` | Phòng học pastel dạng vector | Nền responsive trên màn hình lớn, nét khi zoom |

## Mascot (PNG với alpha)

| Tên file | Dùng ở đâu |
|---|---|
| `/math5/illustrations/mascot-pencil.png` | Hướng dẫn viết bài / animation loading |
| `/math5/illustrations/mascot-reading.png` | Thư viện, mẹo hay |
| `/math5/illustrations/mascot-books.png` | Mèo thò lên cạnh sách, hero |
| `/math5/illustrations/mascot-waving.png` | Chào học sinh |
| `/math5/illustrations/mascot-notes.png` | Sổ tay / lịch sử |
| `/math5/illustrations/mascot-idea.png` | Gợi ý / mẹo học |

Những file PNG này được trích tách từ hình minh họa tổng hợp nên mép có thể còn halo. Đối với kích thước lớn hoặc ấn phẩm chất lượng in, nên tái dựng từng mascot ở độ phân giải cao và không cắt từ UI screenshot.

## SVG minh họa / sticker

- `/math5/decorations/sparkle.svg`: sao lấp lánh
- `/math5/decorations/heart.svg`: trái tim
- `/math5/decorations/cloud.svg`: mây
- `/math5/decorations/leaf-sprig.svg`: lá cây
- `/math5/decorations/sticky-note.svg`: giấy nhắn
- `/math5/decorations/book-badge.svg`: logo sách
- `/math5/decorations/lightbulb-sticker.svg`: bóng đèn gợi ý
- `/math5/decorations/stars-pattern.svg`: pattern sao lặp lại
- `/math5/diagrams/garden-18x12.svg`: sơ đồ bài toán vườn dài 18 m, rộng 12 m, **36 ô minh họa**. Sơ đồ có tính minh họa, không biểu diễn mỗi ô đúng tỷ lệ hình học hoặc dùng làm chứng cứ tính toán.

## Icon Lucide (không export PNG)

| Tính năng | Icon | Library |
|---|---|---|
| Lịch sử chat | `History` | `lucide-vue-next` |
| Mẹo học | `Lightbulb` | `lucide-vue-next` |
| Đã lưu | `Heart` | `lucide-vue-next` |
| Gợi ý | `Zap` | `lucide-vue-next` |
| Chụp ảnh | `Camera` | `lucide-vue-next` |
| Tải ảnh | `ImageUp` | `lucide-vue-next` |
| Gửi | `Send` | `lucide-vue-next` |
| Hồ sơ | `UserRound` | `lucide-vue-next` |
| Thông báo | `Bell` | `lucide-vue-next` |
| Quay lại | `ArrowLeft` | `lucide-vue-next` |
| Trang chủ | `Home` | `lucide-vue-next` |
| Hỏi đáp | `MessageCircleQuestion` | `lucide-vue-next` |

## Thành phần phải dựng bằng code (không dùng ảnh)

- Đóng sách, khung sách hai trang, gáy sách và viền giấy.
- Vùng OCR editable, chat input/textarea.
- Hai nút ảnh trên một hàng, input chat hàng kế tiếp, nút gửi.
- Kết quả AI, chips, step cards, điểm nhấn công thức.
- Bottom navigation, history drawer, modal, toast.

Những thành phần trên cần layout thật, tương tác thật, tập trung/focus/keyboard và thay đổi kích thước.
