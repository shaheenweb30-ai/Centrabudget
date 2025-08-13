-- CentraBudget Database Setup Script
-- Run this in your Supabase SQL Editor to set up all tables and data

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create images table for dynamic image management
CREATE TABLE public.images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    file_path text NOT NULL,
    file_url text NOT NULL,
    file_size integer,
    mime_type text,
    width integer,
    height integer,
    alt_text text,
    tags text[],
    is_featured boolean DEFAULT false,
    is_public boolean DEFAULT true,
    uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create homepage_content table for editable content
CREATE TABLE public.homepage_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    title_color text,
    subtitle_color text,
    description_color text,
    image_url text,
    image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
    background_color text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create about_content table
CREATE TABLE public.about_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    title_color text,
    subtitle_color text,
    description_color text,
    image_url text,
    image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
    background_color text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_content table
CREATE TABLE public.contact_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    title_color text,
    subtitle_color text,
    description_color text,
    image_url text,
    image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
    background_color text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create features_content table
CREATE TABLE public.features_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    title_color text,
    subtitle_color text,
    description_color text,
    image_url text,
    image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
    background_color text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pricing_content table
CREATE TABLE public.pricing_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    title text,
    subtitle text,
    description text,
    button_text text,
    button_color text,
    button_text_color text,
    title_color text,
    subtitle_color text,
    description_color text,
    image_url text,
    image_id uuid REFERENCES public.images(id) ON DELETE SET NULL,
    background_color text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create translations table
CREATE TABLE public.translations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text NOT NULL,
    en text,
    ar text,
    tr text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (key)
);

-- Create transactions table
CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount decimal(10,2) NOT NULL,
    description text NOT NULL,
    category_id uuid,
    transaction_date date NOT NULL DEFAULT CURRENT_DATE,
    type text CHECK (type IN ('income', 'expense')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    color text,
    icon text,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    is_default boolean DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budgets table
CREATE TABLE public.budgets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
    amount decimal(10,2) NOT NULL,
    period text CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')) NOT NULL DEFAULT 'monthly',
    start_date date NOT NULL,
    end_date date,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for images
CREATE POLICY "Anyone can view public images" 
ON public.images 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can view all images" 
ON public.images 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert images" 
ON public.images 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images" 
ON public.images 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images" 
ON public.images 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for homepage_content
CREATE POLICY "Anyone can view homepage content" 
ON public.homepage_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update homepage content" 
ON public.homepage_content 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert homepage content" 
ON public.homepage_content 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete homepage content" 
ON public.homepage_content 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for other content tables (same pattern)
CREATE POLICY "Anyone can view about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Admins can update about content" ON public.about_content FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert about content" ON public.about_content FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete about content" ON public.about_content FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view contact content" ON public.contact_content FOR SELECT USING (true);
CREATE POLICY "Admins can update contact content" ON public.contact_content FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert contact content" ON public.contact_content FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact content" ON public.contact_content FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view features content" ON public.features_content FOR SELECT USING (true);
CREATE POLICY "Admins can update features content" ON public.features_content FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert features content" ON public.features_content FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete features content" ON public.features_content FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view pricing content" ON public.pricing_content FOR SELECT USING (true);
CREATE POLICY "Admins can update pricing content" ON public.pricing_content FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert pricing content" ON public.pricing_content FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete pricing content" ON public.pricing_content FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Admins can update translations" ON public.translations FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert translations" ON public.translations FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete translations" ON public.translations FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Policies for user data
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id OR is_default = true);
CREATE POLICY "Users can insert own categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

-- Insert default images
INSERT INTO public.images (name, description, file_path, file_url, mime_type, width, height, alt_text, tags, is_featured) VALUES
('Hero Image', 'Main hero section image', '/lovable-uploads/8a5e2d6b-3701-45cb-8c4a-072de28f0972.png', 'https://rjjflvdxomgyxqgdsewk.supabase.co/storage/v1/object/public/lovable-uploads/8a5e2d6b-3701-45cb-8c4a-072de28f0972.png', 'image/png', 800, 600, 'Financial dashboard hero image', ARRAY['hero', 'dashboard', 'finance'], true),
('Empower Section', 'Empower your financial future image', '/lovable-uploads/44b36532-c7fa-41dd-8359-e4f1cb631d30.png', 'https://rjjflvdxomgyxqgdsewk.supabase.co/storage/v1/object/public/lovable-uploads/44b36532-c7fa-41dd-8359-e4f1cb631d30.png', 'image/png', 800, 600, 'Empower financial future', ARRAY['empower', 'finance', 'future'], false),
('Track Expenses', 'Track your expenses easily image', '/lovable-uploads/05e650a3-966d-4ae9-aa26-f123f9802b09.png', 'https://rjjflvdxomgyxqgdsewk.supabase.co/storage/v1/object/public/lovable-uploads/05e650a3-966d-4ae9-aa26-f123f9802b09.png', 'image/png', 800, 600, 'Track expenses easily', ARRAY['expenses', 'tracking', 'finance'], false),
('Financial Analytics', 'Financial analytics dashboard', '/lovable-uploads/100a1fe7-827d-47cd-8729-df1b9cb0b7ff.png', 'https://rjjflvdxomgyxqgdsewk.supabase.co/storage/v1/object/public/lovable-uploads/100a1fe7-827d-47cd-8729-df1b9cb0b7ff.png', 'image/png', 800, 600, 'Financial analytics dashboard', ARRAY['analytics', 'dashboard', 'finance'], false),
('Budget Management', 'Budget management interface', '/lovable-uploads/b1655491-5f43-4f20-9b15-6638b26f610d.png', 'https://rjjflvdxomgyxqgdsewk.supabase.co/storage/v1/object/public/lovable-uploads/b1655491-5f43-4f20-9b15-6638b26f610d.png', 'image/png', 800, 600, 'Budget management interface', ARRAY['budget', 'management', 'finance'], false);

