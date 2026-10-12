-- Additional operational quota table. Run after 000001_initial.sql.
-- User-level per-day atomic reserve. Intended for server ONLY with secret key
-- after validating authenticated identity, not for browser RPC.
begin;

create table public.ai_usage_daily (
  student_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null,
  kind text not null check (kind in ('ocr', 'solve')),
  used integer not null default 0 check (used >= 0),
  updated_at timestamptz not null default now(),
  primary key (student_id, usage_date, kind)
);

alter table public.ai_usage_daily enable row level security;
revoke all on public.ai_usage_daily from anon, authenticated;

-- Server-only RPC in exposed `public` schema; execution is granted ONLY to service_role.
-- Explicitly check caller permissions at the server API before invoking it.
create or replace function public.consume_ai_quota(
  p_student_id uuid,
  p_kind text,
  p_daily_limit integer
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  changed integer;
begin
  if p_student_id is null or p_kind not in ('ocr', 'solve')
    or p_daily_limit is null or p_daily_limit < 1 or p_daily_limit > 1000 then
    raise exception 'invalid quota reservation parameters';
  end if;

  insert into public.ai_usage_daily (student_id, usage_date, kind, used, updated_at)
  values (p_student_id, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_kind, 1, now())
  on conflict (student_id, usage_date, kind)
  do update set used = public.ai_usage_daily.used + 1,
                updated_at = now()
  where public.ai_usage_daily.used < p_daily_limit;

  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

revoke all on function public.consume_ai_quota(uuid, text, integer) from public;
revoke all on function public.consume_ai_quota(uuid, text, integer) from anon, authenticated;
grant execute on function public.consume_ai_quota(uuid, text, integer) to service_role;
commit;

-- Important: test function privileges and concurrent calls on a disposable project.
-- Consider adding request-id idempotency/locking in a separate migration before broad launch.
