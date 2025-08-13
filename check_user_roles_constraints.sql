-- Check user_roles table constraints and structure
-- Run this in Supabase SQL editor to understand the database setup

-- Check table structure
SELECT '=== TABLE STRUCTURE ===' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_roles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check constraints
SELECT '=== TABLE CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'user_roles' 
AND tc.table_schema = 'public';

-- Check unique constraints specifically
SELECT '=== UNIQUE CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
AND tc.table_name = 'user_roles' 
AND tc.table_schema = 'public';

-- Check current data
SELECT '=== CURRENT DATA ===' as info;
SELECT 
    user_id, 
    role, 
    created_at,
    COUNT(*) as count
FROM public.user_roles 
GROUP BY user_id, role, created_at
ORDER BY user_id, role;

-- Check for duplicate entries
SELECT '=== DUPLICATE CHECK ===' as info;
SELECT 
    user_id, 
    role, 
    COUNT(*) as count
FROM public.user_roles 
GROUP BY user_id, role
HAVING COUNT(*) > 1
ORDER BY user_id, role;

-- Check if the unique constraint can be safely dropped
SELECT '=== CONSTRAINT DROP INFO ===' as info;
SELECT 
    'To drop the unique constraint, run:' as instruction,
    'ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;' as command;
