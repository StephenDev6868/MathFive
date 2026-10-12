-- SQL schema: MVP AI Toán lớp 5 / Supabase PostgreSQL
-- Chạy một lần trong SQL Editor trên một Supabase project MỚI.
-- Client authenticated chỉ có quyền ĐỌC dữ liệu phù hợp; các thao tác GHI
-- (tạo lớp, tham gia lớp, giải bài, chấm bài) phải đi qua Nuxt Server API.
-- Mọi API sử dụng service_role phải xác thực người dùng và kiểm tra quyền trước.

begin;

create schema if not exists private;
revoke all on schema private from public;

-- 1. Hồ sơ tối giản. Role KHÔNG được người dùng tự thay đổi.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Học sinh'
    check (char_length(display_name) between 1 and 80),
  role text not null default 'student'
    check (role in ('student', 'teacher')),
  created_at timestamptz not null default now()
);

-- 2. Lớp học do giáo viên quản lý.
create table public.classrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  teacher_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- 3. Danh sách học sinh của mỗi lớp (nhiều-nhiều).
create table public.classroom_members (
  classroom_id uuid not null references public.classrooms(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (classroom_id, student_id)
);

-- 4. Chủ đề Toán lớp 5.
create table public.math_topics (
  id bigint generated always as identity primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

-- 5. Đề toán do học sinh nhập/chụp ảnh.
create table public.math_problems (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  topic_id bigint references public.math_topics(id) on delete set null,
  input_type text not null check (input_type in ('image', 'text')),
  image_path text,
  ocr_text text,
  confirmed_text text,
  status text not null default 'draft'
    check (status in ('draft', 'recognized', 'solved', 'failed')),
  created_at timestamptz not null default now(),
  unique (id, student_id)
);

-- 6. Mỗi bài toán có một lời giải AI lưu ở thời điểm tạo.
create table public.solutions (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null unique references public.math_problems(id) on delete cascade,
  steps jsonb not null default '[]'::jsonb
    check (jsonb_typeof(steps) = 'array'),
  final_answer text not null,
  explanation text,
  model_name text,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now()
);

-- 7. Bài làm độc lập. KHÔNG coi việc xem lời giải AI là 'đúng bài'.
create table public.student_attempts (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null,
  student_id uuid not null,
  submitted_answer text not null,
  verdict text not null default 'ungraded'
    check (verdict in ('ungraded', 'correct', 'incorrect', 'needs_review')),
  feedback text,
  assistance_level smallint not null default 0
    check (assistance_level between 0 and 2),
  created_at timestamptz not null default now(),
  foreign key (problem_id, student_id)
    references public.math_problems(id, student_id) on delete cascade
);

create index idx_classrooms_teacher on public.classrooms(teacher_id);
create index idx_classroom_members_student on public.classroom_members(student_id);
create index idx_problems_student_created on public.math_problems(student_id, created_at desc);
create index idx_problems_topic on public.math_problems(topic_id);
create index idx_attempts_student_created on public.student_attempts(student_id, created_at desc);
create index idx_attempts_problem on public.student_attempts(problem_id);

insert into public.math_topics(name) values
 ('Số thập phân'),
 ('Phân số'),
 ('Các phép tính'),
 ('Tỉ số phần trăm'),
 ('Đại lượng và đo đại lượng'),
 ('Hình học'),
 ('Toán có lời văn')
on conflict (name) do nothing;

-- Hồ sơ được tạo khi Supabase Auth tạo user; luôn mặc định là student.
create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, display_name, role)
  values (new.id, 'Học sinh', 'student');
  return new;
end;
$$;

create trigger on_auth_user_created_math5
  after insert on auth.users
  for each row execute function private.create_profile_for_new_user();

-- Giáo viên được nâng role bằng thao tác admin trên máy chủ/Supabase Dashboard.
-- Tuyệt đối không tin role trong user_metadata hay body từ client.

-- Các function kiểm tra quan hệ dùng SECURITY DEFINER trong schema private
-- để không gây vòng lặp RLS giữa classrooms và classroom_members.
create or replace function private.is_teacher_of_class(target_class uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.classrooms c
    where c.id = target_class and c.teacher_id = (select auth.uid())
  );
$$;

create or replace function private.is_student_of_class(target_class uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.classroom_members m
    where m.classroom_id = target_class and m.student_id = (select auth.uid())
  );
$$;

create or replace function private.is_teacher_of_student(target_student uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.classrooms c
    join public.classroom_members m on m.classroom_id = c.id
    where c.teacher_id = (select auth.uid()) and m.student_id = target_student
  );
$$;

-- Đảm bảo không có EXECUTE mặc định cho PUBLIC trên helper functions.
revoke all on function private.create_profile_for_new_user() from public;
revoke all on function private.is_teacher_of_class(uuid) from public;
revoke all on function private.is_student_of_class(uuid) from public;
revoke all on function private.is_teacher_of_student(uuid) from public;
grant usage on schema private to authenticated;
grant execute on function private.is_teacher_of_class(uuid) to authenticated;
grant execute on function private.is_student_of_class(uuid) to authenticated;
grant execute on function private.is_teacher_of_student(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.classrooms enable row level security;
alter table public.classroom_members enable row level security;
alter table public.math_topics enable row level security;
alter table public.math_problems enable row level security;
alter table public.solutions enable row level security;
alter table public.student_attempts enable row level security;

-- Không cấp CRUD tràn lan. Ghi dữ liệu qua backend kiểm tra quyền.
revoke all on table
  public.profiles, public.classrooms, public.classroom_members,
  public.math_topics, public.math_problems, public.solutions,
  public.student_attempts
from anon, authenticated;

grant select on table
  public.profiles, public.classrooms, public.classroom_members,
  public.math_topics, public.math_problems, public.solutions,
  public.student_attempts
 to authenticated;
grant update(display_name) on public.profiles to authenticated;

create policy profiles_read on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_teacher_of_student(id)));

