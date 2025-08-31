// Supabase Edge Function: Paddle Webhook Handler
// This function handles Paddle webhook events and updates user subscriptions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, paddle-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get environment variables (support fallbacks for hosted secrets)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('PROJECT_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SERVICE_ROLE_KEY') || ''
    const paddleWebhookSecret = Deno.env.get('PADDLE_WEBHOOK_SECRET') || ''

    if (!supabaseUrl || !supabaseServiceKey || !paddleWebhookSecret) {
      console.error('❌ Missing required environment variables', {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceRoleKey: !!supabaseServiceKey,
        hasWebhookSecret: !!paddleWebhookSecret
      })
      return new Response(
        JSON.stringify({ error: 'Server misconfigured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Enhanced logging for debugging
    console.log('🔍 Paddle webhook received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    })

    // Read raw request body for signature verification, then parse JSON
    const payload = await req.text()
    let body: any
    try {
      body = JSON.parse(payload)
    } catch (_e) {
      console.error('❌ Invalid JSON payload')
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    console.log('📡 Webhook body:', JSON.stringify(body, null, 2))

    // Verify webhook signature
    const signatureHeader = req.headers.get('paddle-signature') || req.headers.get('Paddle-Signature') || ''
    if (!signatureHeader || !paddleWebhookSecret) {
      console.error('❌ Missing webhook signature or secret')
      console.error('Signature:', signatureHeader ? 'Present' : 'Missing')
      console.error('Secret:', paddleWebhookSecret ? 'Set' : 'Missing')
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse Paddle v2 signature header: "ts=...;h1=..." and verify HMAC over `${ts}:${payload}`
    const signatureParts = Object.fromEntries(signatureHeader.split(';').map((kv) => {
      const [k, v] = kv.trim().split('=')
      return [k, v]
    })) as Record<string, string>

    const ts = signatureParts['ts']
    const receivedH1 = signatureParts['h1']

    if (!ts || !receivedH1) {
      console.error('❌ Invalid signature header format:', signatureHeader)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Optional: reject old signatures (5 minutes skew)
    const nowSec = Math.floor(Date.now() / 1000)
    const tsNum = Number(ts)
    if (!Number.isFinite(tsNum) || Math.abs(nowSec - tsNum) > 5 * 60) {
      console.warn('⚠️ Signature timestamp outside allowed window', { ts, nowSec })
      // continue for now, or return 401 to enforce strictness
    }

    const signedData = `${ts}:${payload}`

    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(paddleWebhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedData)))
    .then(signature => Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    )

    if (receivedH1 !== expectedSignature) {
      console.error('❌ Invalid webhook signature')
      console.error('Expected:', expectedSignature)
      console.error('Received:', receivedH1)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Webhook signature verified successfully')

    const event = body
    console.log('📡 Processing webhook event:', {
      event_type: event.event_type,
      subscription_id: event.data?.subscription_id,
      customer_id: event.data?.customer_id,
      custom_data: event.data?.custom_data
    })

    // Handle different webhook events
    switch (event.event_type) {
      case 'subscription.created':
        await handleSubscriptionCreated(supabase, event.data)
        break
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(supabase, event.data)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(supabase, event.data)
        break
      
      case 'subscription.paused':
        await handleSubscriptionPaused(supabase, event.data)
        break
      
      case 'subscription.resumed':
        await handleSubscriptionResumed(supabase, event.data)
        break
      
      case 'subscription.payment_succeeded':
        await handlePaymentSucceeded(supabase, event.data)
        break
      
      case 'subscription.payment_failed':
        await handlePaymentFailed(supabase, event.data)
        break

      case 'subscription.payment_refunded':
        await handlePaymentRefunded(supabase, event.data)
        break

      case 'subscription.activated':
        await handleSubscriptionActivated(supabase, event.data)
        break

      case 'subscription.trialing':
        await handleSubscriptionTrialing(supabase, event.data)
        break
      
      case 'transaction.completed':
        await handleTransactionCompleted(supabase, event.data)
        break
      
      default:
        console.log('⚠️ Unhandled webhook event:', event.event_type)
    }

    console.log('✅ Webhook processed successfully')
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Webhook handler error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleSubscriptionCreated(supabase: any, data: any) {
  try {
    const { subscription_id, customer_id, items, status, next_billed_at } = data
    
    console.log('🔍 Processing subscription.created webhook:', {
      subscription_id,
      customer_id,
      status,
      custom_data: data.custom_data,
      custom_data_keys: data.custom_data ? Object.keys(data.custom_data) : [],
      items: items?.length || 0
    })
    
    // Extract user ID from custom data
    const customData = data.custom_data || {}
    const userId = customData.userId
    
    console.log('🔍 Extracted custom data:', {
      customData,
      userId,
      planId: customData.planId,
      billingCycle: customData.billingCycle
    })
    
    if (!userId) {
      console.error('❌ No userId in custom data for subscription:', subscription_id)
      console.error('❌ Full custom_data:', customData)
      console.error('❌ Custom data keys:', Object.keys(customData))
      return
    }

    // Determine plan and billing cycle primarily from custom_data with safe fallbacks
    const planId = customData.planId || 'pro'
    const billingCycle = customData.billingCycle === 'yearly' ? 'yearly' : 'monthly'

    console.log('🔍 Activating subscription:', {
      userId,
      planId,
      billingCycle,
      subscription_id,
      customer_id
    })

    // Activate user subscription using the database function
    const { data: result, error } = await supabase.rpc('activate_user_subscription', {
      p_user_id: userId,
      p_plan_id: planId,
      p_billing_cycle: billingCycle,
      p_paddle_subscription_id: subscription_id,
      p_paddle_customer_id: customer_id
    })

    if (error) {
      console.error('❌ Failed to activate subscription:', error)
      throw error
    } else {
      console.log('✅ Subscription activated successfully:', result)
    }
  } catch (error) {
    console.error('❌ Error handling subscription created:', error)
    throw error
  }
}

async function handleSubscriptionActivated(supabase: any, data: any) {
  try {
    const { subscription_id, customer_id, items } = data
    
    console.log('📡 Processing subscription.activated:', {
      subscription_id,
      customer_id
    })
    
    // Find subscription and ensure it's active
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('paddle_subscription_id', subscription_id)
      .single()

    if (error || !subscription) {
      console.error('❌ Subscription not found for activation:', subscription_id)
      return
    }

    // Update subscription status to active
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'active', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('❌ Failed to activate subscription:', updateError)
    } else {
      console.log('✅ Subscription activated successfully:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling subscription activated:', error)
  }
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
  try {
    const { subscription_id, status, next_billed_at, items } = data
    
    console.log('📡 Processing subscription.updated:', {
      subscription_id,
      status,
      next_billed_at
    })
    
    // Update subscription status if needed
    if (status === 'active') {
      // Subscription was reactivated
      console.log('✅ Subscription reactivated:', subscription_id)
      
      // Ensure user has subscriber role
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('user_id')
        .eq('paddle_subscription_id', subscription_id)
        .single()

      if (!error && subscription) {
        // Update user role to subscriber
        await supabase.rpc('reactivate_user_subscription', {
          p_user_id: subscription.user_id
        })
      }
    }
  } catch (error) {
    console.error('❌ Error handling subscription updated:', error)
  }
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
  try {
    const { subscription_id, scheduled_change } = data
    
    console.log('📡 Processing subscription.cancelled:', {
      subscription_id,
      scheduled_change
    })
    
    // Find user by subscription ID
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('paddle_subscription_id', subscription_id)
      .single()

    if (error || !subscription) {
      console.error('❌ Subscription not found:', subscription_id)
      return
    }

    // Cancel subscription
    const { data: result, error: cancelError } = await supabase.rpc('cancel_user_subscription', {
      p_user_id: subscription.user_id,
      p_cancel_at_period_end: true
    })

    if (cancelError) {
      console.error('❌ Failed to cancel subscription:', cancelError)
    } else {
      console.log('✅ Subscription cancelled successfully:', result)
    }
  } catch (error) {
    console.error('❌ Error handling subscription cancelled:', error)
  }
}

async function handleSubscriptionPaused(supabase: any, data: any) {
  try {
    const { subscription_id } = data
    
    console.log('📡 Processing subscription.paused:', { subscription_id })
    
    // Update subscription status to paused
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'paused', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id)

    if (error) {
      console.error('❌ Failed to pause subscription:', error)
    } else {
      console.log('✅ Subscription paused successfully:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling subscription paused:', error)
  }
}

async function handleSubscriptionResumed(supabase: any, data: any) {
  try {
    const { subscription_id } = data
    
    console.log('📡 Processing subscription.resumed:', { subscription_id })
    
    // Update subscription status to active
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id)

    if (error) {
      console.error('❌ Failed to resume subscription:', error)
    } else {
      console.log('✅ Subscription resumed successfully:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling subscription resumed:', error)
  }
}

async function handleSubscriptionTrialing(supabase: any, data: any) {
  try {
    const { subscription_id, trial_ends_at } = data
    
    console.log('📡 Processing subscription.trialing:', { 
      subscription_id, 
      trial_ends_at 
    })
    
    // Update subscription status to trialing
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'trialing', 
        current_period_end: trial_ends_at,
        updated_at: new Date().toISOString() 
      })
      .eq('paddle_subscription_id', subscription_id)

    if (error) {
      console.error('❌ Failed to update subscription to trialing:', error)
    } else {
      console.log('✅ Subscription updated to trialing:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling subscription trialing:', error)
  }
}

async function handlePaymentSucceeded(supabase: any, data: any) {
  try {
    const { subscription_id, items, next_billed_at } = data
    
    console.log('📡 Processing subscription.payment_succeeded:', {
      subscription_id,
      next_billed_at
    })
    
    // Find subscription and update billing period
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('paddle_subscription_id', subscription_id)
      .single()

    if (error || !subscription) {
      console.error('❌ Subscription not found for payment:', subscription_id)
      return
    }

    // Calculate new billing period
    const currentPeriodStart = new Date()
    let currentPeriodEnd: Date
    
    if (subscription.billing_cycle === 'monthly') {
      currentPeriodEnd = new Date(currentPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000)
    } else {
      currentPeriodEnd = new Date(currentPeriodStart.getTime() + 365 * 24 * 60 * 60 * 1000)
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
      .eq('id', subscription.id)

    if (updateError) {
      console.error('❌ Failed to update subscription billing period:', updateError)
    } else {
      console.log('✅ Subscription billing period updated successfully:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(supabase: any, data: any) {
  try {
    const { subscription_id } = data
    
    console.log('📡 Processing subscription.payment_failed:', { subscription_id })
    
    // Update subscription status to past_due
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ status: 'past_due', updated_at: new Date().toISOString() })
      .eq('paddle_subscription_id', subscription_id)

    if (error) {
      console.error('❌ Failed to update subscription status to past_due:', error)
    } else {
      console.log('✅ Subscription status updated to past_due:', subscription_id)
    }
  } catch (error) {
    console.error('❌ Error handling payment failed:', error)
  }
}

async function handlePaymentRefunded(supabase: any, data: any) {
  try {
    const { subscription_id, amount, currency } = data
    
    console.log('📡 Processing subscription.payment_refunded:', { 
      subscription_id, 
      amount, 
      currency 
    })
    
    // Handle refund logic - you might want to log this or take specific actions
    // For now, we'll just log it
    console.log('💰 Payment refunded:', {
      subscription_id,
      amount,
      currency,
      timestamp: new Date().toISOString()
    })
    
    // You could also update subscription status or take other actions here
    // depending on your business logic
  } catch (error) {
    console.error('❌ Error handling payment refunded:', error)
  }
}

async function handleTransactionCompleted(supabase: any, data: any) {
  try {
    const { id: transaction_id, subscription_id, customer_id, items, custom_data } = data
    
    console.log('📡 Processing transaction.completed:', {
      transaction_id,
      subscription_id,
      customer_id,
      custom_data,
      custom_data_keys: custom_data ? Object.keys(custom_data) : []
    })
    
    // If this is a subscription transaction, we might already have handled it
    // via subscription.created, but let's log it for debugging
    if (subscription_id) {
      console.log('✅ Transaction completed for existing subscription:', subscription_id)
      return
    }
    
    // For one-time purchases, we could handle them here
    // For now, just log the transaction
    console.log('💰 One-time transaction completed:', {
      transaction_id,
      customer_id,
      amount: items?.[0]?.totals?.total,
      currency: items?.[0]?.totals?.currency_code
    })
    
  } catch (error) {
    console.error('❌ Error handling transaction completed:', error)
  }
}
