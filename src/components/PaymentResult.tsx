import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Home, 
  Settings,
  RefreshCw
} from 'lucide-react';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const success = searchParams.get('success') === 'true';
  const cancelled = searchParams.get('canceled') === 'true';
  const subscriptionId = searchParams.get('subscription_id');
  const customerId = searchParams.get('customer_id');

  useEffect(() => {
    // Handle successful payment
    if (success && subscriptionId) {
      toast({
        title: "Payment Successful!",
        description: "Welcome to Pro! Your subscription is now active.",
        variant: "default"
      });

      // You could also update the user's plan status here
      // or redirect them to a welcome page
    }

    // Handle cancelled payment
    if (cancelled) {
      toast({
        title: "Payment Cancelled",
        description: "No worries! You can try again anytime.",
        variant: "default"
      });
    }
  }, [success, cancelled, subscriptionId, toast]);

  const handleContinue = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-green-700">
              <p className="mb-2">
                Welcome to Pro! Your subscription is now active and you have access to all premium features.
              </p>
              {subscriptionId && (
                <p className="text-sm text-green-600">
                  Subscription ID: {subscriptionId.slice(-8)}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleContinue}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleSettings}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            </div>

            <div className="text-xs text-green-600">
              You'll receive a confirmation email shortly with your receipt.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-800">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-yellow-700">
              <p>
                No worries! You can try upgrading to Pro again anytime. 
                Your free plan remains active with all its features.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleContinue}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            <div className="text-xs text-yellow-600">
              Questions? Contact our support team for assistance.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state while processing
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            Processing Payment...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">
            Please wait while we process your payment result.
          </p>
          <Button 
            onClick={handleContinue}
            variant="outline"
            className="w-full"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentResult;
