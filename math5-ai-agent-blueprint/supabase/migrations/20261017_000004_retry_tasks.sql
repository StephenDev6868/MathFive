begin;

alter table public.ai_reviews
  add column if not exists retry_tasks jsonb not null default '[]'::jsonb
  check (jsonb_typeof(retry_tasks) = 'array');

notify pgrst, 'reload schema';

commit;
