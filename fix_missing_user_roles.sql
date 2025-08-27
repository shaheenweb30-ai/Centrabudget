-- Fix Missing User Roles Issue
-- This script fixes the problem where new users don't get assigned a default role
-- Run this in your Supabase SQL editor

-- Step 1: Check current state
SELECT '=== CURRENT STATE ===' as info;
SELECT 
    'Users without roles:' as status,
    COUNT(*) as count
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

SELECT 
    'Users with roles:' as status,
    COUNT(*) as count
FROM public.user_roles;

-- Step 2: Fix the handle_new_user function to assign default roles
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

-- Step 3: Fix existing users who don't have roles
-- Assign 'user' role to all existing users who don't have any role
INSERT INTO public.user_roles (user_id, role)
SELECT 
    u.id,
    'user'::app_role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Verify the fix
SELECT '=== AFTER FIX ===' as info;
SELECT 
    'Users without roles:' as status,
    COUNT(*) as count
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

SELECT 
    'Users with roles:' as status,
    COUNT(*) as count
FROM public.user_roles;

-- Step 5: Show current user distribution
SELECT '=== USER ROLE DISTRIBUTION ===' as info;
SELECT 
    ur.role,
    COUNT(*) as user_count,
    CASE 
        WHEN ur.role = 'admin' THEN 'Admin (unlimited access)'
        WHEN ur.role = 'subscriber' THEN 'Pro (unlimited access)'
        WHEN ur.role = 'user' THEN 'Free (limited access)'
        ELSE 'Unknown'
    END as access_level
FROM public.user_roles ur
GROUP BY ur.role
ORDER BY ur.role;

-- Step 6: Show sample users and their roles
SELECT '=== SAMPLE USERS AND ROLES ===' as info;
SELECT 
    u.email,
    ur.role,
    u.created_at,
    CASE 
        WHEN ur.role = 'admin' THEN 'Admin (unlimited access)'
        WHEN ur.role = 'subscriber' THEN 'Pro (unlimited access)'
        WHEN ur.role = 'user' THEN 'Free (limited access)'
        ELSE 'Unknown'
    END as access_level
FROM public.users u
JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- Success message
SELECT '✅ FIX APPLIED SUCCESSFULLY' as result;
SELECT 'New users will now automatically get a "user" role (free plan)' as note;
SELECT 'Existing users without roles have been assigned "user" role' as note;
