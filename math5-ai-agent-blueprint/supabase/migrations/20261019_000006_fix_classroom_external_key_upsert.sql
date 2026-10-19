-- Repair migration for projects where 20261019_000005 created a partial
-- unique index. A partial index cannot be selected by ON CONFLICT (external_key)
-- through Supabase upsert.

begin;

-- Drop a constraint first when present (its backing index cannot be dropped
-- directly), then remove the old standalone partial index when present.
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.classrooms'::regclass
      and conname = 'classrooms_external_key_unique'
  ) then
    alter table public.classrooms
      drop constraint classrooms_external_key_unique;
  end if;
end $$;

drop index if exists public.classrooms_external_key_unique;

alter table public.classrooms
  add constraint classrooms_external_key_unique unique (external_key);

commit;

notify pgrst, 'reload schema';
