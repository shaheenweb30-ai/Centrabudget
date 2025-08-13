-- Create translations table for dynamic multi-language content
CREATE TABLE IF NOT EXISTS public.translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    language TEXT NOT NULL CHECK (language IN ('en', 'ar', 'tr')),
    section_id TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_color TEXT,
    button_text_color TEXT,
    title_color TEXT,
    subtitle_color TEXT,
    description_color TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(language, section_id)
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all translations" ON public.translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert translations" ON public.translations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update translations" ON public.translations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete translations" ON public.translations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS translations_language_idx ON public.translations(language);
CREATE INDEX IF NOT EXISTS translations_section_id_idx ON public.translations(section_id);
CREATE INDEX IF NOT EXISTS translations_language_section_idx ON public.translations(language, section_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON public.translations
    FOR EACH ROW
    EXECUTE FUNCTION update_translations_updated_at(); 