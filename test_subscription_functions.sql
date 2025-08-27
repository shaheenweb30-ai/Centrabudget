-- Test script for subscription functions
-- Run this in Supabase SQL editor

-- Step 1: Check existing users to get a valid UUID
SELECT '=== EXISTING USERS ===' as info;
SELECT 
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Step 2: Check current user roles
SELECT '=== CURRENT USER ROLES ===' as info;
SELECT 
    ur.user_id,
    ur.role,
    ur.created_at,
    u.email
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- Step 3: Test the activate_user_subscription function
-- Replace 'ACTUAL_USER_UUID_HERE' with a UUID from Step 1
SELECT '=== TESTING SUBSCRIPTION ACTIVATION ===' as info;

-- Example (uncomment and replace with actual UUID):
/*
SELECT activate_user_subscription(
  'ACTUAL_USER_UUID_HERE',  -- Replace with UUID from Step 1
  'pro',
  'monthly',
  'test-subscription-id-123',
  'test-customer-id-456'
);
*/

-- Step 4: Test the get_user_subscription_status function
-- Replace 'ACTUAL_USER_UUID_HERE' with a UUID from Step 1
SELECT '=== TESTING SUBSCRIPTION STATUS ===' as info;

-- Example (uncomment and replace with actual UUID):
/*
SELECT * FROM get_user_subscription_status('ACTUAL_USER_UUID_HERE');
*/

-- Step 5: Test the cancel_user_subscription function
-- Replace 'ACTUAL_USER_UUID_HERE' with a UUID from Step 1
SELECT '=== TESTING SUBSCRIPTION CANCELLATION ===' as info;

-- Example (uncomment and replace with actual UUID):
/*
SELECT cancel_user_subscription('ACTUAL_USER_UUID_HERE', true);
*/

-- Step 6: Verify subscription was created/updated
SELECT '=== VERIFYING SUBSCRIPTIONS ===' as info;
SELECT 
    us.user_id,
    u.email,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_end,
    us.created_at
FROM user_subscriptions us
JOIN auth.users u ON us.user_id = u.id
ORDER BY us.created_at DESC;

-- Step 7: Check user roles after subscription changes
SELECT '=== VERIFYING USER ROLES ===' as info;
SELECT 
    ur.user_id,
    u.email,
    ur.role,
    ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- IMPORTANT: To test with a real user, follow these steps:
-- 1. Run Step 1 to see existing users
-- 2. Copy a UUID from the results
-- 3. Replace 'ACTUAL_USER_UUID_HERE' in the test commands above
-- 4. Uncomment the test commands you want to run
-- 5. Execute the commands

-- Example of complete test sequence:
/*
-- Get a user UUID first
SELECT id, email FROM auth.users LIMIT 1;

-- Then test the function (replace UUID with actual value)
SELECT activate_user_subscription(
  '123e4567-e89b-12d3-a456-426614174000',  -- Replace with actual UUID
  'pro',
  'monthly',
  'test-subscription-id-123',
  'test-customer-id-456'
);
*/