create policy profiles_edit_name on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy classrooms_read on public.classrooms
  for select to authenticated
  using (teacher_id = (select auth.uid()) or (select private.is_student_of_class(id)));

create policy classroom_members_read on public.classroom_members
  for select to authenticated
  using (student_id = (select auth.uid())
    or (select private.is_teacher_of_class(classroom_id)));

create policy topics_read on public.math_topics
  for select to authenticated using (true);

create policy problems_read on public.math_problems
  for select to authenticated
  using (student_id = (select auth.uid())
    or (select private.is_teacher_of_student(student_id)));

create policy solutions_read on public.solutions
  for select to authenticated
  using (exists (
    select 1 from public.math_problems p
    where p.id = problem_id
    and (p.student_id = (select auth.uid())
         or (select private.is_teacher_of_student(p.student_id)))
  ));

create policy attempts_read on public.student_attempts
  for select to authenticated
  using (student_id = (select auth.uid())
    or (select private.is_teacher_of_student(student_id)));

-- Storage: bucket PRIVATE, client chỉ được tải ảnh lên thư mục của chính mình.
-- File path dạng: <auth.uid()>/<uuid>.jpg
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'math-problems', 'math-problems', false, 5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy math_problem_image_upload on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'math-problems'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy math_problem_image_read_own on storage.objects
  for select to authenticated
  using (
    bucket_id = 'math-problems'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;

-- SAU KHI CHẠY:
-- 1. Tạo user giáo viên bằng Supabase Auth rồi nâng role thủ công:
--    update public.profiles set role='teacher' where id='<AUTH_USER_UUID>';
-- 2. API server (service_role) phải kiểm tra role giáo viên + sở hữu lớp
--    trước khi thêm học sinh, trả danh sách hoặc cấp signed URL.
-- 3. API server xác minh JWT bằng auth.getUser() hoặc serverSupabaseUser(),
--    tuyệt đối không tin student_id/teacher_id do trình duyệt tự gửi.
-- 4. Giới hạn lượt AI bằng transaction/counter nguyên tử ở backend;
--    giới hạn này chưa được tạo trong SQL để schema MVP được gọn.
-- 5. Rà soát chính sách giữ/xóa dữ liệu trẻ em và test phân quyền chéo.
