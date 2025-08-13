-- SQL function to make a user a Pro user
-- This function promotes a user to Pro (subscriber role) and removes any existing trials

-- Function to promote a user to Pro
CREATE OR REPLACE FUNCTION make_user_pro(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
    existing_role TEXT;
    result_message TEXT;
BEGIN
    -- Check if user exists
    SELECT id INTO target_user_id
    FROM public.users
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN 'ERROR: User with email ' || user_email || ' not found';
    END IF;
    
    -- Check current role
    SELECT role INTO existing_role
    FROM public.user_roles
    WHERE user_id = target_user_id;
    
    -- If user is already Pro, return early
    IF existing_role = 'subscriber' THEN
        RETURN 'User ' || user_email || ' is already a Pro user';
    END IF;
    
    -- Remove any existing roles for this user
    DELETE FROM public.user_roles
    WHERE user_id = target_user_id;
    
    -- Add Pro role (subscriber)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'subscriber');
    
    -- Note: user_trials table has been removed from this database
    
    -- Log the promotion
    INSERT INTO public.user_roles (user_id, role, created_at)
    VALUES (target_user_id, 'subscriber', NOW())
    ON CONFLICT (user_id, role) DO NOTHING;
    
    result_message := 'User ' || user_email || ' successfully promoted to Pro';
    
    -- Return success message
    RETURN result_message;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback and return error
        ROLLBACK;
        RETURN 'ERROR: Failed to promote user to Pro - ' || SQLERRM;
END;
$$;

-- Function to promote a user to Pro by user ID (alternative)
CREATE OR REPLACE FUNCTION make_user_pro_by_id(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email TEXT;
    existing_role TEXT;
    result_message TEXT;
BEGIN
    -- Check if user exists
    SELECT email INTO user_email
    FROM public.users
    WHERE id = target_user_id;
    
    IF user_email IS NULL THEN
        RETURN 'ERROR: User with ID ' || target_user_id || ' not found';
    END IF;
    
    -- Check current role
    SELECT role INTO existing_role
    FROM public.user_roles
    WHERE user_id = target_user_id;
    
    -- If user is already Pro, return early
    IF existing_role = 'subscriber' THEN
        RETURN 'User ' || user_email || ' is already a Pro user';
    END IF;
    
    -- Remove any existing roles for this user
    DELETE FROM public.user_roles
    WHERE user_id = target_user_id;
    
    -- Add Pro role (subscriber)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'subscriber');
    
    -- Note: user_trials table has been removed from this database
    
    result_message := 'User ' || user_email || ' successfully promoted to Pro';
    
    -- Return success message
    RETURN result_message;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback and return error
        ROLLBACK;
        RETURN 'ERROR: Failed to promote user to Pro - ' || SQLERRM;
END;
$$;

-- Function to check user's current plan status
CREATE OR REPLACE FUNCTION get_user_plan_status(user_email TEXT)
RETURNS TABLE(
    email TEXT,
    user_id UUID,
    user_role TEXT,
    is_pro BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.email,
        u.id as user_id,
        COALESCE(ur.role, 'no role') as user_role,
        (ur.role = 'subscriber') as is_pro
    FROM public.users u
    LEFT JOIN public.user_roles ur ON u.id = ur.user_id
    WHERE u.email = user_email;
END;
$$;

-- Example usage and testing
-- Uncomment and modify the email to test:

/*
-- Test the function
SELECT make_user_pro('user@example.com');

-- Check the result
SELECT * FROM get_user_plan_status('user@example.com');

-- Verify in user_roles table
SELECT 
    u.email,
    ur.role,
    ur.created_at
FROM public.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'user@example.com';
*/

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION make_user_pro(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION make_user_pro_by_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_plan_status(TEXT) TO authenticated;
