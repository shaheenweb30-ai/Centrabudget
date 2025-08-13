-- Debug script to check user plans and roles
-- Run this in Supabase SQL editor to understand the current state

-- Check current user roles
SELECT '=== CURRENT USER ROLES ===' as info;
SELECT 
    ur.user_id,
    ur.role,
    ur.created_at,
    u.email
FROM public.user_roles ur
JOIN public.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- Check current user trials
SELECT '=== CURRENT USER TRIALS ===' as info;
SELECT 
    ut.user_id,
    ut.plan_type,
    ut.started_at,
    ut.ends_at,
    u.email
FROM public.user_trials ut
JOIN public.users u ON ut.user_id = u.id
ORDER BY ut.started_at DESC;

-- Check for users with both roles and trials
SELECT '=== USERS WITH BOTH ROLES AND TRIALS ===' as info;
SELECT 
    u.id,
    u.email,
    ur.role as current_role,
    ut.plan_type as trial_plan,
    ut.ends_at as trial_ends,
    CASE 
        WHEN ur.role = 'subscriber' THEN 'Pro'
        WHEN ur.role = 'admin' THEN 'Admin'
        WHEN ur.role = 'user' THEN 'Free'
        ELSE 'Unknown'
    END as effective_plan
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.user_trials ut ON u.id = ut.user_id
ORDER BY u.created_at DESC;

-- Check for users without roles (should not happen)
SELECT '=== USERS WITHOUT ROLES ===' as info;
SELECT 
    u.id,
    u.email,
    u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ORDER BY u.created_at DESC;

-- Check for users without trials (normal for Pro users)
SELECT '=== USERS WITHOUT TRIALS ===' as info;
SELECT 
    u.id,
    u.email,
    ur.role,
    CASE 
        WHEN ur.role = 'subscriber' THEN 'Pro (no trial needed)'
        WHEN ur.role = 'admin' THEN 'Admin (no trial needed)'
        WHEN ur.role = 'user' THEN 'Free (should have trial)'
        ELSE 'Unknown'
    END as status
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.user_trials ut ON u.id = ut.user_id
WHERE ut.user_id IS NULL
ORDER BY u.created_at DESC;

-- Summary of current plan distribution
SELECT '=== PLAN DISTRIBUTION SUMMARY ===' as info;
SELECT 
    CASE 
        WHEN ur.role = 'subscriber' THEN 'Pro'
        WHEN ur.role = 'admin' THEN 'Admin'
        WHEN ur.role = 'user' THEN 'Free'
        ELSE 'Unknown'
    END as plan_type,
    COUNT(*) as user_count
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
GROUP BY ur.role
ORDER BY user_count DESC;
