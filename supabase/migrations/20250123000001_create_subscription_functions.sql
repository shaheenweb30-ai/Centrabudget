-- Function to activate a user's subscription
CREATE OR REPLACE FUNCTION activate_user_subscription(
  p_user_id UUID,
  p_plan_id TEXT,
  p_billing_cycle TEXT,
  p_paddle_subscription_id TEXT,
  p_paddle_customer_id TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email TEXT;
  v_existing_subscription_id UUID;
  v_result_message TEXT;
BEGIN
  -- Get user email for logging
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;
  
  IF v_user_email IS NULL THEN
    RETURN 'ERROR: User with ID ' || p_user_id || ' not found';
  END IF;
  
  -- Check if user already has a subscription
  SELECT id INTO v_existing_subscription_id
  FROM user_subscriptions
  WHERE user_id = p_user_id;
  
  -- Calculate subscription period
  DECLARE
    v_period_start TIMESTAMP WITH TIME ZONE := NOW();
    v_period_end TIMESTAMP WITH TIME ZONE;
  BEGIN
    IF p_billing_cycle = 'monthly' THEN
      v_period_end := v_period_start + INTERVAL '1 month';
    ELSE
      v_period_end := v_period_start + INTERVAL '1 year';
    END IF;
    
    -- Insert or update subscription
    IF v_existing_subscription_id IS NOT NULL THEN
      -- Update existing subscription
      UPDATE user_subscriptions
      SET 
        plan_id = p_plan_id,
        status = 'active',
        billing_cycle = p_billing_cycle,
        paddle_subscription_id = p_paddle_subscription_id,
        paddle_customer_id = p_paddle_customer_id,
        current_period_start = v_period_start,
        current_period_end = v_period_end,
        cancel_at_period_end = FALSE,
        updated_at = NOW()
      WHERE id = v_existing_subscription_id;
      
      v_result_message := 'Updated subscription for user ' || v_user_email || ' to ' || p_plan_id || ' (' || p_billing_cycle || ')';
    ELSE
      -- Create new subscription
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        billing_cycle,
        paddle_subscription_id,
        paddle_customer_id,
        current_period_start,
        current_period_end
      ) VALUES (
        p_user_id,
        p_plan_id,
        'active',
        p_billing_cycle,
        p_paddle_subscription_id,
        p_paddle_customer_id,
        v_period_start,
        v_period_end
      );
      
      v_result_message := 'Created new subscription for user ' || v_user_email || ' to ' || p_plan_id || ' (' || p_billing_cycle || ')';
    END IF;
  END;
  
  -- Update user role to subscriber (Pro user)
  -- First remove any existing roles
  DELETE FROM user_roles
  WHERE user_id = p_user_id AND role = 'user';
  
  -- Add subscriber role if not already exists
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, 'subscriber')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Log the action
  RAISE NOTICE 'Subscription activated for user %: %', v_user_email, v_result_message;
  
  RETURN v_result_message;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback and return error
    ROLLBACK;
    RETURN 'ERROR: Failed to activate subscription for user ' || v_user_email || ' - ' || SQLERRM;
END;
$$;

-- Function to cancel a user's subscription
CREATE OR REPLACE FUNCTION cancel_user_subscription(
  p_user_id UUID,
  p_cancel_at_period_end BOOLEAN DEFAULT TRUE
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_email TEXT;
  v_result_message TEXT;
BEGIN
  -- Get user email for logging
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;
  
  IF v_user_email IS NULL THEN
    RETURN 'ERROR: User with ID ' || p_user_id || ' not found';
  END IF;
  
  -- Update subscription status
  IF p_cancel_at_period_end THEN
    UPDATE user_subscriptions
    SET 
      cancel_at_period_end = TRUE,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    v_result_message := 'Subscription cancelled at period end for user ' || v_user_email;
  ELSE
    UPDATE user_subscriptions
    SET 
      status = 'cancelled',
      cancel_at_period_end = FALSE,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Downgrade user to free plan
    DELETE FROM user_roles
    WHERE user_id = p_user_id AND role = 'subscriber';
    
    INSERT INTO user_roles (user_id, role)
    VALUES (p_user_id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    v_result_message := 'Subscription cancelled immediately for user ' || v_user_email || ' - downgraded to free plan';
  END IF;
  
  -- Log the action
  RAISE NOTICE 'Subscription cancelled for user %: %', v_user_email, v_result_message;
  
  RETURN v_result_message;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback and return error
    ROLLBACK;
    RETURN 'ERROR: Failed to cancel subscription for user ' || v_user_email || ' - ' || SQLERRM;
END;
$$;

-- Function to get user's current subscription status
CREATE OR REPLACE FUNCTION get_user_subscription_status(p_user_id UUID)
RETURNS TABLE(
  user_id UUID,
  plan_id TEXT,
  status TEXT,
  billing_cycle TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  days_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    us.plan_id,
    us.status,
    us.billing_cycle,
    us.current_period_end,
    (us.status = 'active' AND us.current_period_end > NOW()) as is_active,
    EXTRACT(DAY FROM (us.current_period_end - NOW()))::INTEGER as days_remaining
  FROM user_subscriptions us
  WHERE us.user_id = p_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION activate_user_subscription(UUID, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION cancel_user_subscription(UUID, BOOLEAN) TO service_role;
GRANT EXECUTE ON FUNCTION get_user_subscription_status(UUID) TO authenticated;
