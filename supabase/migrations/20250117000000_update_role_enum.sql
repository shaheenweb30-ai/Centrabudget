-- Update the app_role enum to replace 'moderator' with 'subscriber'
-- First, we need to handle existing data by updating any 'moderator' roles to 'subscriber'

-- Update existing moderator roles to subscriber
UPDATE public.user_roles 
SET role = 'subscriber'::text::app_role 
WHERE role = 'moderator'::text::app_role;

-- Drop the existing enum type
DROP TYPE public.app_role;

-- Recreate the enum with the new values
CREATE TYPE public.app_role AS ENUM ('admin', 'subscriber', 'user');

-- Update the user_roles table to use the new enum
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE app_role 
USING role::text::app_role;

-- Update the has_role function to work with the new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
