-- Create a test trial for testing the checkout flow
-- Run this in your Supabase SQL editor

-- First, check if the table exists and has the right structure
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_trials'
) as table_exists;

-- If the table doesn't exist, create it
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

-- Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_trials' 
        AND policyname = 'Users can view own trial'
    ) THEN
        CREATE POLICY "Users can view own trial"
        ON public.user_trials FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_trials' 
        AND policyname = 'Users can create their own trial'
    ) THEN
        CREATE POLICY "Users can create their own trial"
        ON public.user_trials FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Insert a test trial (replace USER_ID_HERE with an actual user ID from your auth.users table)
-- INSERT INTO public.user_trials (user_id, plan_type, ends_at) 
-- VALUES ('USER_ID_HERE', 'pro', (now() + interval '14 days'));

-- Check the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_trials' 
ORDER BY ordinal_position;
