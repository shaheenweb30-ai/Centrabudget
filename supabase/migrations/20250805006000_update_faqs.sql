-- Update FAQs to reflect new free plan structure
-- All users start with free plan, can upgrade to Pro

-- Update existing FAQ about free trial
UPDATE public.faqs 
SET 
  question = 'Is there a free plan?',
  answer = 'Yes! Everyone starts with our free plan. No credit card required to get started with basic financial management features.'
WHERE question = 'Is there a free trial?';

-- Update FAQ about cancellation
UPDATE public.faqs 
SET 
  question = 'Can I upgrade or downgrade anytime?',
  answer = 'Absolutely. Upgrade to Pro when you need more features, or downgrade back to free anytime. No questions asked.'
WHERE question = 'Can I cancel anytime?';

-- Update FAQ about refunds
UPDATE public.faqs 
SET 
  question = 'Do you offer refunds?',
  answer = 'Yes, we offer a 30-day money-back guarantee on Pro subscriptions if you''re not completely satisfied.'
WHERE question = 'Do you offer refunds?';

-- Update FAQ about hidden fees
UPDATE public.faqs 
SET 
  question = 'Are there any hidden fees?',
  answer = 'Never. What you see is what you pay. The free plan is completely free, and Pro has transparent pricing with no setup fees or surprises.'
WHERE question = 'Are there any hidden fees?';

-- Add new FAQ about free plan
INSERT INTO public.faqs (question, answer, display_order, is_active)
SELECT 'What features are included in the free plan?', 'The free plan includes real-time expense tracking, up to 10 categories, 1 budget, basic AI insights (5 tips/month), CSV import/export, multi-currency support, and community support.', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What features are included in the free plan?');

-- Add new FAQ about upgrading
INSERT INTO public.faqs (question, answer, display_order, is_active)
SELECT 'When should I upgrade to Pro?', 'Upgrade to Pro when you need unlimited categories and budgets, advanced AI insights (50+ tips/month), recurring transaction detection, custom budget periods, receipt attachments, team collaboration, and priority support.', 6, true
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'When should I upgrade to Pro?');

-- Add new FAQ about plan differences
INSERT INTO public.faqs (question, answer, display_order, is_active)
SELECT 'What''s the difference between Free and Pro?', 'Free gives you essential features to get started. Pro adds unlimited access, advanced features, team collaboration, API access, and priority support for growing users who need more power.', 7, true
WHERE NOT EXISTS (SELECT 1 FROM public.faqs WHERE question = 'What''s the difference between Free and Pro?');
