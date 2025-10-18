-- Table pour le double opt-in email
create table if not exists public.email_confirm (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  token text unique not null,
  confirmed boolean default false,
  created_at timestamptz default now()
);

alter table public.email_confirm enable row level security;
create policy own_conf on public.email_confirm for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Index pour performance
create index if not exists idx_email_confirm_user on public.email_confirm(user_id);
create index if not exists idx_email_confirm_token on public.email_confirm(token);
create index if not exists idx_email_confirm_confirmed on public.email_confirm(confirmed);
