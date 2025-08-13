-- Remove trial functionality completely
-- This migration removes all trial-related tables, data, and functionality

-- Drop the user_trials table and all related data
DROP TABLE IF EXISTS public.user_trials CASCADE;

-- Remove any trial-related policies that might exist
-- (These will be automatically removed when the table is dropped)

-- Clean up any trial-related content from pricing_content
UPDATE public.pricing_content 
SET 
  button_text = 'Upgrade to Pro',
  description = 'Advanced features for users who need more power and flexibility.'
WHERE section_id = 'pro';

-- Remove any trial-related content from faqs
DELETE FROM public.faqs 
WHERE question LIKE '%trial%' 
   OR question LIKE '%14 days%'
   OR answer LIKE '%trial%'
   OR answer LIKE '%14 days%';

-- Update remaining FAQs to reflect no-trial structure
UPDATE public.faqs 
SET 
  question = 'How do I get started?',
  answer = 'Simply sign up for a free account and start using our basic features immediately. No credit card required.'
WHERE question = 'Is there a free plan?';

-- Add new FAQ about getting started
INSERT INTO public.faqs (question, answer, display_order, is_active)
SELECT 'What happens when I upgrade to Pro?', 'When you upgrade to Pro, you immediately get access to all advanced features including unlimited categories, budgets, advanced AI insights, team collaboration, and priority support.', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What happens when I upgrade to Pro?');

-- Update pricing comparison to remove trial references
UPDATE public.pricing_comparison 
SET 
  free_value = 'Included',
  free_is_boolean = true
WHERE feature IN (
  'Real-time expense tracking',
  'Basic categories',
  'Simple budgets',
  'CSV import/export',
  'Multi-currency support',
  'Community support'
);

-- Ensure Pro plan shows as the upgrade option
UPDATE public.pricing_comparison 
SET 
  pro_value = 'Unlimited',
  pro_is_boolean = true
WHERE feature IN (
  'Categories',
  'Budgets',
  'Transactions',
  'AI Insights'
);

-- Clean up any remaining trial references in other tables
-- (This will depend on your specific database structure)
