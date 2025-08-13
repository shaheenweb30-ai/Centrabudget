-- Set current user as admin
-- Run this in your Supabase SQL editor

-- First, let's see what users we have
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email IS NOT NULL;

-- Update your user to have admin role
-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb), 
  '{role}', 
  '"admin"'
)
WHERE email = 'your-email@example.com';  -- Replace with your email

-- Verify the update
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'your-email@example.com';  -- Replace with your email

-- Alternative: Update by user ID if you know it
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb), 
--   '{role}', 
--   '"admin"'
-- )
-- WHERE id = 'your-user-id-here';  -- Replace with your user ID
