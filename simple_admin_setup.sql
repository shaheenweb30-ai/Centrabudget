-- Simple admin setup - run this in Supabase SQL editor

-- Step 1: See all users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email IS NOT NULL;

-- Step 2: Set your user as admin (replace with your email)
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb), 
  '{role}', 
  '"admin"'
)
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- Step 3: Verify the update
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users 
WHERE email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- Alternative: Update by user ID if you know it
-- UPDATE auth.users 
-- SET raw_user_meta_data = jsonb_set(
--   COALESCE(raw_user_meta_data, '{}'::jsonb), 
--   '{role}', 
--   '"admin"'
-- )
-- WHERE id = 'your-user-id-here';
