# Image Upload Fix Guide

## Issue
You're getting "Failed to upload image. Please try again." when trying to upload images in the hero section as an admin.

## Root Causes
1. **Storage Bucket Issues**: The storage bucket might not be properly created or configured
2. **Authentication Issues**: The user might not be properly authenticated
3. **Role Permission Issues**: The admin role check might be failing
4. **Storage Policy Issues**: The storage policies might be too restrictive

## Solutions

### 1. Apply Database Migrations
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  public = EXCLUDED.public;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update content images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete content images" ON storage.objects;

-- Create policies for content images bucket
CREATE POLICY "Anyone can view content images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'content-images');

-- Allow authenticated users to upload (fallback)
CREATE POLICY "Authenticated users can upload content images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update content images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'content-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete content images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'content-images' AND auth.uid() IS NOT NULL);

-- Admin-specific policies (if role checking works)
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
```

### 2. Verify Admin Role
Make sure your user has admin role:

```sql
-- Check if you have admin role
SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID' AND role = 'admin';

-- If not, add admin role
INSERT INTO user_roles (user_id, role) 
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 3. Test Storage Access
Use the debug button I added to test storage access. Click the "Debug" button next to the upload button and check the console for:
- User authentication status
- Admin role status  
- Storage access status

### 4. Check Console Errors
Open browser developer tools and check the console for detailed error messages when uploading. The improved error handling will show:
- Authentication errors
- Permission errors
- Bucket errors
- File format errors

### 5. Alternative Solutions

#### Option A: Use Public Storage (Temporary Fix)
If the role-based policies continue to fail, you can temporarily allow all authenticated users to upload:

```sql
-- Allow all authenticated users to upload (less secure but functional)
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'content-images' AND auth.uid() IS NOT NULL);
```

#### Option B: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to Storage > Buckets
3. Verify the `content-images` bucket exists and is public
4. Check the policies in Storage > Policies

### 6. Testing Steps
1. **Clear browser cache** and reload the page
2. **Log out and log back in** to refresh authentication
3. **Try uploading a small image** (under 1MB) first
4. **Check the console** for detailed error messages
5. **Use the debug button** to verify all systems are working

### 7. Common Issues and Solutions

#### Issue: "JWT" error
**Solution**: Log out and log back in to refresh the authentication token

#### Issue: "Policy" error  
**Solution**: The storage policies are too restrictive - apply the fallback policies above

#### Issue: "Bucket" error
**Solution**: The storage bucket doesn't exist - run the bucket creation SQL

#### Issue: "File" error
**Solution**: Try a different image format (PNG, JPG, JPEG)

### 8. Debug Information
The improved code now provides detailed debugging information in the console:
- File details (size, type, name)
- User authentication status
- Admin role verification
- Storage access test results
- Detailed error messages

### 9. Final Notes
- The storage bucket must be public for images to be accessible
- File size limit is 5MB
- Supported formats: PNG, JPG, JPEG, SVG
- Make sure you're logged in as an admin user
- Check that your Supabase project has storage enabled

If the issue persists after trying these solutions, check the console for the specific error message and let me know what it says.
