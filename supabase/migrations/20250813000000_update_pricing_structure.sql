-- Update pricing structure to remove trial functionality and implement new free plan structure
-- This migration updates existing pricing content to reflect the new structure

-- Update hero section to emphasize "Start free, upgrade when you need more"
UPDATE public.pricing_content 
SET 
  subtitle = 'Start free, upgrade when you need more',
  description = 'Everyone starts with our free plan. Upgrade to Pro when you need advanced features and unlimited access.',
  button_text = 'Start Free'
WHERE section_id = 'hero';

-- Update free plan to show as "Current Plan" for users
UPDATE public.pricing_content 
SET 
  title = 'Free',
  subtitle = 'Perfect for getting started',
  description = 'Everything you need to begin your financial journey. No credit card required.',
  button_text = 'Current Plan',
  price = 0.00
WHERE section_id = 'free';

-- Update Pro plan to show "Upgrade to Pro" for existing users
UPDATE public.pricing_content 
SET 
  title = 'Pro',
  subtitle = 'Best for growing users',
  description = 'Advanced features for users who need more power and flexibility.',
  button_text = 'Upgrade to Pro',
  price = 12.00
WHERE section_id = 'pro';

-- Update Enterprise plan
UPDATE public.pricing_content 
SET 
  title = 'Enterprise',
  subtitle = 'For teams and organizations',
  description = 'Custom solutions with dedicated support and advanced team features.',
  button_text = 'Contact Sales',
  price = 29.00
WHERE section_id = 'enterprise';
