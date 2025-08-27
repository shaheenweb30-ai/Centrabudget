# 🚀 Payment Integration & Subscription Management Setup

## Overview
This guide will help you set up a complete payment integration system that automatically upgrades users to Pro accounts when they complete payments through Paddle.

## 🎯 What This System Does

### **User Flow**
1. **User clicks "Upgrade to Pro"** → Plan selection popup appears
2. **User selects billing cycle** (Monthly/Yearly) → Paddle checkout opens
3. **User completes payment** → Paddle sends webhook to your server
4. **Webhook processes payment** → User account upgraded to Pro in database
5. **User redirected to success page** → Confirms Pro account activation

### **Database Changes**
- **User automatically gets 'subscriber' role** (Pro user)
- **Subscription details stored** (billing cycle, Paddle IDs, status)
- **Real-time plan updates** across the application

## 📋 Prerequisites

### **Required Environment Variables**
```bash
# Paddle Configuration
VITE_PADDLE_ENV=sandbox  # or 'production'
VITE_PADDLE_CLIENT_TOKEN=your_paddle_client_token
VITE_PADDLE_API_KEY=your_paddle_api_key
VITE_PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret

# Product IDs (from Paddle Dashboard)
VITE_PADDLE_PRO_MONTHLY_ID=ppri_xxxxx
VITE_PADDLE_PRO_YEARLY_ID=ppri_xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🗄️ Database Setup

### **Step 1: Run SQL Migrations**
Execute these SQL files in your Supabase SQL Editor in order:

#### **1. Create User Subscriptions Table**
```sql
-- File: supabase/migrations/20250123000000_create_user_subscriptions.sql
-- This creates the table to track subscription status
```

#### **2. Create Subscription Functions**
```sql
-- File: supabase/migrations/20250123000001_create_subscription_functions.sql
-- This creates functions to manage subscriptions
```

### **Step 2: Verify Table Creation**
```sql
-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_subscriptions');

-- Check if functions were created
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('activate_user_subscription', 'cancel_user_subscription');
```

## 🌐 Webhook Setup

### **Step 1: Deploy Webhook Handler**
The webhook handler is located at `src/pages/api/paddle-webhook.ts`. You need to deploy this to handle Paddle webhooks.

#### **For Vercel/Next.js:**
- The file is already in the correct location
- Deploy your application

#### **For Other Platforms:**
- Create an API endpoint at `/api/paddle-webhook`
- Copy the webhook handler code
- Ensure it's accessible via HTTPS

### **Step 2: Configure Paddle Webhooks**
1. **Go to Paddle Dashboard** → Webhooks
2. **Add new webhook endpoint:**
   ```
   URL: https://yourdomain.com/api/paddle-webhook
   Events to send:
   - subscription.created
   - subscription.updated
   - subscription.cancelled
   - subscription.paused
   - subscription.resumed
   - subscription.payment_succeeded
   - subscription.payment_failed
   ```
3. **Copy the webhook secret** and add it to your environment variables

## 🔧 Frontend Integration

### **Step 1: Add Payment Success Route**
Add this route to your router configuration:

```tsx
// In your router file
import PaymentSuccess from '@/pages/PaymentSuccess';

// Add the route
{
  path: '/payment-success',
  element: <PaymentSuccess />
}
```

### **Step 2: Update Paddle Configuration**
The success URL has been updated to redirect to `/payment-success` after successful payment.

## 🧪 Testing the Integration

### **Test 1: Sandbox Environment**
1. **Set environment to 'sandbox'**
2. **Use Paddle sandbox test cards:**
   - **Success:** 4000 0000 0000 0002
   - **Decline:** 4000 0000 0000 0007
3. **Complete a test purchase**
4. **Check webhook logs** in your server console
5. **Verify database updates** in Supabase

### **Test 2: Database Verification**
```sql
-- Check user roles
SELECT 
  u.email,
  ur.role,
  us.status,
  us.plan_id,
  us.billing_cycle
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN user_subscriptions us ON u.id = us.user_id
WHERE u.email = 'test@example.com';

