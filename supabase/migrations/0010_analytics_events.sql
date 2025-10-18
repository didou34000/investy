create table if not exists public.analytics_events(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  event text not null,
  meta jsonb,
  created_at timestamptz default now()
);

alter table public.analytics_events enable row level security;
create policy if not exists "read_own_analytics" on public.analytics_events for select using (true);
create policy if not exists "write_own_analytics" on public.analytics_events for insert with check (true);


