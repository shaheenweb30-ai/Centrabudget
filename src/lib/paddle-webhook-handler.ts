// Paddle Webhook Handler for CentraBudget
// This file contains the logic for handling Paddle webhook events

export interface PaddleWebhookEvent {
  event_type: string;
  data: {
    id: string;
    status: string;
    customer_id?: string;
    subscription_id?: string;
    product_id?: string;
    custom_data?: {
      userId?: string;
      planId?: string;
      billingCycle?: string;
      source?: string;
    };
    [key: string]: any;
  };
  occurred_at: string;
}

export interface WebhookHandlerResult {
  success: boolean;
  message: string;
  action?: string;
}

// Handle different webhook event types
export const handlePaddleWebhook = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    console.log('🔄 Processing Paddle webhook:', event.event_type);

    switch (event.event_type) {
      case 'subscription.created':
        return await handleSubscriptionCreated(event, supabaseClient);
      
      case 'subscription.updated':
        return await handleSubscriptionUpdated(event, supabaseClient);
      
      case 'subscription.cancelled':
        return await handleSubscriptionCancelled(event, supabaseClient);
      
      case 'subscription.paused':
        return await handleSubscriptionPaused(event, supabaseClient);
      
      case 'subscription.resumed':
        return await handleSubscriptionResumed(event, supabaseClient);
      
      case 'transaction.completed':
        return await handleTransactionCompleted(event, supabaseClient);
      
      case 'transaction.refunded':
        return await handleTransactionRefunded(event, supabaseClient);
      
      default:
        console.log('⚠️ Unhandled webhook event type:', event.event_type);
        return {
          success: true,
          message: `Unhandled event type: ${event.event_type}`,
          action: 'none'
        };
    }
  } catch (error) {
    console.error('💥 Webhook handling error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      action: 'error'
    };
  }
};

// Handle subscription creation
const handleSubscriptionCreated = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update user's subscription status in database
    const { error } = await supabaseClient
      .from('user_plans')
      .upsert({
        user_id: userId,
        plan_id: data.custom_data?.planId || 'pro',
        status: 'active',
        subscription_id: data.subscription_id,
        paddle_customer_id: data.customer_id,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    console.log('✅ Subscription created for user:', userId);
    return {
      success: true,
      message: 'Subscription created successfully',
      action: 'subscription_created'
    };
  } catch (error) {
    throw error;
  }
};

// Handle subscription updates
const handleSubscriptionUpdated = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update subscription in database
    const { error } = await supabaseClient
      .from('user_plans')
      .update({
        status: data.status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    console.log('✅ Subscription updated for user:', userId);
    return {
      success: true,
      message: 'Subscription updated successfully',
      action: 'subscription_updated'
    };
  } catch (error) {
    throw error;
  }
};

// Handle subscription cancellation
const handleSubscriptionCancelled = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update subscription status to cancelled
    const { error } = await supabaseClient
      .from('user_plans')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    console.log('✅ Subscription cancelled for user:', userId);
    return {
      success: true,
      message: 'Subscription cancelled successfully',
      action: 'subscription_cancelled'
    };
  } catch (error) {
    throw error;
  }
};

// Handle subscription pause
const handleSubscriptionPaused = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update subscription status to paused
    const { error } = await supabaseClient
      .from('user_plans')
      .update({
        status: 'paused',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    console.log('✅ Subscription paused for user:', userId);
    return {
      success: true,
      message: 'Subscription paused successfully',
      action: 'subscription_paused'
    };
  } catch (error) {
    throw error;
  }
};

// Handle subscription resume
const handleSubscriptionResumed = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update subscription status to active
    const { error } = await supabaseClient
      .from('user_plans')
      .update({
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    console.log('✅ Subscription resumed for user:', userId);
    return {
      success: true,
      message: 'Subscription resumed successfully',
      action: 'subscription_resumed'
    };
  } catch (error) {
    throw error;
  }
};

// Handle transaction completion
const handleTransactionCompleted = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Log transaction in database
    const { error } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        paddle_transaction_id: data.id,
        amount: data.total,
        currency: data.currency,
        status: 'completed',
        created_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    console.log('✅ Transaction completed for user:', userId);
    return {
      success: true,
      message: 'Transaction completed successfully',
      action: 'transaction_completed'
    };
  } catch (error) {
    throw error;
  }
};

// Handle transaction refund
const handleTransactionRefunded = async (
  event: PaddleWebhookEvent,
  supabaseClient: any
): Promise<WebhookHandlerResult> => {
  try {
    const { data } = event;
    const userId = data.custom_data?.userId;
    
    if (!userId) {
      throw new Error('User ID not found in webhook data');
    }

    // Update transaction status to refunded
    const { error } = await supabaseClient
      .from('transactions')
      .update({
        status: 'refunded',
        updated_at: new Date().toISOString()
      })
      .eq('paddle_transaction_id', data.id);

    if (error) {
      throw error;
    }

    console.log('✅ Transaction refunded for user:', userId);
    return {
      success: true,
      message: 'Transaction refunded successfully',
      action: 'transaction_refunded'
    };
  } catch (error) {
    throw error;
  }
};

// Verify webhook signature (important for security)
export const verifyWebhookSignature = (
  body: string,
  signature: string,
  webhookSecret: string
): boolean => {
  // This is a placeholder - implement proper signature verification
  // using crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
  console.log('⚠️ Webhook signature verification not implemented');
  return true; // For development - implement proper verification in production
};
