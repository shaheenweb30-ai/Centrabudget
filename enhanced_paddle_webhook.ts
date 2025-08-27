// Enhanced Paddle Webhook Handler
// This version includes better error handling, logging, and user role management
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Paddle webhook secret for verification
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Enhanced logging for debugging
    console.log('🔍 Paddle webhook received:', {
      method: req.method,
      headers: req.headers,
      bodySize: JSON.stringify(req.body).length,
      timestamp: new Date().toISOString()
    });

    // Verify webhook signature
    const signature = req.headers['paddle-signature'] as string;
    if (!signature || !PADDLE_WEBHOOK_SECRET) {
      console.error('❌ Missing webhook signature or secret');
      console.error('Signature:', signature ? 'Present' : 'Missing');
      console.error('Secret:', PADDLE_WEBHOOK_SECRET ? 'Set' : 'Missing');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('❌ Invalid webhook signature');
      console.error('Expected:', expectedSignature);
      console.error('Received:', signature);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('✅ Webhook signature verified successfully');

    const event = req.body;
    console.log('📡 Processing webhook event:', {
      event_type: event.event_type,
      subscription_id: event.data?.subscription_id,
      customer_id: event.data?.customer_id,
      custom_data: event.data?.custom_data
    });

    // Handle different webhook events
    switch (event.event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      
      case 'subscription.paused':
        await handleSubscriptionPaused(event.data);
        break;
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(event.data);
        break;
      
      case 'subscription.payment_succeeded':
        await handlePaymentSucceeded(event.data);
        break;
      
      case 'subscription.payment_failed':
        await handlePaymentFailed(event.data);
        break;

      case 'subscription.payment_refunded':
        await handlePaymentRefunded(event.data);
        break;

      case 'subscription.activated':
        await handleSubscriptionActivated(event.data);
        break;

      case 'subscription.trialing':
        await handleSubscriptionTrialing(event.data);
        break;
      
      default:
        console.log('⚠️ Unhandled webhook event:', event.event_type);
    }

    console.log('✅ Webhook processed successfully');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('💥 Webhook handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const { subscription_id, customer_id, items, status, next_billed_at } = data;
    
    console.log('🔍 Processing subscription.created webhook:', {
      subscription_id,
      customer_id,
      status,
      custom_data: data.custom_data,
      items: items?.length || 0
    });
    
    // Extract user ID from custom data
    const customData = data.custom_data || {};
    const userId = customData.userId;
    
    if (!userId) {
      console.error('❌ No userId in custom data for subscription:', subscription_id);
      console.error('❌ Full custom_data:', customData);
      return;
    }

    // Determine plan and billing cycle from items
    const item = items[0];
    // Extract plan and billing cycle from custom_data if available, otherwise infer from price_id
    const planId = customData.planId || (item.price_id.includes('monthly') ? 'pro' : 'pro');
    const billingCycle = customData.billingCycle || (item.price_id.includes('monthly') ? 'monthly' : 'yearly');

    console.log('🔍 Activating subscription:', {
      userId,
      planId,
      billingCycle,
      subscription_id,
      customer_id
    });

    // Activate user subscription using the database function
    const { data: result, error } = await supabase.rpc('activate_user_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_billing_cycle: billingCycle,
      p_paddle_subscription_id: subscription_id,
      p_paddle_customer_id: customer_id
    });

    if (error) {
      console.error('❌ Failed to activate subscription:', error);
      throw error;
    } else {
      console.log('✅ Subscription activated successfully:', result);
    }
  } catch (error) {
    console.error('❌ Error handling subscription created:', error);
    throw error;
  }
}

