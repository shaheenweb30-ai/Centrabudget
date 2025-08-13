-- Setup Admin User and Fix User Management
-- Run this in your Supabase SQL editor

-- 1. First, let's check what users exist
SELECT 'Current users in auth.users:' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at;

-- 2. Check if the trigger is working by looking at public.users
SELECT 'Current users in public.users:' as info;
SELECT * FROM public.users;

-- 3. Check current user roles
SELECT 'Current user roles:' as info;
SELECT * FROM public.user_roles;

-- 4. Create missing user profiles for existing auth users
INSERT INTO public.users (id, email, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 5. Create default user role for users without roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
    u.id,
    'user'::app_role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- 6. Make the first user an admin (or specify a specific email)
UPDATE public.user_roles 
SET role = 'admin'::app_role 
WHERE user_id = (
    SELECT id FROM public.users 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- 7. Verify the setup
SELECT 'Final user setup:' as info;
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.created_at,
    ur.role,
    CASE WHEN ur.role = 'admin' THEN '✅ Admin' ELSE '👤 User' END as status
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at;

-- 8. Test the admin function
SELECT 'Testing admin function:' as info;
SELECT 
    email,
    public.is_admin() as is_admin,
    public.has_role(id, 'admin'::app_role) as has_admin_role
FROM public.users 
WHERE email = (SELECT email FROM public.users ORDER BY created_at ASC LIMIT 1);
