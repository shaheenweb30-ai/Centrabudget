import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import PaymentResult from '@/components/PaymentResult';
import SubscriptionManagement from '@/components/SubscriptionManagement';

const Subscription: React.FC = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const cancelled = searchParams.get('canceled') === 'true';

  // If there's a payment result, show the result component
  if (success || cancelled) {
    return <PaymentResult />;
  }

  // Otherwise, show the subscription management
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Subscription Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Manage your subscription, view billing information, and update your plan settings.
            </p>
          </div>

          {/* Subscription Management Component */}
          <SubscriptionManagement />
        </div>
      </div>
    </Layout>
  );
};

export default Subscription;
