-- Table pour tracker les exécutions de cron
create table if not exists public.alert_runs (
  id uuid primary key default gen_random_uuid(),
  freq text check (freq in ('daily','weekly')) not null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  status text check (status in ('running','ok','error')) default 'running',
  error text,
  idempotency_key text unique, -- ex: "daily:2025-10-12"
  processed_count int default 0
);

alter table public.alert_runs enable row level security;
create policy admin_only on public.alert_runs for all using (true) with check (true); -- laisser ouvert à l'admin UI (sinon ajouter rôle)

-- Table pour tracker les événements d'envoi d'emails
create table if not exists public.alert_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references public.alert_runs(id) on delete cascade,
  user_id uuid,
  email text,
  profile_type text,
  frequency text,
  items jsonb not null,   -- [{symbol, change1d, change5d, message, severity}]
  sent boolean default false,
  created_at timestamptz default now()
);

alter table public.alert_events enable row level security;
create policy admin_only_ev on public.alert_events for all using (true) with check (true);

-- Index pour performance
create index if not exists idx_alert_events_run on public.alert_events(run_id);
create index if not exists idx_alert_runs_idempotency on public.alert_runs(idempotency_key);
create index if not exists idx_alert_runs_started on public.alert_runs(started_at);
