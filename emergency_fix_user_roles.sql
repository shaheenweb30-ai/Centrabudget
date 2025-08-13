-- EMERGENCY FIX for user_roles RLS issue
-- Run this in Supabase SQL editor to immediately fix the problem

-- First, let's see what policies currently exist
SELECT 'Current policies on user_roles:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Drop ALL existing policies on user_roles (including the one that might already exist)
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow admin users to manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.user_roles;

-- Create a simple, permissive policy for testing
CREATE POLICY "Allow all operations for authenticated users" 
ON public.user_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Verify the fix
SELECT 'Policy created successfully' as status;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'user_roles';
