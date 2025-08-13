-- Test script for make_user_pro function
-- Run this in Supabase SQL editor

-- Step 1: Create the function (if not already created)
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

-- Step 2: Test the function (replace 'test@example.com' with actual email)
-- SELECT make_user_pro_simple('test@example.com');

-- Step 3: Verify the result
-- SELECT u.email, ur.role 
-- FROM public.users u 
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id
-- WHERE u.email = 'test@example.com';

-- Step 4: Check all user roles
-- SELECT u.email, ur.role, ur.created_at
-- FROM public.users u
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id
-- ORDER BY u.email;
