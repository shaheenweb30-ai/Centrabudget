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
    // Verify webhook signature
    const signature = req.headers['paddle-signature'] as string;
    if (!signature || !PADDLE_WEBHOOK_SECRET) {
      console.error('Missing webhook signature or secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify webhook signature
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', PADDLE_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    console.log('Received Paddle webhook:', event.event_type, event.data);

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
      
      default:
        console.log('Unhandled webhook event:', event.event_type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleSubscriptionCreated(data: any) {
  try {
    const { subscription_id, customer_id, items, status, next_billed_at } = data;
    
    // Enhanced logging for debugging
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
    
    console.log('🔍 Extracted user data:', {
      userId,
      planId: customData.planId,
      billingCycle: customData.billingCycle,
      source: customData.source
    });
    
    if (!userId) {
      console.error('❌ No userId in custom data for subscription:', subscription_id);
      console.error('❌ Full custom_data:', customData);
      console.error('❌ Full webhook data:', JSON.stringify(data, null, 2));
      return;
    }

    // Determine plan and billing cycle from items
    const item = items[0];
    const planId = item.price_id.includes('monthly') ? 'pro' : 'pro'; // Adjust based on your price IDs
    const billingCycle = item.price_id.includes('monthly') ? 'monthly' : 'yearly';

    // Activate user subscription
    const { data: result, error } = await supabase.rpc('activate_user_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_billing_cycle: billingCycle,
      p_paddle_subscription_id: subscription_id,
      p_paddle_customer_id: customer_id
    });

    if (error) {
      console.error('Failed to activate subscription:', error);
    } else {
      console.log('Subscription activated successfully:', result);
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  try {
    const { subscription_id, status, next_billed_at } = data;
    
    // Update subscription status if needed
    if (status === 'active') {
      // Subscription was reactivated
      console.log('Subscription reactivated:', subscription_id);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const { subscription_id, scheduled_change } = data;
    
    // Find user by subscription ID
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('paddle_subscription_id', subscription_id)
      .single();

    if (error || !subscription) {
      console.error('Subscription not found:', subscription_id);
      return;
    }

    // Cancel subscription
    const { data: result, error: cancelError } = await supabase.rpc('cancel_user_subscription', {
      p_user_id: subscription.user_id,
      p_cancel_at_period_end: true
    });

    if (cancelError) {
      console.error('Failed to cancel subscription:', cancelError);
    } else {
      console.log('Subscription cancelled successfully:', result);
    }
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handleSubscriptionPaused(data: any) {
  try {
    const { subscription_id } = data;
    
    // Update subscription status to paused
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('Failed to pause subscription:', error);
    } else {
      console.log('Subscription paused successfully:', subscription_id);
    }
  } catch (error) {
    console.error('Error handling subscription paused:', error);
  }
}

async function handleSubscriptionResumed(data: any) {
  try {
    const { subscription_id } = data;
    
    // Update subscription status to active
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('Failed to resume subscription:', error);
    } else {
      console.log('Subscription resumed successfully:', subscription_id);
    }
  } catch (error) {
    console.error('Error handling subscription resumed:', error);
  }
}

async function handlePaymentSucceeded(data: any) {
  try {
    const { subscription_id, items, next_billed_at } = data;
    
    // Find subscription and update billing period
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('paddle_subscription_id', subscription_id)
      .single();

    if (error || !subscription) {
      console.error('Subscription not found for payment:', subscription_id);
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
      console.error('Failed to update subscription billing period:', updateError);
    } else {
      console.log('Subscription billing period updated successfully:', subscription_id);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const { subscription_id } = data;
    
    // Update subscription status to past_due
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'past_due', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id);

    if (error) {
      console.error('Failed to update subscription status to past_due:', error);
    } else {
      console.log('Subscription status updated to past_due:', subscription_id);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}
