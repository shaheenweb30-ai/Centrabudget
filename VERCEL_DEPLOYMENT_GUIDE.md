# 🚀 Vercel Deployment Guide for Paddle Webhook

## 📋 **Prerequisites**

Before starting, make sure you have:
- ✅ **GitHub account** with your project repository
- ✅ **Vercel account** (free at [vercel.com](https://vercel.com))
- ✅ **Supabase project** with service role key
- ✅ **Paddle account** with webhook secret

## 🎯 **Step 1: Prepare Your Project**

### **1.1 File Structure**
Ensure your project has this structure:
```
your-project/
├── api/
│   └── paddle-webhook.ts    ← Webhook handler
├── src/                     ← Your React app
├── vercel.json             ← Vercel config
├── package.json
└── .env.local              ← Environment variables
```

### **1.2 Environment Variables**
Create `.env.local` in your project root:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rjjflvdxomgyxqgdsewk.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Paddle
PADDLE_WEBHOOK_SECRET=your_webhook_secret_here
```

### **1.3 Get Supabase Service Role Key**
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy **service_role** key (not anon key!)
3. This key has admin permissions to update user roles

### **1.4 Get Paddle Webhook Secret**
1. Go to **Paddle Dashboard** → **Developer Tools** → **Webhooks**
2. Create a new webhook endpoint
3. Copy the **Endpoint Secret Key**

## 🚀 **Step 2: Deploy to Vercel**

### **2.1 Sign Up for Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your repositories

### **2.2 Import Your Project**
1. Click **"New Project"**
2. Find your GitHub repository and click **"Import"**
3. Keep default settings and click **"Deploy"**

### **2.3 Set Environment Variables**
1. Go to your project dashboard in Vercel
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add these variables:

| **Name** | **Value** | **Environment** |
|----------|-----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rjjflvdxomgyxqgdsewk.supabase.co` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key` | Production, Preview, Development |
| `PADDLE_WEBHOOK_SECRET` | `your_webhook_secret` | Production, Preview, Development |

5. Click **"Save"** for each variable

### **2.4 Redeploy**
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on your latest deployment
3. Wait for deployment to complete

## 🌐 **Step 3: Get Your Webhook URL**

After deployment, your webhook URL will be:
```
https://your-project-name.vercel.app/api/paddle-webhook
```

**Save this URL** - you'll need it for the next step!

## 📱 **Step 4: Configure Paddle Dashboard**

### **4.1 Add Webhook URL**
1. Go to **Paddle Dashboard** → **Developer Tools** → **Webhooks**
2. Click **"Add webhook endpoint"**
3. Enter your webhook URL: `https://your-project-name.vercel.app/api/paddle-webhook`
4. Click **"Create endpoint"**

### **4.2 Select Events**
Choose these events to listen for:
- ✅ `subscription.created`
- ✅ `subscription.updated`
- ✅ `subscription.cancelled`
- ✅ `subscription.paused`
- ✅ `subscription.resumed`
- ✅ `subscription.payment_succeeded`
- ✅ `subscription.payment_failed`

### **4.3 Copy Webhook Secret**
1. Click on your webhook endpoint
2. Copy the **Endpoint Secret Key**
3. Update this in your Vercel environment variables if needed

## 🧪 **Step 5: Test the Webhook**

### **5.1 Test with Paddle Sandbox**
1. **Use Paddle sandbox environment** (not production)
2. **Make a test purchase** with sandbox card:
   - Card: `4000 0000 0000 0002`
   - Expiry: Any future date
   - CVC: Any 3 digits
3. **Complete the purchase**

### **5.2 Check Webhook Logs**
1. Go to **Vercel Dashboard** → **Functions**
2. Click on **`paddle-webhook`**
3. Check **"Logs"** tab for webhook activity
4. Look for these success messages:
   ```
   ✅ Webhook signature verified successfully
   ✅ Webhook processed successfully
   ✅ Subscription activated successfully
   ```

### **5.3 Check Database Updates**
1. Go to **Supabase Dashboard** → **Table Editor**
2. Check **`user_roles`** table for new `subscriber` role
3. Check **`user_subscriptions`** table for new subscription

## 🔍 **Step 6: Verify Real-Time Updates**

### **6.1 Test Frontend**
1. **Go to your app** → **Settings** → **Paddle Test Tab**
2. **Look at PaddleDiagnostic component**
3. **Check if real-time status updates** when subscription becomes active

### **6.2 Expected Behavior**
- ✅ **User pays** → Paddle checkout completes
- ✅ **Webhook received** → Database updated
- ✅ **Real-time detection** → Frontend shows Pro status
- ✅ **No manual refresh needed**

## 🚨 **Troubleshooting Common Issues**

### **Issue: Webhook Returns 500 Error**
**Check Vercel logs:**
1. Go to **Functions** → **`paddle-webhook`** → **Logs**
2. Look for error messages
3. **Common causes:**
   - Missing environment variables
   - Invalid Supabase service role key
   - Database function doesn't exist

**Solution:**
```bash
# Check environment variables in Vercel
# Verify SUPABASE_SERVICE_ROLE_KEY is correct
# Run SQL migrations in Supabase
```

### **Issue: Webhook Not Receiving Data**
**Check Paddle dashboard:**
1. Verify webhook URL is correct
2. Ensure webhook is **active** (not paused)
3. Check webhook logs in Paddle

**Solution:**
```
# Update webhook URL in Paddle dashboard
# Test with sandbox environment
# Check webhook endpoint status
```

### **Issue: User ID Not Found**
**Check webhook logs:**
1. Look for "No userId in custom_data" error
2. Verify checkout data includes custom_data

**Solution:**
```
# Check Paddle checkout configuration
# Ensure user is authenticated before checkout
# Verify custom_data structure
```

### **Issue: Database Update Fails**
**Check Supabase:**
1. Verify `activate_user_subscription` function exists
2. Check service role key permissions
3. Verify RLS policies

**Solution:**
```sql
-- Run this in Supabase SQL editor
SELECT * FROM information_schema.routines 
WHERE routine_name = 'activate_user_subscription';
```

## 📊 **Monitoring & Maintenance**

### **6.1 Check Webhook Health**
- **Vercel Dashboard** → **Functions** → **Logs**
- **Paddle Dashboard** → **Webhooks** → **Endpoint Status**
- **Supabase Dashboard** → **Logs** → **API Requests**

### **6.2 Key Metrics**
- **Webhook success rate**: Should be 100%
- **Response time**: Should be < 30 seconds
- **Error rate**: Should be 0%

### **6.3 Regular Checks**
- **Weekly**: Review webhook logs for errors
- **Monthly**: Test webhook with sandbox purchase
- **Before production**: Verify all environment variables

## 🎉 **Success Indicators**

Your webhook is working correctly when you see:

1. **Vercel logs show:**
   ```
   ✅ Webhook signature verified successfully
   ✅ Webhook processed successfully
   ✅ Subscription activated successfully
   ```

2. **Database shows:**
   - New `subscriber` role in `user_roles` table
   - New subscription in `user_subscriptions` table

3. **Frontend shows:**
   - Real-time subscription status updates
   - User automatically gets Pro access
   - No manual refresh needed

## 🚀 **Next Steps After Deployment**

1. **Test end-to-end flow** with sandbox purchase
2. **Verify real-time updates** work correctly
3. **Monitor webhook logs** for any issues
4. **Switch to production** when ready
5. **Update Paddle environment** to production

## 📞 **Need Help?**

If you encounter issues:
1. **Check Vercel logs** first
2. **Verify environment variables**
3. **Test with Paddle sandbox**
4. **Check Supabase dashboard**
5. **Review this guide**

---

## 🎯 **Summary**

By following this guide, you'll have:
- ✅ **Webhook deployed** on Vercel
- ✅ **Environment variables** configured
- ✅ **Paddle dashboard** updated
- ✅ **Real-time subscription detection** working
- ✅ **Automatic Pro account activation**

Your payment system will be fully functional! 🚀
