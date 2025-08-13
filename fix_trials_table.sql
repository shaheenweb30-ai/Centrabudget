-- Fix user_trials table by adding plan_type column and updating existing data
-- Run this script in your Supabase SQL editor

-- Add plan_type column if it doesn't exist
ALTER TABLE public.user_trials 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'pro';

-- Update existing records to have 'pro' as plan_type
UPDATE public.user_trials 
SET plan_type = 'pro' 
WHERE plan_type IS NULL;

-- Make the column NOT NULL
ALTER TABLE public.user_trials 
ALTER COLUMN plan_type SET NOT NULL;

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_trials_plan_type_check'
    ) THEN
        ALTER TABLE public.user_trials 
        ADD CONSTRAINT user_trials_plan_type_check 
        CHECK (plan_type IN ('pro', 'enterprise'));
    END IF;
END $$;

-- Update default value for ends_at to be 14 days
ALTER TABLE public.user_trials 
ALTER COLUMN ends_at SET DEFAULT (now() + interval '14 days');

-- Update existing active trials to extend them to 14 days
UPDATE public.user_trials 
SET ends_at = (started_at + interval '14 days')
WHERE ends_at < now() + interval '1 day' 
AND ends_at > started_at;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_trials' 
ORDER BY ordinal_position;
