-- Create user_trials table to support 14-day free trials
create table if not exists public.user_trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null default 'pro' check (plan_type in ('pro', 'enterprise')),
  started_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- RLS
alter table public.user_trials enable row level security;

-- Policies: user can view and insert own trial row; updates not generally required
create policy "Users can view own trial"
on public.user_trials for select
using (auth.uid() = user_id);

create policy "Users can create their own trial"
on public.user_trials for insert
with check (auth.uid() = user_id);

-- Trigger to auto-update updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists update_user_trials_updated_at on public.user_trials;
create trigger update_user_trials_updated_at
before update on public.user_trials
for each row execute function public.update_updated_at_column();


