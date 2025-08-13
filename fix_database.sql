-- Comprehensive fix for user_trials table
-- Run this in your Supabase SQL editor

-- Step 1: Check if user_trials table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_trials'
) as table_exists;

-- Step 2: Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_trials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null default 'pro' check (plan_type in ('pro', 'enterprise')),
  started_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- Step 3: Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own trial" ON public.user_trials;
    DROP POLICY IF EXISTS "Users can create their own trial" ON public.user_trials;
    
    -- Create new policies
    CREATE POLICY "Users can view own trial"
    ON public.user_trials FOR SELECT
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can create their own trial"
    ON public.user_trials FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE 'Policies created successfully';
END $$;

-- Step 5: Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_user_trials_updated_at'
    ) THEN
        CREATE TRIGGER update_user_trials_updated_at
        BEFORE UPDATE ON public.user_trials
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        RAISE NOTICE 'Trigger created successfully';
    ELSE
        RAISE NOTICE 'Trigger already exists';
    END IF;
END $$;

-- Step 6: Verify table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_trials' 
ORDER BY ordinal_position;

-- Step 7: Check if there are any existing trials
SELECT COUNT(*) as existing_trials FROM public.user_trials;

-- Step 8: Show current user (if any)
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
