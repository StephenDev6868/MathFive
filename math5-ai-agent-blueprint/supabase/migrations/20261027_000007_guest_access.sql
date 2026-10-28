-- Server-provisioned guest sessions receive at most 10 new questions in total.
-- Run after the initial profile migration.
begin;

create table if not exists public.guest_question_usage (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now()
);

alter table public.guest_question_usage enable row level security;
revoke all on public.guest_question_usage from anon, authenticated;

create or replace function public.consume_guest_question_quota(
  p_student_id uuid,
  p_limit integer default 10
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  current_used integer;
begin
  if p_student_id is null or p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'invalid guest quota reservation parameters';
  end if;

  insert into public.guest_question_usage (student_id, used, updated_at)
  values (p_student_id, 1, now())
  on conflict (student_id)
  do update set used = public.guest_question_usage.used + 1,
                updated_at = now()
  where public.guest_question_usage.used < p_limit
  returning used into current_used;

  if current_used is null then
    return -1;
  end if;
  return greatest(p_limit - current_used, 0);
end;
$$;

revoke all on function public.consume_guest_question_quota(uuid, integer) from public;
revoke all on function public.consume_guest_question_quota(uuid, integer) from anon, authenticated;
grant execute on function public.consume_guest_question_quota(uuid, integer) to service_role;

commit;
