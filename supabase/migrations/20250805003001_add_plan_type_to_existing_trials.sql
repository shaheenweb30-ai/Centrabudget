-- Add plan_type column to existing user_trials table if it doesn't exist
DO $$ 
BEGIN
    -- Check if plan_type column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_trials' 
        AND column_name = 'plan_type'
    ) THEN
        -- Add the column
        ALTER TABLE public.user_trials ADD COLUMN plan_type TEXT DEFAULT 'pro';
        
        -- Update existing records to have 'pro' as plan_type
        UPDATE public.user_trials SET plan_type = 'pro' WHERE plan_type IS NULL;
        
        -- Make the column NOT NULL after setting default values
        ALTER TABLE public.user_trials ALTER COLUMN plan_type SET NOT NULL;
        
        -- Add the check constraint
        ALTER TABLE public.user_trials ADD CONSTRAINT user_trials_plan_type_check 
        CHECK (plan_type IN ('pro', 'enterprise'));
        
        RAISE NOTICE 'Added plan_type column to user_trials table';
    ELSE
        RAISE NOTICE 'plan_type column already exists in user_trials table';
    END IF;
END $$;

-- Update the default value for ends_at to be 14 days instead of 1 day
ALTER TABLE public.user_trials 
ALTER COLUMN ends_at SET DEFAULT (now() + interval '14 days');

-- Update existing trials to extend them to 14 days if they're still active
UPDATE public.user_trials 
SET ends_at = (started_at + interval '14 days')
WHERE ends_at < now() + interval '1 day' 
AND ends_at > started_at;
