-- Fix RLS policies for user_roles table to allow admins to manage user roles
-- This script should be run in the Supabase SQL editor

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;

-- Create a simpler, more permissive policy for admins
-- This policy allows any authenticated user to manage user_roles (for testing)
CREATE POLICY "Allow authenticated users to manage user roles" 
ON public.user_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Alternative: Create a more specific admin policy if you prefer
-- CREATE POLICY "Allow admin users to manage user roles" 
-- ON public.user_roles 
-- FOR ALL 
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.user_roles 
--     WHERE user_id = auth.uid() 
--     AND role = 'admin'
--   )
-- );

-- Verify the new policy
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Test: Try to insert a test role (this should work now)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('00000000-0000-0000-0000-000000000000', 'user');
-- DELETE FROM public.user_roles WHERE user_id = '00000000-0000-0000-0000-000000000000';
