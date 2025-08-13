-- Add admin role to a user
-- Replace 'your-email@example.com' with your actual email

-- First, let's see all users
SELECT id, email, full_name, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- Then add admin role to your user (replace with your email)
-- You can run this after you know your user ID

-- Option 1: Add by email (replace with your email)
INSERT INTO public.user_roles (user_id, role) 
SELECT u.id, 'admin'
FROM public.users u
WHERE u.email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Option 2: Add by user ID (replace with your actual user ID)
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Check if it worked
SELECT 
    u.email,
    u.full_name,
    ur.role
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
