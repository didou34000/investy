-- Table watchlist (si pas déjà créée)
create table if not exists public.user_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  symbol text not null,
  label text not null,
  category text not null,
  created_at timestamptz default now()
);

-- Table alert_preferences
create table if not exists public.alert_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  frequency text default 'weekly',
  sensitivity numeric default 3,
  macro_themes text[] default array['global','rates','inflation','tech'],
  last_sent timestamptz default now()
);

-- Table alert_history (logs)
create table if not exists public.alert_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  symbol text,
  change numeric,
  message text,
  sent_at timestamptz default now()
);

alter table public.user_watchlist enable row level security;
create policy if not exists "user_own_watchlist" on public.user_watchlist for all using ( auth.uid() = user_id );

alter table public.alert_preferences enable row level security;
create policy if not exists "user_own_alerts" on public.alert_preferences for all using ( auth.uid() = user_id );


