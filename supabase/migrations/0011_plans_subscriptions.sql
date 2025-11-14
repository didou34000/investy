-- PLANS (abonnements: free, standard, pro)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,              -- 'free' | 'standard' | 'pro'
  name text not null,
  price_cents int not null default 0,
  currency text not null default 'EUR',
  max_assets int not null,                -- nb d'actifs suivis autorisés
  max_runs_per_day int not null,          -- analyses/jour/abonnement
  created_at timestamptz not null default now()
);

insert into public.plans (code, name, price_cents, max_assets, max_runs_per_day) values
  ('free','Gratuit',0,1,1)
on conflict (code) do nothing;

insert into public.plans (code, name, price_cents, max_assets, max_runs_per_day) values
  ('standard','Standard',900,10,2),
  ('pro','Pro',1900,9999,24)
on conflict (code) do nothing;

-- USER_PLANS (abonnements utilisateurs)
create table if not exists public.user_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan_code text not null references public.plans(code),
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- SUBSCRIPTIONS (suivi d'actifs)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,                               -- 'AAPL', 'BTC-USD', ...
  frequency text not null check (frequency in ('daily','weekly','monthly')),
  timezone text not null default 'Europe/Paris',
  send_hour int not null default 8 check (send_hour between 0 and 23),
  send_minute int not null default 0 check (send_minute between 0 and 59),
  enabled boolean not null default true,
  next_run_at timestamptz,
  last_run_at timestamptz,
  last_status text check (last_status in ('sent','skipped','error')),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_next on public.subscriptions(next_run_at) where enabled = true;

-- DELIVERIES (journal des envois)
create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  delivered_at timestamptz not null default now(),
  status text not null check (status in ('sent','skipped','error')),
  meta jsonb
);

create index if not exists idx_deliveries_user_time on public.deliveries(user_id, delivered_at desc);

-- trigger updated_at
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated before update on public.subscriptions
for each row execute function public.set_updated_at();

-- Par défaut : mettre tout le monde sur le plan 'free' s'il n'y est pas
create or replace function public.ensure_user_plan() returns trigger language plpgsql as $$
begin
  insert into public.user_plans(user_id, plan_code)
  values (new.id, 'free')
  on conflict (user_id) do nothing;
  return new;
end $$;

drop trigger if exists trg_auth_users_default_plan on auth.users;
create trigger trg_auth_users_default_plan after insert on auth.users
for each row execute function public.ensure_user_plan();

-- RLS (Row Level Security)
alter table public.plans enable row level security;
alter table public.user_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.deliveries enable row level security;

-- Policies: tout le monde peut lire les plans
create policy if not exists read_plans on public.plans
  for select using (true);

-- Policies: utilisateurs peuvent lire/modifier leur plan
create policy if not exists read_own_user_plan on public.user_plans
  for select using (auth.uid() = user_id);

create policy if not exists write_own_user_plan on public.user_plans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies: utilisateurs peuvent gérer leurs subscriptions
create policy if not exists read_own_subscriptions on public.subscriptions
  for select using (auth.uid() = user_id);

create policy if not exists write_own_subscriptions on public.subscriptions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies: utilisateurs peuvent lire leurs deliveries
create policy if not exists read_own_deliveries on public.deliveries
  for select using (auth.uid() = user_id);

