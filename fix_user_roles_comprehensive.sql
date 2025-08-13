-- Comprehensive fix for user_roles RLS policies
-- This script should be run in the Supabase SQL editor

-- Step 1: Check current state
SELECT 'Current user_roles policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Step 2: Check if the has_role function exists and works
SELECT 'Checking has_role function:' as info;
SELECT routine_name, routine_type, data_type 
FROM information_schema.routines 
WHERE routine_name = 'has_role' AND routine_schema = 'public';

-- Step 3: Test the has_role function with current user
SELECT 'Testing has_role function:' as info;
SELECT 
  auth.uid() as current_user_id,
  public.has_role(auth.uid(), 'admin') as is_admin,
  public.has_role(auth.uid(), 'user') as is_user;

-- Step 4: Check current user's roles
SELECT 'Current user roles:' as info;
SELECT user_id, role, created_at 
FROM public.user_roles 
WHERE user_id = auth.uid();

-- Step 5: Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Step 6: Create a working admin policy
-- This policy checks if the current user has admin role in user_roles table
CREATE POLICY "Allow admin users to manage user roles" 
ON public.user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- Step 7: Create a fallback policy for testing (more permissive)
-- Uncomment this if the admin policy doesn't work
-- CREATE POLICY "Allow authenticated users to manage user roles (testing)" 
-- ON public.user_roles 
-- FOR ALL 
-- USING (auth.uid() IS NOT NULL);

-- Step 8: Verify the new policies
SELECT 'New user_roles policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Step 9: Test the policy by trying to read user_roles
SELECT 'Testing policy - reading user_roles:' as info;
SELECT COUNT(*) as total_roles FROM public.user_roles;

-- Step 10: If you need to manually assign admin role to current user
-- Uncomment and run this if you need to make yourself admin:
/*
INSERT INTO public.user_roles (user_id, role) 
VALUES (auth.uid(), 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

SELECT 'Admin role assigned to current user' as result;
*/
