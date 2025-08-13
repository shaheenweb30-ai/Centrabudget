-- Revert Branding Settings to Original CentraBudget Branding
-- Run this in your Supabase SQL Editor to restore original branding

-- First, let's check if branding_settings table exists and has data
DO $$
BEGIN
    -- Check if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'branding_settings') THEN
        -- Update existing branding settings to original CentraBudget values
        UPDATE public.branding_settings 
        SET 
            business_name = 'CentraBudget',
            logo_url = NULL,
            favicon_url = NULL,
            primary_color = '#1752F3',
            secondary_color = '#F0F0F0',
            accent_color = '#1A1A1A',
            font_family = 'GT Walsheim Pro',
            font_weights = '["300", "400", "500", "600", "700"]',
            typography_settings = '{"h1": {"size": "80px", "lineHeight": "92px", "weight": "300", "spacing": "-2%"}, "h2": {"size": "64px", "lineHeight": "72px", "weight": "300", "spacing": "-5%"}, "h3": {"size": "50px", "lineHeight": "56px", "weight": "300", "spacing": "-2%"}, "h4": {"size": "32px", "lineHeight": "40px", "weight": "300", "spacing": "-1%"}, "h5": {"size": "24px", "lineHeight": "28px", "weight": "400", "spacing": "0%"}, "body1": {"size": "18px", "lineHeight": "24px", "weight": "400", "spacing": "-2%"}, "body2": {"size": "16px", "lineHeight": "22px", "weight": "400", "spacing": "1%"}, "caption": {"size": "14px", "lineHeight": "18px", "weight": "300", "spacing": "0%"}}',
            updated_at = now()
        WHERE id = (SELECT id FROM public.branding_settings LIMIT 1);
        
        -- If no rows were updated, insert default branding settings
        IF NOT FOUND THEN
            INSERT INTO public.branding_settings (
                business_name, 
                logo_url, 
                favicon_url,
                primary_color, 
                secondary_color, 
                accent_color, 
                font_family,
                font_weights,
                typography_settings
            ) VALUES (
                'CentraBudget',
                NULL,
                NULL,
                '#1752F3',
                '#F0F0F0',
                '#1A1A1A',
                'GT Walsheim Pro',
                '["300", "400", "500", "600", "700"]',
                '{"h1": {"size": "80px", "lineHeight": "92px", "weight": "300", "spacing": "-2%"}, "h2": {"size": "64px", "lineHeight": "72px", "weight": "300", "spacing": "-5%"}, "h3": {"size": "50px", "lineHeight": "56px", "weight": "300", "spacing": "-2%"}, "h4": {"size": "32px", "lineHeight": "40px", "weight": "300", "spacing": "-1%"}, "h5": {"size": "24px", "lineHeight": "28px", "weight": "400", "spacing": "0%"}, "body1": {"size": "18px", "lineHeight": "24px", "weight": "400", "spacing": "-2%"}, "body2": {"size": "16px", "lineHeight": "22px", "weight": "400", "spacing": "1%"}, "caption": {"size": "14px", "lineHeight": "18px", "weight": "300", "spacing": "0%"}}'
            );
        END IF;
        
        RAISE NOTICE 'Branding settings reverted to CentraBudget successfully!';
    ELSE
        RAISE NOTICE 'Branding settings table does not exist. Please run the full database setup first.';
    END IF;
END $$;

        -- Also revert homepage content to original CentraBudget branding
