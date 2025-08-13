-- Update Pricing Config to Include 20% Yearly Discount
-- Run this in your Supabase SQL Editor

-- First, check if the pricing_config table exists and what's in it
SELECT 'Current pricing_config table state:' as info;
SELECT * FROM pricing_config;

-- Update the Pro plan yearly price to include 20% discount
-- Monthly: $12.00, Yearly: $115.20 (20% discount from $144.00)

UPDATE pricing_config 
SET 
  yearly_price = 115.20,
  updated_at = now()
WHERE plan_id = 'pro';

-- If no rows were updated, insert the new pricing
INSERT INTO pricing_config (plan_id, monthly_price, yearly_price, updated_at, updated_by)
SELECT 
  'pro',
  12.00,
  115.20,
  now(),
  (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM pricing_config WHERE plan_id = 'pro'
);

-- Verify the update
SELECT 'After update - pricing_config table state:' as info;
SELECT * FROM pricing_config WHERE plan_id = 'pro';

-- Alternative: If you want to completely reset to use default plans
-- DELETE FROM pricing_config WHERE plan_id = 'pro';
