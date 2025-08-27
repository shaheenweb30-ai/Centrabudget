-- Create User Subscriptions Table
-- This table tracks user subscription status and billing information
-- Run this in your Supabase SQL editor

-- Create the user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('pro', 'enterprise')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'paused', 'past_due')),
  paddle_subscription_id TEXT UNIQUE,
  paddle_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Ensure one subscription per user
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_paddle_subscription_id ON public.user_subscriptions(paddle_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_current_period_end ON public.user_subscriptions(current_period_end);

-- Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own subscription
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own subscription (for status changes)
CREATE POLICY "Users can update own subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can insert/update (for webhooks)
CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_subscriptions_updated_at();

-- Insert some sample data for testing (optional)
-- Uncomment and modify if you want to test with existing users
/*
INSERT INTO public.user_subscriptions (
  user_id,
  plan_id,
  billing_cycle,
  status,
  paddle_subscription_id,
  paddle_customer_id,
  current_period_start,
  current_period_end
) VALUES (
  'USER_ID_HERE', -- Replace with actual user ID
  'pro',
  'monthly',
  'active',
  'test_sub_123',
  'test_customer_456',
  NOW(),
  NOW() + INTERVAL '1 month'
) ON CONFLICT (user_id) DO NOTHING;
*/

-- Success message
SELECT '✅ User subscriptions table created successfully' as result;
SELECT 'Features: plan tracking, billing cycles, Paddle integration, RLS policies' as note;
