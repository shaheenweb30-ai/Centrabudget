-- Add policy to allow admins to list all users
-- This policy allows admin users to view all user profiles

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- Add policy for admins to view all user profiles
CREATE POLICY "Admins can view all user profiles" 
ON public.users 
FOR SELECT 
USING (public.is_admin());

-- Add policy for admins to view all user roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());
