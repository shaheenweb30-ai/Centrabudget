-- Create pricing_content table for dynamic pricing page management
CREATE TABLE public.pricing_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_color TEXT DEFAULT '#500CB0',
  button_text_color TEXT DEFAULT '#FFFFFF',
  title_color TEXT DEFAULT '#000000',
  subtitle_color TEXT DEFAULT '#666666',
  description_color TEXT DEFAULT '#666666',
  background_color TEXT DEFAULT '#FFFFFF',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pricing_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to pricing content" 
ON public.pricing_content 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage pricing content
CREATE POLICY "Allow authenticated users to insert pricing content" 
ON public.pricing_content 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update pricing content" 
ON public.pricing_content 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pricing_content_updated_at
BEFORE UPDATE ON public.pricing_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pricing content
INSERT INTO public.pricing_content (section_id, title, subtitle, description, button_text, background_color) VALUES
('hero', 'Choose Your Plan', 'Start free, upgrade when you need more', 'Everyone starts with our free plan. Upgrade to Pro when you need advanced features and unlimited access.', 'Start Free', '#1a1a1a'),
('free', 'Free', 'Perfect for getting started', 'Everything you need to begin your financial journey. No credit card required.', 'Current Plan', '#FFFFFF'),
('pro', 'Pro', 'Best for growing users', 'Advanced features for users who need more power and flexibility.', 'Upgrade to Pro', '#FFFFFF'),
('enterprise', 'Enterprise', 'For large organizations', 'Custom solutions with dedicated support and advanced security.', 'Contact Sales', '#FFFFFF');