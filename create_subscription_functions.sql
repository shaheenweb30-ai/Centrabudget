-- Create Subscription Management Functions
-- These functions handle user subscription activation and cancellation
-- Run this in your Supabase SQL editor

-- Function to activate a user subscription (called by Paddle webhook)
CREATE OR REPLACE FUNCTION activate_user_subscription(
  p_user_id UUID,
  p_plan_id TEXT,
  p_billing_cycle TEXT,
  p_paddle_subscription_id TEXT,
  p_paddle_customer_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  current_role TEXT;
  subscription_id UUID;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found',
      'user_id', p_user_id
    );
  END IF;

  -- Get current user role
  SELECT role INTO current_role
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Log the activation attempt
  RAISE NOTICE 'Activating subscription for user %: plan=%, billing=%, current_role=%', 
    p_user_id, p_plan_id, p_billing_cycle, COALESCE(current_role, 'none');

  -- Create or update user subscription record
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    billing_cycle,
    status,
    paddle_subscription_id,
    paddle_customer_id,
    current_period_start,
    current_period_end
  ) VALUES (
    p_user_id,
    p_plan_id,
    p_billing_cycle,
    'active',
    p_paddle_subscription_id,
    p_paddle_customer_id,
    NOW(),
    CASE 
      WHEN p_billing_cycle = 'monthly' THEN NOW() + INTERVAL '1 month'
      WHEN p_billing_cycle = 'yearly' THEN NOW() + INTERVAL '1 year'
      ELSE NOW() + INTERVAL '1 month'
    END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    billing_cycle = EXCLUDED.billing_cycle,
    status = EXCLUDED.status,
    paddle_subscription_id = EXCLUDED.paddle_subscription_id,
    paddle_customer_id = EXCLUDED.paddle_customer_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW()
  RETURNING id INTO subscription_id;

  -- Update user role to subscriber (Pro plan)
  -- Remove any existing roles first
  DELETE FROM public.user_roles WHERE user_id = p_user_id;
  
  -- Add subscriber role
  INSERT INTO public.user_roles (user_id, role) 
  VALUES (p_user_id, 'subscriber'::app_role);

  -- Remove any existing trials (if they exist)
  DELETE FROM public.user_trials WHERE user_id = p_user_id;

  -- Build success response
  result := jsonb_build_object(
    'success', true,
    'subscription_id', subscription_id,
    'user_id', p_user_id,
    'plan_id', p_plan_id,
    'billing_cycle', p_billing_cycle,
    'status', 'active',
    'previous_role', current_role,
    'new_role', 'subscriber',
    'message', 'Subscription activated successfully'
  );

  RAISE NOTICE 'Subscription activated successfully: %', result;
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error activating subscription: %', SQLERRM;
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'user_id', p_user_id
    );
END;
$$;

-- Function to cancel a user subscription
CREATE OR REPLACE FUNCTION cancel_user_subscription(
  p_user_id UUID,
  p_cancel_at_period_end BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  subscription_record RECORD;
BEGIN
  -- Get current subscription
  SELECT * INTO subscription_record
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No active subscription found',
      'user_id', p_user_id
    );
  END IF;

  -- Update subscription status
  IF p_cancel_at_period_end THEN
    -- Cancel at period end
    UPDATE public.user_subscriptions
    SET 
      status = 'canceled',
      cancel_at_period_end = true,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Cancel immediately
    UPDATE public.user_subscriptions
    SET 
      status = 'canceled',
      cancel_at_period_end = false,
      updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Downgrade user to free plan immediately
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'user'::app_role);
  END IF;

  -- Build success response
  result := jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'subscription_id', subscription_record.id,
    'status', 'canceled',
    'cancel_at_period_end', p_cancel_at_period_end,
    'message', CASE 
      WHEN p_cancel_at_period_end THEN 'Subscription will be canceled at period end'
      ELSE 'Subscription canceled immediately, user downgraded to free plan'
    END
  );

  RAISE NOTICE 'Subscription canceled: %', result;
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error canceling subscription: %', SQLERRM;
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'user_id', p_user_id
    );
END;
$$;

-- Function to get user subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  subscription_record RECORD;
  role_record RECORD;
BEGIN
  -- Get subscription info
  SELECT * INTO subscription_record
  FROM public.user_subscriptions
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Get user role
  SELECT * INTO role_record
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Build response
  IF FOUND THEN
    result := jsonb_build_object(
      'user_id', p_user_id,
      'has_subscription', true,
      'subscription', jsonb_build_object(
        'id', subscription_record.id,
        'plan_id', subscription_record.plan_id,
        'billing_cycle', subscription_record.billing_cycle,
        'status', subscription_record.status,
        'paddle_subscription_id', subscription_record.paddle_subscription_id,
        'current_period_start', subscription_record.current_period_start,
        'current_period_end', subscription_record.current_period_end,
        'cancel_at_period_end', subscription_record.cancel_at_period_end
      ),
      'user_role', COALESCE(role_record.role, 'none'),
      'is_active', subscription_record.status = 'active',
      'is_canceled', subscription_record.status = 'canceled'
    );
  ELSE
    result := jsonb_build_object(
      'user_id', p_user_id,
      'has_subscription', false,
      'user_role', COALESCE(role_record.role, 'none'),
      'is_active', false,
      'is_canceled', false
    );
  END IF;

  RETURN result;
END;
$$;

-- Function to reactivate a canceled subscription
CREATE OR REPLACE FUNCTION reactivate_user_subscription(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Update subscription status back to active
  UPDATE public.user_subscriptions
  SET 
    status = 'active',
    cancel_at_period_end = false,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No subscription found for user',
      'user_id', p_user_id
    );
  END IF;

  -- Ensure user has subscriber role
  DELETE FROM public.user_roles WHERE user_id = p_user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'subscriber'::app_role);

  result := jsonb_build_object(
    'success', true,
    'user_id', p_user_id,
    'status', 'active',
    'message', 'Subscription reactivated successfully'
  );

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION activate_user_subscription(UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_user_subscription(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_subscription_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_user_subscription(UUID) TO authenticated;

-- Success message
SELECT '✅ Subscription functions created successfully' as result;
SELECT 'Functions available: activate_user_subscription, cancel_user_subscription, get_user_subscription_status, reactivate_user_subscription' as note;