-- Check subscription details
SELECT * FROM user_subscriptions 
WHERE user_id = 'ACTUAL_USER_UUID_HERE';  -- Replace with actual UUID
```

### **Test 3: Frontend Verification**
1. **Complete a test purchase**
2. **Verify redirect to success page**
3. **Check that user plan shows as Pro**
4. **Verify Pro features are accessible**

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Webhook Not Receiving Events**
- **Check webhook URL** is accessible via HTTPS
- **Verify webhook secret** matches environment variable
- **Check server logs** for webhook errors
- **Ensure Paddle webhook is active** in dashboard

#### **2. User Not Upgraded to Pro**
- **Check webhook logs** for errors
- **Verify database functions** exist and are callable
- **Check user_roles table** for role updates
- **Verify custom_data** includes userId

#### **3. Success Page Not Showing**
- **Check route configuration** in router
- **Verify success URL** in Paddle config
- **Check browser console** for errors
- **Ensure PaymentSuccess component** is imported

#### **4. Database Permission Errors**
- **Verify RLS policies** are correctly set
- **Check service role key** has proper permissions
- **Ensure functions** are created with SECURITY DEFINER

### **Debug Commands**
```sql
-- Check webhook processing
SELECT * FROM user_subscriptions ORDER BY created_at DESC LIMIT 5;

-- Check user role changes
SELECT * FROM user_roles ORDER BY created_at DESC LIMIT 5;

-- Test subscription function (replace with actual UUID)
-- First get a user UUID:
-- SELECT id, email FROM auth.users LIMIT 1;

-- Then test the function:
-- SELECT activate_user_subscription(
--   'ACTUAL_USER_UUID_HERE',  -- Replace with UUID from above query
--   'pro',
--   'monthly',
--   'test-subscription-id',
--   'test-customer-id'
-- );
```

## 🔒 Security Considerations

### **Webhook Security**
- **Always verify webhook signatures** using Paddle's secret
- **Use HTTPS** for all webhook endpoints
- **Validate webhook data** before processing
- **Log all webhook events** for audit purposes

### **Database Security**
- **Use RLS policies** to restrict access
- **Service role key** should only be used server-side
- **Validate user permissions** before role changes
- **Sanitize all inputs** from webhooks

## 📊 Monitoring & Analytics

### **Key Metrics to Track**
- **Webhook success rate** (should be 100%)
- **Payment success rate** (industry standard: 95%+)
- **Subscription activation time** (should be < 1 minute)
- **Failed payment rate** (should be < 5%)

### **Logging Recommendations**
- **Log all webhook events** with timestamps
- **Track payment processing times**
- **Monitor database function execution**
- **Alert on webhook failures**

## 🎉 Success Criteria

### **System is Working When:**
✅ **User clicks upgrade** → Popup appears  
✅ **User selects plan** → Paddle checkout opens  
✅ **User completes payment** → Webhook received  
✅ **Database updated** → User role changed to 'subscriber'  
✅ **User redirected** → Success page shows Pro confirmation  
✅ **Pro features accessible** → Unlimited categories, budgets, etc.  

## 🚀 Next Steps

### **Immediate Actions**
1. **Run SQL migrations** in Supabase
2. **Deploy webhook handler** to your server
3. **Configure Paddle webhooks** in dashboard
4. **Test with sandbox environment**

### **Future Enhancements**
- **Email notifications** for successful upgrades
- **Subscription management** dashboard
- **Billing history** and invoices
- **Automatic renewal** handling
- **Downgrade flow** for cancelled subscriptions

---

## 📞 Support

If you encounter issues:
1. **Check the troubleshooting section** above
2. **Review webhook logs** in your server console
3. **Verify database state** using the SQL queries provided
4. **Test with sandbox environment** first

The system is designed to be robust and handle edge cases gracefully. Most issues can be resolved by checking the logs and verifying the configuration.
