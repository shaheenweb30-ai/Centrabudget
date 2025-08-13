-- Test script to verify user plan access
-- Run this in Supabase SQL editor to test the plan system

-- Step 1: Check current user roles
SELECT '=== CURRENT USER ROLES ===' as info;
SELECT 
    ur.user_id,
    ur.role,
    ur.created_at,
    u.email
FROM public.user_roles ur
JOIN public.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- Step 2: Test promoting a user to Pro
-- Replace 'USER_EMAIL_HERE' with the actual email of the user you want to test
SELECT '=== TESTING PRO PROMOTION ===' as info;

-- First, check if user exists
SELECT 
    'User to promote:' as action,
    u.email,
    u.id,
    COALESCE(ur.role, 'no role') as current_role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'USER_EMAIL_HERE'; -- Replace with actual email

-- Step 3: Manual promotion (if needed)
-- Uncomment and run this if you want to manually promote a user to Pro:
/*
-- Remove existing role
DELETE FROM public.user_roles 
WHERE user_id = (SELECT id FROM public.users WHERE email = 'USER_EMAIL_HERE');

-- Add Pro role
INSERT INTO public.user_roles (user_id, role) 
VALUES (
    (SELECT id FROM public.users WHERE email = 'USER_EMAIL_HERE'), 
    'subscriber'
);

SELECT 'User promoted to Pro manually' as result;
*/

-- Step 4: Verify the promotion worked
SELECT '=== VERIFICATION ===' as info;
SELECT 
    u.email,
    ur.role,
    CASE 
        WHEN ur.role = 'subscriber' THEN 'Pro User - Should have unlimited access'
        WHEN ur.role = 'admin' THEN 'Admin User - Should have unlimited access'
        WHEN ur.role = 'user' THEN 'Free User - Limited access'
        ELSE 'No role assigned'
    END as access_level
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'USER_EMAIL_HERE'; -- Replace with actual email

-- Step 5: Check all users and their access levels
SELECT '=== ALL USERS ACCESS LEVELS ===' as info;
SELECT 
    u.email,
    COALESCE(ur.role, 'no role') as role,
    CASE 
        WHEN ur.role = 'subscriber' THEN 'Pro - Unlimited'
        WHEN ur.role = 'admin' THEN 'Admin - Unlimited'
        WHEN ur.role = 'user' THEN 'Free - Limited'
        WHEN ur.role IS NULL THEN 'No role - Limited'
        ELSE 'Unknown'
    END as access_level,
    u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
