import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  CheckCircle, 
  CreditCard, 
  Lock, 
  Shield, 
  Zap,
  Sparkles,
  ArrowLeft,
  Star,
  Package,
  Calendar,
  Users,
  BarChart3,
  Download,
  HeadphonesIcon
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePricing } from "@/contexts/PricingContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  popular?: boolean;
  savings?: number;
}

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: user?.email || '',
    acceptTerms: false
  });

  // Get plan from URL params
  const planFromUrl = searchParams.get('plan');

  useEffect(() => {
    if (planFromUrl === 'pro') {
      // Plan is already selected, no need to change
    }
  }, [planFromUrl]);

  const { plans: pricingPlans } = usePricing();
  
  // Get Pro plan from pricing context
  const proPlan = pricingPlans.find(p => p.id === 'pro');
  
  const plans: Plan[] = [
    {
      id: 'pro-monthly',
      name: 'Pro Monthly',
      price: proPlan?.monthlyPrice || 12.00,
      billingCycle: 'monthly',
      features: [
        { name: 'Unlimited Transactions', description: 'Track unlimited income and expenses', icon: Zap },
        { name: 'Unlimited Categories', description: 'Create unlimited budget categories', icon: Package },
        { name: 'Advanced AI Insights', description: 'Get intelligent financial recommendations', icon: Sparkles },
        { name: 'Priority Support', description: '24/7 customer support', icon: HeadphonesIcon },
        { name: 'Export & Backup', description: 'Download your data anytime', icon: Download },
        { name: 'Advanced Analytics', description: 'Detailed reports and insights', icon: BarChart3 }
      ]
    },
    {
      id: 'pro-yearly',
      name: 'Pro Yearly',
      price: proPlan?.yearlyPrice || 120.00,
      billingCycle: 'yearly',
      features: [
        { name: 'Unlimited Transactions', description: 'Track unlimited income and expenses', icon: Zap },
        { name: 'Unlimited Categories', description: 'Create unlimited budget categories', icon: Package },
        { name: 'Advanced AI Insights', description: 'Get intelligent financial recommendations', icon: Sparkles },
        { name: 'Priority Support', description: '24/7 customer support', icon: HeadphonesIcon },
        { name: 'Export & Backup', description: 'Download your data anytime', icon: Download },
        { name: 'Advanced Analytics', description: 'Detailed reports and insights', icon: BarChart3 }
      ],
      popular: true,
      savings: Math.round(((proPlan?.monthlyPrice || 12) * 12 - (proPlan?.yearlyPrice || 120)) / ((proPlan?.monthlyPrice || 12) * 12) * 100)
    }
  ];

  const currentPlan = plans.find(p => p.billingCycle === selectedPlan);
  const yearlySavings = selectedPlan === 'yearly' ? ((proPlan?.monthlyPrice || 12) * 12 - (proPlan?.yearlyPrice || 120)) : 0;

  const handlePlanChange = (cycle: 'monthly' | 'yearly') => {
    setSelectedPlan(cycle);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: "Welcome to Pro! Your subscription is now active.",
        variant: "default"
      });
      
      // Redirect to subscription page
      navigate('/subscription');
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Upgrade to Pro
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Complete your subscription to unlock unlimited features
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Selection & Payment Form */}
            <div className="space-y-6">
              {/* Plan Selection */}
              <Card className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    Choose Your Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button
                      variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
                      onClick={() => handlePlanChange('monthly')}
                      className={`h-12 ${
                        selectedPlan === 'monthly' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
                      onClick={() => handlePlanChange('yearly')}
                      className={`h-12 relative ${
                        selectedPlan === 'yearly' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      Yearly
                      {selectedPlan === 'yearly' && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                          Save ${yearlySavings}
                        </Badge>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                      ${currentPlan?.price}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      per {selectedPlan === 'monthly' ? 'month' : 'year'}
                    </div>
                    {selectedPlan === 'yearly' && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${yearlySavings} annually
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment Information
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Your payment information is secure and encrypted
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                        className="h-12"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          maxLength={5}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          maxLength={4}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor="acceptTerms" className="text-sm text-slate-600 dark:text-slate-400">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/terms')}
                          className="text-blue-600 hover:underline"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/privacy')}
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </button>
                      </Label>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isProcessing || !formData.acceptTerms}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Subscribe for $${currentPlan?.price}/${selectedPlan === 'monthly' ? 'month' : 'year'}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary & Features */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Pro Plan ({selectedPlan})</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ${currentPlan?.price}
                      </span>
                    </div>
                    {selectedPlan === 'yearly' && (
                      <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                        <span>Annual Savings</span>
                        <span>-${yearlySavings}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-200 dark:border-slate-600 pt-3">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          ${selectedPlan === 'yearly' ? (currentPlan?.price || 0) - yearlySavings : currentPlan?.price}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedPlan === 'monthly' ? 'Billed monthly' : 'One-time annual payment'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Features */}
              <Card className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    Pro Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentPlan?.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {feature.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security & Trust */}
              <Card className="rounded-xl border-0 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Secure & Trusted
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                    <div>• 256-bit SSL encryption</div>
                    <div>• PCI DSS compliant</div>
                    <div>• 30-day money-back guarantee</div>
                    <div>• Cancel anytime, no questions asked</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
