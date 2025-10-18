-- seuils par actif suivi
alter table public.user_watchlist
  add column if not exists alert_threshold numeric; -- en % (absolu sur 1j), null = défaut profil

-- table pour tokens de désinscription
create table if not exists public.email_unsubscribe (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  token text unique not null,
  created_at timestamptz default now()
);

alter table public.email_unsubscribe enable row level security;
create policy own_unsub on public.email_unsubscribe for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- index utile
create index if not exists idx_watch_alert_user on public.user_watchlist(user_id);
