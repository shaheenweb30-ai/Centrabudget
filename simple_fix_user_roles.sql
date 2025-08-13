-- SIMPLE STEP-BY-STEP FIX for user_roles RLS issue
-- Run this in Supabase SQL editor

-- Step 1: Check what policies currently exist
SELECT '=== CURRENT POLICIES ===' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Step 2: Check if RLS is enabled
SELECT '=== RLS STATUS ===' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_roles';

-- Step 3: Temporarily disable RLS to test
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 4: Test if we can now access the table
SELECT '=== TESTING ACCESS ===' as info;
SELECT COUNT(*) as total_roles FROM public.user_roles;

-- Step 5: Re-enable RLS with a simple policy
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create a very simple policy
CREATE POLICY "Simple access policy" 
ON public.user_roles 
FOR ALL 
USING (true);

-- Step 7: Verify the new policy
SELECT '=== NEW POLICY ===' as info;
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Step 8: Test access again
SELECT '=== FINAL TEST ===' as info;
SELECT COUNT(*) as total_roles FROM public.user_roles;
