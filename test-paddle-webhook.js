#!/usr/bin/env node

/**
 * Test script for Paddle webhook data
 * This script simulates the webhook data structure that Paddle sends
 * Run with: node test-paddle-webhook.js
 */

// Simulate Paddle webhook data
const simulateWebhookData = (userId, planId = 'pro', billingCycle = 'monthly') => {
  return {
    event_type: 'subscription.created',
    data: {
      subscription_id: `sub_${Date.now()}`,
      customer_id: `cust_${Date.now()}`,
      items: [
        {
          price_id: billingCycle === 'monthly' ? 'ppri_monthly_123' : 'ppri_yearly_456',
          quantity: 1
        }
      ],
      status: 'active',
      next_billed_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      custom_data: {
        userId: userId,
        planId: planId,
        billingCycle: billingCycle,
        source: 'centrabudget-web'
      }
    }
  };
};

// Test different scenarios
const testScenarios = [
  {
    name: 'Valid Pro Monthly Subscription',
    data: simulateWebhookData('user-123', 'pro', 'monthly'),
    expected: {
      hasUserId: true,
      hasPlanId: true,
      hasBillingCycle: true
    }
  },
  {
    name: 'Valid Pro Yearly Subscription',
    data: simulateWebhookData('user-456', 'pro', 'yearly'),
    expected: {
      hasUserId: true,
      hasPlanId: true,
      hasBillingCycle: true
    }
  },
  {
    name: 'Missing User ID',
    data: {
      event_type: 'subscription.created',
      data: {
        subscription_id: 'sub_missing_user',
        customer_id: 'cust_missing_user',
        items: [{ price_id: 'ppri_monthly_123', quantity: 1 }],
        status: 'active',
        custom_data: {
          // userId is missing
          planId: 'pro',
          billingCycle: 'monthly',
          source: 'centrabudget-web'
        }
      }
    },
    expected: {
      hasUserId: false,
      hasPlanId: true,
      hasBillingCycle: true
    }
  },
  {
    name: 'Missing Custom Data',
    data: {
      event_type: 'subscription.created',
      data: {
        subscription_id: 'sub_no_custom',
        customer_id: 'cust_no_custom',
        items: [{ price_id: 'ppri_monthly_123', quantity: 1 }],
        status: 'active'
        // custom_data is completely missing
      }
    },
    expected: {
      hasUserId: false,
      hasPlanId: false,
      hasBillingCycle: false
    }
  }
];

// Test function
const testWebhookData = (scenario) => {
  console.log(`\n🧪 Testing: ${scenario.name}`);
  console.log('📋 Webhook Data:', JSON.stringify(scenario.data, null, 2));
  
  // Extract data like the webhook handler would
  const customData = scenario.data.custom_data || {};
  const userId = customData.userId;
  const planId = customData.planId;
  const billingCycle = customData.billingCycle;
  
  // Check results
  const results = {
    hasUserId: !!userId,
    hasPlanId: !!planId,
    hasBillingCycle: !!billingCycle
  };
  
  console.log('🔍 Extracted Data:', {
    userId: userId || 'MISSING',
    planId: planId || 'MISSING',
    billingCycle: billingCycle || 'MISSING'
  });
  
  // Validate against expected results
  const passed = Object.keys(scenario.expected).every(key => 
    results[key] === scenario.expected[key]
  );
  
  console.log(`✅ Test ${passed ? 'PASSED' : 'FAILED'}`);
  
  if (!passed) {
    console.log('❌ Expected:', scenario.expected);
    console.log('❌ Actual:', results);
  }
  
  return passed;
};

// Run all tests
console.log('🚀 Paddle Webhook Test Suite');
console.log('=============================');

let passedTests = 0;
let totalTests = testScenarios.length;

testScenarios.forEach((scenario, index) => {
  if (testWebhookData(scenario)) {
    passedTests++;
  }
});

// Summary
console.log('\n📊 Test Results');
console.log('================');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! Your webhook data structure is correct.');
} else {
  console.log('\n⚠️ Some tests failed. Check the webhook data structure.');
}

// Show example of correct webhook data
console.log('\n📝 Example of Correct Webhook Data:');
console.log('====================================');
const correctExample = simulateWebhookData('user-123', 'pro', 'monthly');
console.log(JSON.stringify(correctExample, null, 2));

console.log('\n🔑 Key Points:');
console.log('- userId must be in custom_data');
console.log('- planId should be included for reference');
console.log('- billingCycle should be included for reference');
console.log('- source helps identify the origin');
console.log('- All custom_data fields are optional but recommended');