UPDATE public.homepage_content 
SET 
    title = CASE 
        WHEN section_id = 'hero' THEN 'Take Control of Your Money'
        WHEN section_id = 'empower' THEN 'Empower Your Financial Future'
        WHEN section_id = 'track-expenses' THEN 'Track Your Expenses Easily'
        WHEN section_id = 'send-money' THEN 'Send Money Across the Globe'
        WHEN section_id = 'achieve-excellence' THEN 'Achieve Financial Excellence'
        WHEN section_id = 'integrations' THEN 'Integrate With Your Favorite Tools'
        WHEN section_id = 'final-cta' THEN 'Ready to Take Control of Your Finances?'
        WHEN section_id = 'main-cta' THEN 'Start Your Financial Journey Today'
        WHEN section_id = 'live-chat' THEN 'Live Chat'
        WHEN section_id = 'watch-demo' THEN 'Watch a Demo'
        ELSE title
    END,
    subtitle = CASE 
        WHEN section_id = 'hero' THEN 'Every cent with purpose'
        WHEN section_id = 'empower' THEN 'Comprehensive Financial Analytics Dashboard'
        ELSE subtitle
    END,
    description = CASE 
        WHEN section_id = 'track-expenses' THEN 'Effortlessly monitor and manage all your expenses with our intuitive tracking system. Stay on top of your finances by easily recording and categorizing expenses, ensuring you have a clear overview of your spending habits.'
        WHEN section_id = 'send-money' THEN 'Transfer money instantly to anywhere in the world with our secure and reliable global payment system.'
        WHEN section_id = 'achieve-excellence' THEN 'Take control of your financial future with our comprehensive suite of tools designed for success.'
        WHEN section_id = 'integrations' THEN 'Connect with all your favorite financial tools and platforms for a seamless experience.'
        WHEN section_id = 'final-cta' THEN 'Join thousands of users who are already managing their money better with CentraBudget.'
        WHEN section_id = 'main-cta' THEN 'Welcome to CentraBudget, where financial management meets simplicity and efficiency.'
        WHEN section_id = 'live-chat' THEN 'Get instant help from our financial experts.'
        WHEN section_id = 'watch-demo' THEN 'See how CentraBudget can transform your financial management.'
        ELSE description
    END,
    button_text = CASE 
        WHEN section_id = 'hero' THEN 'Get Started Free'
        WHEN section_id = 'track-expenses' THEN 'Get Started'
        WHEN section_id = 'integrations' THEN 'Explore Integrations'
        WHEN section_id = 'final-cta' THEN 'Get Started'
        WHEN section_id = 'main-cta' THEN 'Get Started'
        WHEN section_id = 'live-chat' THEN 'Book a Call'
        WHEN section_id = 'watch-demo' THEN 'Watch Now'
        ELSE button_text
    END,
    button_color = CASE 
        WHEN section_id IN ('hero', 'track-expenses', 'integrations', 'final-cta') THEN '#1752F3'
        WHEN section_id = 'main-cta' THEN '#1752F3'
        ELSE button_color
    END,
    button_text_color = CASE 
        WHEN section_id IN ('hero', 'track-expenses', 'integrations', 'final-cta', 'main-cta') THEN '#FFFFFF'
        WHEN section_id = 'live-chat' THEN '#FFFFFF'
        WHEN section_id = 'watch-demo' THEN '#000000'
        ELSE button_text_color
    END,
    updated_at = now()
WHERE section_id IN ('hero', 'empower', 'track-expenses', 'send-money', 'achieve-excellence', 'integrations', 'final-cta', 'main-cta', 'live-chat', 'watch-demo');

-- Update translations to CentraBudget branding
UPDATE public.translations 
SET 
    en = CASE 
        WHEN key = 'home.hero.title' THEN 'Take Control of Your Money'
        WHEN key = 'home.hero.subtitle' THEN 'Every cent with purpose'
        WHEN key = 'home.hero.button' THEN 'Get Started Free'
        ELSE en
    END,
    ar = CASE 
        WHEN key = 'home.hero.title' THEN 'تحكم في أموالك'
        WHEN key = 'home.hero.subtitle' THEN 'كل قرش له هدف'
        WHEN key = 'home.hero.button' THEN 'ابدأ مجاناً'
        ELSE ar
    END,
    tr = CASE 
        WHEN key = 'home.hero.title' THEN 'Paranızı Kontrol Edin'
        WHEN key = 'home.hero.subtitle' THEN 'Her kuruşun amacı var'
        WHEN key = 'home.hero.button' THEN 'Ücretsiz Başlayın'
        ELSE tr
    END,
    updated_at = now()
WHERE key IN ('home.hero.title', 'home.hero.subtitle', 'home.hero.button');

-- Display current branding settings for verification
SELECT 
    business_name,
    logo_url,
    primary_color,
    secondary_color,
    accent_color,
    font_family
FROM public.branding_settings 
LIMIT 1;
