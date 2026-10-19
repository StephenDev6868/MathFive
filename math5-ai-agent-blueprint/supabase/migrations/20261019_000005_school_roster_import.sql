-- School roster import support. Apply after 20261017_000004_retry_tasks.sql.
--
-- This migration deliberately does NOT write to auth.users. Supabase Auth users
-- must be created through auth.admin.createUser() with the service-role key;
-- writing directly to auth.* is unsupported and risks broken identities.
-- Run scripts/provision-school-roster.mjs afterwards with the private credential
-- file and a completed teacher mapping. The source workbook has no teacher rows.

begin;

alter table public.profiles
  add column if not exists username text,
  add column if not exists must_change_password boolean not null default false;

alter table public.profiles
  drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z][a-z0-9]{2,39}$');

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username))
  where username is not null;

alter table public.classrooms
  add column if not exists external_key text,
  add column if not exists class_code text,
  add column if not exists school_name text;

alter table public.classrooms
  drop constraint if exists classrooms_class_code_format;
alter table public.classrooms
  add constraint classrooms_class_code_format
  check (class_code is null or class_code ~ '^[0-9]{1,2}/[0-9]{1,2}$');

-- A UNIQUE constraint (rather than a partial unique index) is required by
-- PostgREST/Supabase when `upsert(..., { onConflict: 'external_key' })` is
-- used in the roster provisioning script. PostgreSQL still allows multiple
-- NULL values for this constraint, so non-imported classrooms remain valid.
alter table public.classrooms
  add constraint classrooms_external_key_unique unique (external_key);
create index if not exists idx_classrooms_school_class_code
  on public.classrooms (school_name, class_code)
  where school_name is not null and class_code is not null;

-- First-party event fact table for future dashboards. Do not place names,
-- worksheet content, passwords, emails, IP addresses, or signed URLs in metadata.
create table if not exists public.user_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null check (event_type in (
    'login_success', 'problem_created', 'problem_confirmed',
    'attempt_submitted', 'hint_viewed', 'solution_viewed'
  )),
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object')
);

create index if not exists idx_user_activity_events_user_time
  on public.user_activity_events (user_id, occurred_at desc);
create index if not exists idx_user_activity_events_type_time
  on public.user_activity_events (event_type, occurred_at desc);

alter table public.user_activity_events enable row level security;
revoke all on public.user_activity_events from anon, authenticated;

-- Browser users may only read their own event history. Event writes are performed
-- by a server endpoint after it has verified the authenticated user.
grant select on public.user_activity_events to authenticated;
drop policy if exists user_activity_events_read_own on public.user_activity_events;
create policy user_activity_events_read_own on public.user_activity_events
  for select to authenticated
  using (user_id = (select auth.uid()));

commit;

notify pgrst, 'reload schema';
