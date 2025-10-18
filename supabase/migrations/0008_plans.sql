create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  profile_type text,
  horizon_years int not null default 10,
  monthly_invest numeric not null default 200,
  reinvest boolean not null default true,
  shock_pct numeric not null default 0,
  monthly_withdraw numeric not null default 0,
  expected_return numeric,
  expected_vol numeric,
  created_at timestamptz default now()
);

alter table public.plans enable row level security;

create policy if not exists read_own_plan on public.plans
  for select using ( auth.uid() = user_id or user_id is null );

create policy if not exists write_own_plan on public.plans
  for insert with check ( auth.uid() = user_id )
  using ( auth.uid() = user_id );

create table if not exists public.plan_positions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans(id) on delete cascade,
  bucket text not null,
  label text not null,
  symbol text,
  category text not null,
  weight numeric not null,
  expected_return numeric,
  expected_vol numeric
);

alter table public.plan_positions enable row level security;

create policy if not exists read_pos on public.plan_positions for select using (
  exists (
    select 1 from public.plans p 
    where p.id = plan_id and (auth.uid() = p.user_id or p.user_id is null)
  )
);

create policy if not exists write_pos on public.plan_positions for insert with check (
  exists (
    select 1 from public.plans p 
    where p.id = plan_id and auth.uid() = p.user_id
  )
);