-- Insert default homepage content with image references
INSERT INTO public.homepage_content (section_id, title, subtitle, description, button_text, button_color, button_text_color, image_url, image_id, background_color) VALUES
('hero', 'Maximize 💰 Your Financial Potential', 'All-in-one Financial Analytics Dashboard', '', 'Get Started', '#500CB0', '#FFFFFF', '/lovable-uploads/8a5e2d6b-3701-45cb-8c4a-072de28f0972.png', (SELECT id FROM public.images WHERE name = 'Hero Image'), ''),
('empower', 'Empower Your Financial Future with us', 'Comprehensive Financial Analytics Dashboard', 'Gain real-time visibility into your financial performance with intuitive dashboards.', '', '', '', '/lovable-uploads/44b36532-c7fa-41dd-8359-e4f1cb631d30.png', (SELECT id FROM public.images WHERE name = 'Empower Section'), ''),
('track-expenses', 'Track Your all the Expense Easily', '', 'Effortlessly monitor and manage all your expenses with our intuitive tracking system. Stay on top of your finances by easily recording and categorizing expenses, ensuring you have a clear overview of your spending habits.', 'Get Started', '#500CB0', '#FFFFFF', '/lovable-uploads/05e650a3-966d-4ae9-aa26-f123f9802b09.png', (SELECT id FROM public.images WHERE name = 'Track Expenses'), ''),
('send-money', 'Send Money Across the Globe', '', 'Transfer money instantly to anywhere in the world with our secure and reliable global payment system.', '', '', '', '', NULL, ''),
('achieve-excellence', 'Achieve Financial Excellence', '', 'Take control of your financial future with our comprehensive suite of tools designed for success.', '', '', '', '', NULL, ''),
('integrations', 'Integrate With Your Favorite Tools', '', 'Connect with all your favorite financial tools and platforms for a seamless experience.', 'Explore Integrations', '#500CB0', '#FFFFFF', '', NULL, ''),
('final-cta', 'Ready to Run your Business Better with us', '', 'Join thousands of businesses that trust our platform for their financial management needs.', 'Get Started', '#500CB0', '#FFFFFF', '', NULL, ''),
('main-cta', 'Ready to Run your Business Better with us', '', 'Welcome to FinSuite, where financial management meets simplicity and efficiency.', 'Get Started', '#3B82F6', '#FFFFFF', '', NULL, ''),
('live-chat', 'Live Chat', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Book a Call', '', '#FFFFFF', '', NULL, ''),
('watch-demo', 'Watch a Demo', '', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Watch Now', '', '#000000', '', NULL, '');

-- Insert default translations
INSERT INTO public.translations (key, en, ar, tr) VALUES
('common.loading', 'Loading...', 'جاري التحميل...', 'Yükleniyor...'),
('common.error', 'Error', 'خطأ', 'Hata'),
('common.success', 'Success', 'نجح', 'Başarılı'),
('home.hero.title', 'Take Control of Your Money', 'تحكم في أموالك', 'Paranızı Kontrol Edin'),
('home.hero.subtitle', 'Every cent with purpose', 'كل قرش له هدف', 'Her kuruşun amacı var'),
('home.hero.button', 'Get Started Free', 'ابدأ مجاناً', 'Ücretsiz Başlayın');

-- Insert default categories
INSERT INTO public.categories (name, color, icon, is_default) VALUES
('Food & Dining', '#FF6B6B', 'utensils', true),
('Transportation', '#4ECDC4', 'car', true),
('Shopping', '#45B7D1', 'shopping-bag', true),
('Entertainment', '#96CEB4', 'film', true),
('Healthcare', '#FFEAA7', 'heart', true),
('Utilities', '#DDA0DD', 'zap', true),
('Housing', '#98D8C8', 'home', true),
('Education', '#F7DC6F', 'book', true),
('Travel', '#BB8FCE', 'plane', true),
('Other', '#A8E6CF', 'more-horizontal', true);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON public.images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON public.homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
    BEFORE UPDATE ON public.about_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_content_updated_at
    BEFORE UPDATE ON public.contact_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_features_content_updated_at
    BEFORE UPDATE ON public.features_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_content_updated_at
    BEFORE UPDATE ON public.pricing_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON public.translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint for transactions
ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_category 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
