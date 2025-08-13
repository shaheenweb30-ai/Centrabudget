-- Check if user_trials table exists and its structure
-- Run this in your Supabase SQL editor

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_trials'
) as table_exists;

-- If table exists, show its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_trials' 
ORDER BY ordinal_position;

-- Check if there are any rows in the table
SELECT COUNT(*) as row_count FROM user_trials;

-- Check if there are any trials for the current user (replace with actual user ID)
-- SELECT * FROM user_trials LIMIT 5;
