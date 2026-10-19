# Nhập danh sách khối 5

## Rà soát nguồn

- Nguồn `DSHS lớp 5.xlsx` có một sheet, 319 học sinh của Trường Tiểu học Bùi Thị Xuân, phân bố 7 lớp: 5/1 (46), 5/2 (46), 5/3 (43), 5/4 (46), 5/5 (47), 5/6 (47), 5/7 (44).
- Không có dòng/cột giáo viên chủ nhiệm. Vì vậy không thể gán giáo viên cho lớp một cách đáng tin cậy từ file này. `gvcn-mapping.csv` phải được hoàn thiện trước khi provisioning; chương trình sẽ dừng nếu thiếu hoặc có hơn một GVCN cho một lớp.
- Cột giới tính có một lỗi nhập liệu: `Nam'` ở học sinh TT 77. Cột này không được import vì không cần thiết cho đăng nhập, phân quyền hay dashboard MVP và giảm thu thập dữ liệu trẻ em.
- Có 6 username cơ sở bị trùng. Username đầu tiên giữ đúng quy tắc `tên + chữ cái đầu các phần trước`; tài khoản trùng thêm hậu tố `2` để vẫn duy nhất.

## Cách chạy

1. Áp dụng migration `20261019_000005_school_roster_import.sql` sau các migration trước đó.
2. Hoàn thành `private-delivery/gvcn-mapping.csv` (tệp này không được Git theo dõi). Mỗi lớp phải có đúng một giáo viên, và teacher có thể phụ trách nhiều lớp với `class_codes` ngăn cách bằng `;`.
3. Chạy script bằng service-role key ở môi trường quản trị, không phải trình duyệt:

```sh
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-school-roster.mjs \
  --students private-delivery/dshs-lop-5-credentials.csv \
  --teachers private-delivery/gvcn-mapping.csv
```

Script dùng Admin API (không ghi trực tiếp `auth.users`), tạo/cập nhật `profiles`, tạo 7 lớp với `external_key` ổn định, và upsert membership theo đúng `class_code`. Lặp lại an toàn với cùng dữ liệu. Nếu đã chạy migration `20261019_000005` trước khi có bản sửa này, hãy chạy thêm `20261019_000006_fix_classroom_external_key_upsert.sql` trước khi chạy script import lại.

## Username, mật khẩu và dashboard

- Username là ASCII, không dấu. Ví dụ `Nguyễn Văn Công` thành `congnv`; trùng thì thành `congnv2`.
- Mật khẩu ban đầu là tám chữ số ngẫu nhiên, có trong bảng bàn giao riêng. Migration và Git không chứa mật khẩu rõ. Mọi tài khoản được đánh dấu `must_change_password=true`; cần bổ sung luồng đổi mật khẩu bắt buộc trước khi đưa vào sử dụng chính thức.
- Đăng nhập Supabase vẫn dùng định danh email nội bộ `<username>@accounts.math5.local`. Giao diện phải nhận username và chuyển đổi định danh này ở client; không hiển thị email nội bộ cho học sinh.
- Bảng `user_activity_events` lưu fact sự kiện tối thiểu cho dashboard. Chỉ server đã xác thực được ghi, metadata không chứa PII/nội dung bài làm; cần ghi `login_success` sau đăng nhập và các event học tập tại endpoint tương ứng.

## Kiểm tra sau import

```sql
select c.class_code, c.teacher_id, count(m.student_id) as students
from public.classrooms c
left join public.classroom_members m on m.classroom_id = c.id
where c.external_key like 'btx-%'
group by c.id, c.class_code, c.teacher_id
order by c.class_code;

select role, count(*) from public.profiles
where username is not null group by role order by role;
```

Kỳ vọng: 7 lớp có GVCN, tổng 319 memberships, 319 profiles student và số profiles teacher đúng mapping đã cung cấp.