async function handleSubscriptionActivated(data: any) {
  try {
    const { subscription_id, customer_id, items } = data;
    
    console.log('📡 Processing subscription.activated:', {
      subscription_id,
      customer_id
    });
    
    // Find subscription and ensure it's active
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('paddle_subscription_id', subscription_id)
      .single();

    if (error || !subscription) {
      console.error('❌ Subscription not found for activation:', subscription_id);
      return;
    }

    // Update subscription status to active
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'active', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('❌ Failed to activate subscription:', updateError);
    } else {
      console.log('✅ Subscription activated successfully:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling subscription activated:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const { subscription_id, status, next_billed_at, items } = data;
    
    console.log('📡 Processing subscription.updated:', {
      subscription_id,
      status,
      next_billed_at
    });
    
    // Update subscription status if needed
    if (status === 'active') {
      // Subscription was reactivated
      console.log('✅ Subscription reactivated:', subscription_id);
      
      // Ensure user has subscriber role
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('paddle_subscription_id', subscription_id)
        .single();

      if (!error && subscription) {
        // Update user role to subscriber
        await supabase.rpc('reactivate_user_subscription', {
          p_user_id: subscription.user_id
        });
      }
    }
  } catch (error) {
    console.error('❌ Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const { subscription_id, scheduled_change } = data;
    
    console.log('📡 Processing subscription.cancelled:', {
      subscription_id,
      scheduled_change
    });
    
    // Find user by subscription ID
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('paddle_subscription_id', subscription_id)
      .single();

    if (error || !subscription) {
      console.error('❌ Subscription not found:', subscription_id);
      return;
    }

    // Cancel subscription
    const { data: result, error: cancelError } = await supabase.rpc('cancel_user_subscription', {
      p_user_id: subscription.user_id,
      p_cancel_at_period_end: true
    });

    if (cancelError) {
      console.error('❌ Failed to cancel subscription:', cancelError);
    } else {
      console.log('✅ Subscription cancelled successfully:', result);
    }
  } catch (error) {
    console.error('❌ Error handling subscription cancelled:', error);
  }
}

async function handleSubscriptionPaused(data: any) {
  try {
    const { subscription_id } = data;
    
    console.log('📡 Processing subscription.paused:', { subscription_id });
    
    // Update subscription status to paused
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('❌ Failed to pause subscription:', error);
    } else {
      console.log('✅ Subscription paused successfully:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling subscription paused:', error);
  }
}

async function handleSubscriptionResumed(data: any) {
  try {
    const { subscription_id } = data;
    
    console.log('📡 Processing subscription.resumed:', { subscription_id });
    
    // Update subscription status to active
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('❌ Failed to resume subscription:', error);
    } else {
      console.log('✅ Subscription resumed successfully:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling subscription resumed:', error);
  }
}

async function handleSubscriptionTrialing(data: any) {
  try {
    const { subscription_id, trial_ends_at } = data;
    
    console.log('📡 Processing subscription.trialing:', { 
      subscription_id, 
      trial_ends_at 
    });
    
    // Update subscription status to trialing
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'trialing', 
        current_period_end: trial_ends_at,
        updated_at: new Date().toISOString() 
      })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('❌ Failed to update subscription to trialing:', error);
    } else {
      console.log('✅ Subscription updated to trialing:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling subscription trialing:', error);
  }
}

async function handlePaymentSucceeded(data: any) {
  try {
    const { subscription_id, items, next_billed_at } = data;
    
    console.log('📡 Processing subscription.payment_succeeded:', {
      subscription_id,
      next_billed_at
    });
    
    // Find subscription and update billing period
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('paddle_subscription_id', subscription_id)
      .single();

    if (error || !subscription) {
      console.error('❌ Subscription not found for payment:', subscription_id);
      return;
    }

    // Calculate new billing period
    const currentPeriodStart = new Date();
    let currentPeriodEnd: Date;
    
    if (subscription.billing_cycle === 'monthly') {
      currentPeriodEnd = new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else {
      currentPeriodEnd = new Date(currentPeriodStart.getTime() + 365 * 24 * 60 * 60 * 1000);
    }

    // Update subscription with new billing period
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('❌ Failed to update subscription billing period:', updateError);
    } else {
      console.log('✅ Subscription billing period updated successfully:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { subscription_id } = data;
    
    console.log('📡 Processing subscription.payment_failed:', { subscription_id });
    
    // Update subscription status to past_due
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'past_due', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('❌ Failed to update subscription status to past_due:', error);
    } else {
      console.log('✅ Subscription status updated to past_due:', subscription_id);
    }
  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handlePaymentRefunded(data: any) {
  try {
    const { subscription_id, amount, currency } = data;
    
    console.log('📡 Processing subscription.payment_refunded:', { 
      subscription_id, 
      amount, 
      currency 
    });
    
    // Handle refund logic - you might want to log this or take specific actions
    // For now, we'll just log it
    console.log('💰 Payment refunded:', {
      subscription_id,
      amount,
      currency,
      timestamp: new Date().toISOString()
    });
    
    // You could also update subscription status or take other actions here
    // depending on your business logic
  } catch (error) {
    console.error('❌ Error handling payment refunded:', error);
  }
}
