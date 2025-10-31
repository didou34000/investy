-- Informations publiques utilisateur
create table if not exists public.users_public (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  profile_type text,             -- "Prudent", "Équilibré", "Dynamique", "Agressif", etc.
  risk_index int,
  expected_return numeric,       -- ex: 0.087
  expected_vol numeric,          -- ex: 0.214
  allocation jsonb,              -- { "Actions Monde": 66, "Obligations": 18, ... }
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Résultats du quiz (audit / analytics)
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  answers jsonb not null,
  summary jsonb not null,        -- { riskIndex, expectedReturn, expectedVol, allocation, horizon, monthly, reinvest }
  created_at timestamptz default now()
);

-- Watchlist (déclaratif)
create table if not exists public.user_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  symbol text not null,
  label text,
  category text check (category in ('index','etf','equity','crypto','fx','bond')) default 'etf',
  created_at timestamptz default now()
);

-- Préférences d'alertes
create table if not exists public.alerts_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  frequency text check (frequency in ('daily','weekly')) default 'weekly',
  topics text[] default array['macro','equities','etf','crypto'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS simples
alter table public.users_public enable row level security;
create policy upsert_self on public.users_public
  for all using (auth.uid() = id) with check (auth.uid() = id);

alter table public.quiz_results enable row level security;
create policy read_own_quiz on public.quiz_results
  for select using (auth.uid() = user_id);
create policy ins_quiz on public.quiz_results
  for insert with check (true);

alter table public.user_watchlist enable row level security;
create policy watchlist_crud on public.user_watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.alerts_settings enable row level security;
create policy alerts_crud on public.alerts_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
