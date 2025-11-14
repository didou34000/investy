-- Table principale: dernier profil "courant"
create table if not exists public.users_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  name text,
  risk_index int check (risk_index between 0 and 100),
  drawdown_tolerance int check (drawdown_tolerance between 0 and 100),
  reinvest boolean,
  monthly int check (monthly >= 0),
  horizon int check (horizon >= 1),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint user_or_email check (user_id is not null or (email is not null and length(email) > 3))
);

-- Unique: un "profil courant" par user_id OU par email
create unique index if not exists users_profiles_user_unique
  on public.users_profiles (user_id)
  where user_id is not null;

create unique index if not exists users_profiles_email_unique
  on public.users_profiles (email)
  where email is not null;

-- Historique des snapshots (chaque sauvegarde)
create table if not exists public.users_profile_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  payload jsonb not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.users_profiles enable row level security;
alter table public.users_profile_history enable row level security;

-- Politiques: l'utilisateur authentifié peut CRUD ses lignes
create policy upsert_own_profile on public.users_profiles
  for all using (auth.uid() is not null and (user_id = auth.uid()))
  with check (auth.uid() is not null and (user_id = auth.uid()));

create policy read_own_profile on public.users_profiles
  for select using (auth.uid() is not null and (user_id = auth.uid()));

create policy insert_history on public.users_profile_history
  for insert with check (
    (auth.uid() is not null and user_id = auth.uid())
    or (auth.uid() is null) -- on tolère l'historisation même avant auth si seulement email (fallback)
  );

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_set_updated_at on public.users_profiles;
create trigger trg_set_updated_at
before update on public.users_profiles
for each row execute function public.set_updated_at();

-- NOTE: si vous n'avez pas d'Auth, on acceptera un mode "email only" via RPC sécurisé côté serveur (non inclus MVP).
