-- Normalize roles enum, fix signup trigger, and update subscription functions

-- 1) Ensure enum app_role contains 'subscriber'
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_enum e on t.oid = e.enumtypid
    where t.typname = 'app_role' and e.enumlabel = 'subscriber'
  ) then
    alter type public.app_role add value 'subscriber';
  end if;
end $$;

-- 2) Ensure public.users table exists with basic columns (safe no-op if already present)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure generic updated_at trigger function exists
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Users updated_at trigger
drop trigger if exists update_users_updated_at on public.users;
create trigger update_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at_column();

-- 3) Replace handle_new_user to only create user profile and default role
drop trigger if exists on_auth_user_created on auth.users;
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null)
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user'::public.app_role)
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill missing default roles
insert into public.user_roles (user_id, role)
select u.id, 'user'::public.app_role
from public.users u
left join public.user_roles ur
  on ur.user_id = u.id and ur.role = 'user'::public.app_role
where ur.user_id is null
on conflict (user_id, role) do nothing;

-- 4) Update subscription helper functions to set search_path and avoid transaction control inside functions

create or replace function public.activate_user_subscription(
  p_user_id uuid,
  p_plan_id text,
  p_billing_cycle text,
  p_paddle_subscription_id text,
  p_paddle_customer_id text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_email text;
  v_existing_subscription_id uuid;
  v_period_start timestamptz := now();
  v_period_end timestamptz;
  v_result_message text;
begin
  select email into v_user_email from auth.users where id = p_user_id;
  if v_user_email is null then
    return 'ERROR: User with ID ' || p_user_id || ' not found';
  end if;

  if p_billing_cycle = 'monthly' then
    v_period_end := v_period_start + interval '1 month';
  else
    v_period_end := v_period_start + interval '1 year';
  end if;

  select id into v_existing_subscription_id from public.user_subscriptions where user_id = p_user_id;

  if v_existing_subscription_id is not null then
    update public.user_subscriptions
    set 
      plan_id = p_plan_id,
      status = 'active',
      billing_cycle = p_billing_cycle,
      paddle_subscription_id = p_paddle_subscription_id,
      paddle_customer_id = p_paddle_customer_id,
      current_period_start = v_period_start,
      current_period_end = v_period_end,
      cancel_at_period_end = false,
      updated_at = now()
    where id = v_existing_subscription_id;
    v_result_message := 'Updated subscription for user ' || v_user_email || ' to ' || p_plan_id || ' (' || p_billing_cycle || ')';
  else
    insert into public.user_subscriptions (
      user_id,
      plan_id,
      status,
      billing_cycle,
      paddle_subscription_id,
      paddle_customer_id,
      current_period_start,
      current_period_end
    ) values (
      p_user_id,
      p_plan_id,
      'active',
      p_billing_cycle,
      p_paddle_subscription_id,
      p_paddle_customer_id,
      v_period_start,
      v_period_end
    );
    v_result_message := 'Created new subscription for user ' || v_user_email || ' to ' || p_plan_id || ' (' || p_billing_cycle || ')';
  end if;

  -- Ensure subscriber role
  delete from public.user_roles where user_id = p_user_id and role = 'user'::public.app_role;
  insert into public.user_roles (user_id, role)
  values (p_user_id, 'subscriber'::public.app_role)
  on conflict (user_id, role) do nothing;

  return v_result_message;
exception when others then
  return 'ERROR: Failed to activate subscription for user ' || coalesce(v_user_email, p_user_id::text) || ' - ' || SQLERRM;
end;
$$;

create or replace function public.cancel_user_subscription(
  p_user_id uuid,
  p_cancel_at_period_end boolean default true
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_email text;
  v_result_message text;
begin
  select email into v_user_email from auth.users where id = p_user_id;
  if v_user_email is null then
    return 'ERROR: User with ID ' || p_user_id || ' not found';
  end if;

  if p_cancel_at_period_end then
    update public.user_subscriptions
    set 
      cancel_at_period_end = true,
      updated_at = now()
    where user_id = p_user_id;
    v_result_message := 'Subscription cancelled at period end for user ' || v_user_email;
  else
    update public.user_subscriptions
    set 
      status = 'cancelled',
      cancel_at_period_end = false,
      updated_at = now()
    where user_id = p_user_id;

    -- Downgrade to free plan
    delete from public.user_roles where user_id = p_user_id and role = 'subscriber'::public.app_role;
    insert into public.user_roles (user_id, role)
    values (p_user_id, 'user'::public.app_role)
    on conflict (user_id, role) do nothing;

    v_result_message := 'Subscription cancelled immediately for user ' || v_user_email || ' - downgraded to free plan';
  end if;

  return v_result_message;
exception when others then
  return 'ERROR: Failed to cancel subscription for user ' || coalesce(v_user_email, p_user_id::text) || ' - ' || SQLERRM;
end;
$$;

create or replace function public.get_user_subscription_status(p_user_id uuid)
returns table(
  user_id uuid,
  plan_id text,
  status text,
  billing_cycle text,
  current_period_end timestamptz,
  is_active boolean,
  days_remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select 
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_end,
    (us.status = 'active' and us.current_period_end > now()) as is_active,
    extract(day from (us.current_period_end - now()))::integer as days_remaining
  from public.user_subscriptions us
  where us.user_id = p_user_id;
end;
$$;

-- Grants (idempotent; ignores if already granted)
grant execute on function public.activate_user_subscription(uuid, text, text, text, text) to service_role;
grant execute on function public.cancel_user_subscription(uuid, boolean) to service_role;
grant execute on function public.get_user_subscription_status(uuid) to authenticated;



