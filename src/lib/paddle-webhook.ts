// Paddle Webhook Handler
// This should be implemented on your backend server, not in the frontend

export interface PaddleWebhookEvent {
  event_type: string;
  event_id: string;
  occurred_at: string;
  data: {
    id: string;
    status: string;
    customer_id: string;
    subscription_id?: string;
    product_id: string;
    custom_data?: {
      userId: string;
      planId: string;
      billingCycle: string;
      source: string;
    };
    [key: string]: any;
  };
}

export interface WebhookHandler {
  handleSubscriptionCreated: (event: PaddleWebhookEvent) => Promise<void>;
  handleSubscriptionUpdated: (event: PaddleWebhookEvent) => Promise<void>;
  handleSubscriptionCancelled: (event: PaddleWebhookEvent) => Promise<void>;
  handlePaymentSucceeded: (event: PaddleWebhookEvent) => Promise<void>;
  handlePaymentFailed: (event: PaddleWebhookEvent) => Promise<void>;
}

// Example webhook handler implementation
export class PaddleWebhookHandler implements WebhookHandler {
  async handleSubscriptionCreated(event: PaddleWebhookEvent): Promise<void> {
    const { data } = event;
    const { userId, planId, billingCycle } = data.custom_data || {};
    
    console.log(`Subscription created for user ${userId}, plan: ${planId}, cycle: ${billingCycle}`);
    
    // TODO: Implement your business logic here:
    // 1. Update user's subscription status in your database
    // 2. Grant access to premium features
    // 3. Send welcome email
    // 4. Update user's plan limits
  }

  async handleSubscriptionUpdated(event: PaddleWebhookEvent): Promise<void> {
    const { data } = event;
    const { userId, planId, billingCycle } = data.custom_data || {};
    
    console.log(`Subscription updated for user ${userId}, plan: ${planId}, cycle: ${billingCycle}`);
    
    // TODO: Implement your business logic here:
    // 1. Update subscription details in your database
    // 2. Handle plan changes
    // 3. Update billing information
  }

  async handleSubscriptionCancelled(event: PaddleWebhookEvent): Promise<void> {
    const { data } = event;
    const { userId, planId } = data.custom_data || {};
    
    console.log(`Subscription cancelled for user ${userId}, plan: ${planId}`);
    
    // TODO: Implement your business logic here:
    // 1. Update user's subscription status to cancelled
    // 2. Schedule access removal at end of billing period
    // 3. Send cancellation confirmation email
    // 4. Update user's plan limits back to free tier
  }

  async handlePaymentSucceeded(event: PaddleWebhookEvent): Promise<void> {
    const { data } = event;
    const { userId, planId } = data.custom_data || {};
    
    console.log(`Payment succeeded for user ${userId}, plan: ${planId}`);
    
    // TODO: Implement your business logic here:
    // 1. Update payment status in your database
    // 2. Extend subscription period
    // 3. Send payment confirmation email
  }

  async handlePaymentFailed(event: PaddleWebhookEvent): Promise<void> {
    const { data } = event;
    const { userId, planId } = data.custom_data || {};
    
    console.log(`Payment failed for user ${userId}, plan: ${planId}`);
    
    // TODO: Implement your business logic here:
    // 1. Update payment status in your database
    // 2. Send payment failure notification
    // 3. Handle retry logic
    // 4. Consider downgrading user if payment continues to fail
  }

  // Main webhook handler that routes events to appropriate handlers
  async handleWebhook(event: PaddleWebhookEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'subscription.created':
          await this.handleSubscriptionCreated(event);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;
        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(event);
          break;
        case 'transaction.completed':
          await this.handlePaymentSucceeded(event);
          break;
        case 'transaction.failed':
          await this.handlePaymentFailed(event);
          break;
        default:
          console.log(`Unhandled webhook event type: ${event.event_type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }
}

// Webhook signature verification (implement this on your backend)
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  publicKey: string
): boolean => {
  // TODO: Implement webhook signature verification
  // This is crucial for security - never trust webhooks without verification
  // Use Paddle's public key to verify the signature
  
  console.warn('Webhook signature verification not implemented - implement this for production!');
  return true; // Remove this in production
};
