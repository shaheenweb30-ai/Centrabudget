-- Check admin users in the database
-- This script will show all users with admin role

-- Show all admin users with their details
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.created_at,
    ur.role,
    ur.created_at as role_created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY u.created_at DESC;

-- Show count of users by role
SELECT 
    ur.role,
    COUNT(*) as user_count
FROM public.user_roles ur
GROUP BY ur.role
ORDER BY user_count DESC;

-- Show all users and their roles
SELECT 
    u.email,
    u.full_name,
    COALESCE(ur.role, 'user') as role,
    u.created_at
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;
