-- Create a test trial for the current user
-- Run this in your Supabase SQL editor after running the fix_database.sql script

-- First, let's see what users exist
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Create a test trial (replace USER_ID_HERE with an actual user ID from above)
-- Uncomment and modify the line below with a real user ID:

/*
INSERT INTO public.user_trials (user_id, plan_type, ends_at) 
VALUES (
    'USER_ID_HERE', -- Replace with actual user ID
    'pro', 
    (now() + interval '14 days')
);
*/

-- Alternative: Create trial for the most recent user
DO $$
DECLARE
    latest_user_id uuid;
BEGIN
    -- Get the most recent user
    SELECT id INTO latest_user_id 
    FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    IF latest_user_id IS NOT NULL THEN
        -- Check if user already has a trial
        IF NOT EXISTS (SELECT 1 FROM public.user_trials WHERE user_id = latest_user_id) THEN
            INSERT INTO public.user_trials (user_id, plan_type, ends_at) 
            VALUES (latest_user_id, 'pro', (now() + interval '14 days'));
            
            RAISE NOTICE 'Created trial for user: %', latest_user_id;
        ELSE
            RAISE NOTICE 'User already has a trial';
        END IF;
    ELSE
        RAISE NOTICE 'No users found';
    END IF;
END $$;

-- Verify the trial was created
SELECT 
    ut.id,
    ut.user_id,
    ut.plan_type,
    ut.started_at,
    ut.ends_at,
    u.email
FROM public.user_trials ut
JOIN auth.users u ON ut.user_id = u.id
ORDER BY ut.created_at DESC;
