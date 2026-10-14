-- Formative AI feedback: detect and explain student errors without storing a model answer.
-- Run after 20261010_000001_initial.sql and 20261010_000002_ai_quota.sql.
begin;

create table public.ai_reviews (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null unique references public.math_problems(id) on delete cascade,
  status text not null check (status in ('correct', 'has_errors', 'needs_review', 'no_attempt')),
  summary text not null check (char_length(summary) between 1 and 500),
  strengths jsonb not null default '[]'::jsonb check (jsonb_typeof(strengths) = 'array'),
  issues jsonb not null default '[]'::jsonb check (jsonb_typeof(issues) = 'array'),
  next_step text not null check (char_length(next_step) between 1 and 500),
  model_name text,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now()
);

alter table public.ai_reviews enable row level security;
revoke all on public.ai_reviews from anon, authenticated;
grant select on public.ai_reviews to authenticated;

create policy ai_reviews_read on public.ai_reviews
  for select to authenticated
  using (exists (
    select 1 from public.math_problems p
    where p.id = problem_id
      and (p.student_id = (select auth.uid())
        or (select private.is_teacher_of_student(p.student_id)))
  ));

alter table public.math_problems drop constraint math_problems_status_check;
alter table public.math_problems add constraint math_problems_status_check
  check (status in ('draft', 'recognized', 'reviewed', 'solved', 'failed'));

commit;

-- Ask PostgREST to refresh immediately after applying this migration in SQL Editor.
notify pgrst, 'reload schema';
