-- Simple function to make a user Pro
-- Run this in Supabase SQL editor

-- Function to promote a user to Pro by email
CREATE OR REPLACE FUNCTION make_user_pro_simple(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO target_user_id
    FROM public.users
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN 'User not found: ' || user_email;
    END IF;
    
    -- Remove existing role and add Pro role
    DELETE FROM public.user_roles WHERE user_id = target_user_id;
    INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'subscriber');
    
    RETURN 'Success: ' || user_email || ' is now Pro!';
END;
$$;

-- Test the function (replace with actual email)
-- SELECT make_user_pro_simple('your-email@example.com');

-- Check current user roles
-- SELECT u.email, ur.role FROM public.users u LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
