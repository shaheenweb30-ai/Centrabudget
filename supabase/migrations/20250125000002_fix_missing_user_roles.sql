-- Migration: Fix Missing User Roles Issue
-- This migration fixes the problem where new users don't get assigned a default role
-- and assigns missing roles to existing users

-- Step 1: Fix existing users who don't have roles
-- Assign 'user' role to all existing users who don't have any role
INSERT INTO public.user_roles (user_id, role)
SELECT 
    u.id,
    'user'::app_role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 2: Update the handle_new_user function to assign default roles
-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the enhanced function that creates user profile AND assigns default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign default 'user' role (free plan)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role);
  
  -- Create default categories for the new user
  INSERT INTO public.categories (name, icon, color, user_id) VALUES
    ('Food & Dining', '🍽️', '#FF6B6B', NEW.id),
    ('Transportation', '🚗', '#4ECDC4', NEW.id),
    ('Shopping', '🛍️', '#45B7D1', NEW.id),
    ('Entertainment', '🎬', '#96CEB4', NEW.id),
    ('Healthcare', '🏥', '#FFEAA7', NEW.id),
    ('Utilities', '💡', '#DDA0DD', NEW.id),
    ('Housing', '🏠', '#98D8C8', NEW.id),
    ('Income', '💰', '#F7DC6F', NEW.id),
    ('Other', '📌', '#BB8FCE', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comment to document the function
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile, assigns default "user" role (free plan), and creates default categories when a new user signs up.';
