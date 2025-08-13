-- Simple fix for user_trials table
-- Run this in your Supabase SQL editor

-- Step 1: Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS public.user_trials CASCADE;

-- Step 2: Create the table
CREATE TABLE public.user_trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null default 'pro',
  started_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Step 3: Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple policies
CREATE POLICY "Enable all access for authenticated users" ON public.user_trials
FOR ALL USING (auth.role() = 'authenticated');

-- Step 5: Insert a test trial for the first user
DO $$
DECLARE
    first_user_id uuid;
BEGIN
    -- Get the first user
    SELECT id INTO first_user_id 
    FROM auth.users 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_trials (user_id, plan_type, ends_at) 
        VALUES (first_user_id, 'pro', (now() + interval '14 days'));
        
        RAISE NOTICE 'Created trial for user: %', first_user_id;
    ELSE
        RAISE NOTICE 'No users found';
    END IF;
END $$;

-- Step 6: Verify
SELECT 'Table created successfully' as status;
SELECT COUNT(*) as trial_count FROM public.user_trials;
SELECT * FROM public.user_trials;
