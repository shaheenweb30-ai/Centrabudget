-- Test database access and permissions
-- Run this in your Supabase SQL editor

-- Test 1: Check if user_trials table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_trials';

-- Test 2: Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_trials' 
ORDER BY ordinal_position;

-- Test 3: Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_trials';

-- Test 4: Check policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_trials';

-- Test 5: Check if we can insert data (this should work)
INSERT INTO public.user_trials (user_id, plan_type, ends_at) 
VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'pro', 
    (now() + interval '14 days')
) ON CONFLICT (user_id) DO NOTHING;

-- Test 6: Check if we can select data
SELECT COUNT(*) as trial_count FROM public.user_trials;

-- Test 7: Show all trials
SELECT 
    ut.*,
    u.email
FROM public.user_trials ut
LEFT JOIN auth.users u ON ut.user_id = u.id;

-- Test 8: Check current user context
SELECT 
    current_user,
    session_user,
    current_setting('role'),
    current_setting('request.jwt.claims', true)::json->>'role' as jwt_role;
