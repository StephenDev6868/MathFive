# UI/UX specification — lớp 5 first, teacher second

## Design principles
- Mobile-first student experience, desktop-first teacher dashboard.
- Friendly but not infantile. Spacious typography (~16–18px body), clear question/image previews, large buttons (~44px+ touch), visible focus, high contrast.
- Limited palette: neutral warm background, primary blue/teal, amber for tips, green for verified correctness. Avoid overwhelming gradients, too many cards and gamification.
- Always explain next action in Vietnamese; a clear primary action per view.

## Core screens
1. **/login**: simple login (privacy-aware account provisioning), forgot password / error states.
2. **/student**: CTA "Chụp đề toán" / "Tải ảnh"; recent history; quota remaining.
3. **/student/solve**: 3-step stepper `Ảnh → Xác nhận đề → Tự làm / Hướng dẫn`. Image preview + inline OCR editor; visible "Sửa đề"; no forced instant answer.
4. **/student/history**: search/pagination, date, topic, result badges `Chưa nộp`, `Đúng`, `Chưa chấm` etc.
5. **/teacher**: class selector, 4 metrics with honest denominators, students needing review, activity by week.
6. **/teacher/classes/:id**: roster & each student's submissions within only that class.

## States for each async operation
Idle / uploading / recognizing / needs-edit / confirmed / solving / solved / network-error / quota-exceeded. No infinite skeleton; meaningful progress copy and retry action.

## Accessibility
- Semantic form labels, keyboard, screen reader summary of steps, no color-only correctness, alternate manual text entry, responsive camera fallback, accessible table on mobile.
- Avoid auto-playing media or sensory overload; math equations readable in text (optional KaTeX later if fractions become painful).

## Teacher reporting ethics
- KPI labels: `Bài học sinh đã nộp`, `Tỷ lệ đúng trong bài đã chấm`, `Số lần dùng gợi ý`, `Cần giáo viên xem xét`.
- Do not rank children publicly; no inference of personal intelligence or grades from AI-correctness.
