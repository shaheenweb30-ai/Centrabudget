-- Update pricing comparison table to reflect new free plan structure
-- Remove trial references and add new Pro features

-- Update existing features to show proper free plan limits
UPDATE public.pricing_comparison 
SET 
  free_value = 'Up to 10',
  free_is_boolean = false
WHERE feature = 'Categories';

UPDATE public.pricing_comparison 
SET 
  free_value = '1',
  free_is_boolean = false
WHERE feature = 'Budgets';

UPDATE public.pricing_comparison 
SET 
  free_value = '5 tips/month',
  free_is_boolean = false
WHERE feature = 'AI Insights';

UPDATE public.pricing_comparison 
SET 
  free_value = '100',
  free_is_boolean = false
WHERE feature = 'Transactions';

-- Update Pro plan to show unlimited access
UPDATE public.pricing_comparison 
SET 
  pro_value = 'Unlimited',
  pro_is_boolean = true
WHERE feature IN ('Categories', 'Budgets', 'Transactions');

UPDATE public.pricing_comparison 
SET 
  pro_value = '50+ tips/month',
  pro_is_boolean = false
WHERE feature = 'AI Insights';

-- Add new Pro features
INSERT INTO public.pricing_comparison (feature, free_value, free_is_boolean, pro_value, pro_is_boolean, enterprise_value, enterprise_is_boolean, display_order, is_active)
VALUES 
  ('Recurring Detection', 'Basic', false, 'Advanced', false, 'Custom', false, 15, true),
  ('Custom Budget Periods', 'Monthly only', false, 'Custom periods', false, 'Custom periods', false, 16, true),
  ('Receipt Attachments', 'Not included', false, 'Unlimited', false, 'Unlimited', false, 17, true),
  ('Team Collaboration', 'Not included', false, 'Up to 5 users', false, 'Unlimited', false, 18, true),
  ('API Access', 'Not included', false, 'Included', false, 'Custom', false, 19, true),
  ('White-label Options', 'Not included', false, 'Basic', false, 'Full', false, 20, true),
  ('Priority Support', 'Community', false, 'Email + Chat', false, 'Dedicated', false, 21, true)
ON CONFLICT (feature) DO NOTHING;

-- Update existing features to show proper values
UPDATE public.pricing_comparison 
SET 
  free_value = 'Included',
  free_is_boolean = true,
  pro_value = 'Included',
  pro_is_boolean = true,
  enterprise_value = 'Included',
  enterprise_is_boolean = true
WHERE feature IN (
  'Real-time expense tracking',
  'CSV import/export',
  'Multi-currency support',
  'Mobile app access'
);
