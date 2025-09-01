-- Add a lightweight function to (re)activate a user's subscription and ensure
-- their role is set to 'subscriber'. This matches calls from the webhook
-- handler (reactivate_user_subscription).

CREATE OR REPLACE FUNCTION reactivate_user_subscription(
  p_user_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email TEXT;
BEGIN
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;

  IF v_user_email IS NULL THEN
    RETURN 'ERROR: User with ID ' || p_user_id || ' not found';
  END IF;

  -- Mark any existing subscription row as active and cancel_at_period_end = false
  UPDATE public.user_subscriptions
  SET 
    status = 'active',
    cancel_at_period_end = FALSE,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Ensure role is subscriber (and remove basic user role if present)
  DELETE FROM public.user_roles
  WHERE user_id = p_user_id AND role = 'user'::public.app_role;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'subscriber'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Reactivated subscription and ensured subscriber role for user %', v_user_email;
  RETURN 'Subscription reactivated and subscriber role ensured for user ' || v_user_email;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    RETURN 'ERROR: Failed to reactivate subscription for user ' || COALESCE(v_user_email, '<unknown>') || ' - ' || SQLERRM;
END;
$$;

GRANT EXECUTE ON FUNCTION reactivate_user_subscription(UUID) TO service_role;


