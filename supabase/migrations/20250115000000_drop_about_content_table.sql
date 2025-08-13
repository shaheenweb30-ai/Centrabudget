-- Drop about_content table and related objects
-- This migration removes the about_content table since the about page has been removed

-- Drop indexes first
DROP INDEX IF EXISTS idx_about_content_section_id;

-- Drop policies
DROP POLICY IF EXISTS "Allow authenticated users to read about_content" ON public.about_content;
DROP POLICY IF EXISTS "Allow admin users to manage about_content" ON public.about_content;

-- Drop the table
DROP TABLE IF EXISTS public.about_content;
