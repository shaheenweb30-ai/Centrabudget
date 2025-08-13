-- Fix function search_path security issues by setting proper search paths

-- 1) handle_new_user trigger function
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
    coalesce(new.raw_user_meta_data->>'first_name', '') || ' ' || coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

-- 2) has_role(check_role text) — checks the current auth user’s roles
create or replace function public.has_role(check_role text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  user_has_role boolean;
begin
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role::text = check_role
  ) into user_has_role;

  return coalesce(user_has_role, false);
end;
$$;

-- 3) has_role(user_id, role_name text) — explicit user check by text role
create or replace function public.has_role(user_id uuid, role_name text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  roles text[];
begin
  select array_agg(role::text) into roles
  from public.user_roles
  where user_roles.user_id = has_role.user_id;

  return role_name = any(roles);
end;
$$;

-- 4) set_user_admin(user_id) — grant admin role safely
create or replace function public.set_user_admin(user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (user_id, 'admin'::app_role)
  on conflict (user_id, role) do nothing;
end;
$$;


