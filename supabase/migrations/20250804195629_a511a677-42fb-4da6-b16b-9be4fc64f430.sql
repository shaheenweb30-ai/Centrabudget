-- Create a storage bucket for content images (with upsert to handle existing bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete content images" ON storage.objects;

-- Create policies for content images bucket
CREATE POLICY "Anyone can view content images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-images');

CREATE POLICY "Admins can upload content images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete content images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-images' AND public.has_role(auth.uid(), 'admin'));