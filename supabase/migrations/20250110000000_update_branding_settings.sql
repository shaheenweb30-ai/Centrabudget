-- Update existing branding settings with new GT Walsheim Pro branding
UPDATE public.branding_settings 
SET 
  business_name = 'CentraBudget',
  primary_color = '#1752F3',
  secondary_color = '#F0F0F0',
  accent_color = '#1A1A1A',
  font_family = 'GT Walsheim Pro',
  font_weights = '["300", "400", "500", "600", "700"]',
  typography_settings = '{"h1": {"size": "80px", "lineHeight": "92px", "weight": "300", "spacing": "-2%"}, "h2": {"size": "64px", "lineHeight": "72px", "weight": "300", "spacing": "-5%"}, "h3": {"size": "50px", "lineHeight": "56px", "weight": "300", "spacing": "-2%"}, "h4": {"size": "32px", "lineHeight": "40px", "weight": "300", "spacing": "-1%"}, "h5": {"size": "24px", "lineHeight": "28px", "weight": "400", "spacing": "0%"}, "body1": {"size": "18px", "lineHeight": "24px", "weight": "400", "spacing": "-2%"}, "body2": {"size": "16px", "lineHeight": "22px", "weight": "400", "spacing": "1%"}, "caption": {"size": "14px", "lineHeight": "18px", "weight": "300", "spacing": "0%"}}',
  updated_at = now()
WHERE id IS NOT NULL;
