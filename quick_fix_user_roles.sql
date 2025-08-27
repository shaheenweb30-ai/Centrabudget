-- Quick Fix for Missing User Roles
-- This script assigns the missing 'user' role to existing users
-- Run this in your Supabase SQL editor

-- Step 1: Check how many users are missing roles
SELECT '=== USERS MISSING ROLES ===' as info;
SELECT COUNT(*) as users_without_roles
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- Step 2: Assign 'user' role to all users who don't have any role
INSERT INTO public.user_roles (user_id, role)
SELECT 
    u.id,
    'user'::app_role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the fix worked
SELECT '=== VERIFICATION ===' as info;
SELECT COUNT(*) as remaining_users_without_roles
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- Step 4: Show current user distribution
SELECT '=== CURRENT USER ROLES ===' as info;
SELECT 
    ur.role,
    COUNT(*) as user_count
FROM public.user_roles ur
GROUP BY ur.role
ORDER BY ur.role;

-- Success message
SELECT '✅ QUICK FIX APPLIED' as result;
SELECT 'All existing users now have a "user" role (free plan)' as note;
