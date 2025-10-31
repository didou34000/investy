-- Migration pour le système de quiz et watchlist
-- Ce que l'utilisateur veut suivre (déclaratif)
create table if not exists public.user_watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  symbol text not null,
  label text,
  category text check (category in ('etf','equity','crypto','index','fx','bond')) default 'etf',
  created_at timestamptz default now()
);

alter table public.user_watchlist enable row level security;

create policy watchlist_crud on public.user_watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_watchlist_user on public.user_watchlist(user_id);

-- Préférences d'alertes (si pas déjà créées)
create table if not exists public.alerts_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  frequency text check (frequency in ('daily','weekly')) default 'weekly',
  topics text[] default array['macro','equities','etf','crypto'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.alerts_settings enable row level security;

create policy alerts_crud on public.alerts_settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create unique index if not exists uniq_alerts_user on public.alerts_settings(user_id);

-- Trigger pour updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_set_updated_at_alerts on public.alerts_settings;
create trigger trg_set_updated_at_alerts
  before update on public.alerts_settings
  for each row execute function public.set_updated_at();
