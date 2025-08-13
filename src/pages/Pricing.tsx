import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star, Zap, Users, Shield, CreditCard, ArrowRight, ChevronDown, ChevronUp, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPlan } from '@/hooks/useUserPlan';
import Layout from '@/components/Layout';

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isFreePlan, limits } = useUserPlan();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Update page title and meta description
    document.title = "Pricing | ClearCents — Start Free, Upgrade When You Need More";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Choose your ClearCents plan: Start free with basic features, upgrade to Pro for unlimited access, or go Enterprise for team solutions. No credit card required.');
    }
  }, []);

  const toggleFeature = (feature: string) => {
    setExpandedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const plans = [
    {
      name: 'Free',
      subtitle: 'Perfect for getting started',
      description: 'Everything you need to begin your financial journey. No credit card required.',
      price: 0,
      period: 'month',
      buttonText: user ? 'Current Plan' : 'Get Started Free',
      buttonVariant: user ? 'outline' : 'default',
      disabled: user && isFreePlan,
      popular: false,
      features: [
        { text: `${limits.categories} categories per month`, included: true },
        { text: `${limits.budgets} budgets per month`, included: true },
        { text: `${limits.transactions} transactions per month`, included: true },
        { text: `${limits.aiInsights} AI insights per month`, included: true },
        { text: 'Basic recurring detection', included: true },
        { text: 'Monthly budget periods', included: true },
        { text: 'Community support', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Basic reports', included: true },
        { text: 'Export to CSV', included: true }
      ],
      icon: <Star className="w-6 h-6" />
    },
    {
      name: 'Pro',
      subtitle: 'Best for growing users',
      description: 'Advanced features for users who need more power and flexibility.',
      price: billingCycle === 'yearly' ? 10 : 12,
      period: billingCycle === 'yearly' ? 'month, billed yearly' : 'month',
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default',
      disabled: false,
      popular: true,
      features: [
        { text: 'Unlimited categories', included: true },
        { text: 'Unlimited budgets', included: true },
        { text: 'Unlimited transactions', included: true },
        { text: '50+ AI insights per month', included: true },
        { text: 'Advanced recurring detection', included: true },
        { text: 'Custom budget periods', included: true },
        { text: 'Receipt attachments', included: true },
        { text: 'Team collaboration (up to 5 users)', included: true },
        { text: 'API access', included: true },
        { text: 'Priority support (email + chat)', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Custom categories', included: true },
        { text: 'Budget templates', included: true },
        { text: 'Financial goals tracking', included: true },
        { text: 'Investment tracking', included: true }
      ],
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Enterprise',
      subtitle: 'For teams and organizations',
      description: 'Custom solutions with dedicated support and advanced team features.',
      price: 29,
      period: 'month',
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
      disabled: false,
      popular: false,
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Unlimited team collaboration', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'White-label options', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom onboarding', included: true },
        { text: 'SLA guarantees', included: true },
        { text: 'Advanced security features', included: true },
        { text: 'Custom reporting', included: true },
        { text: 'Bulk data import/export', included: true }
      ],
      icon: <Users className="w-6 h-6" />
    }
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes! You can upgrade to Pro at any time, and you\'ll only pay for the remaining days in your billing cycle. You can also downgrade to the free plan at any time.'
    },
    {
      question: 'What happens when I reach my free plan limits?',
      answer: 'When you reach your free plan limits (like 10 categories, 10 budgets, or 10 transactions per month), you\'ll see upgrade prompts throughout the app. You can continue using your existing data, but you\'ll need to upgrade to add more. Limits reset monthly.'
    },
    {
      question: 'Is there a setup fee or hidden costs?',
      answer: 'No! There are no setup fees, hidden costs, or surprise charges. You only pay the advertised price for your chosen plan. The free plan is completely free forever.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with Pro, contact our support team within 30 days for a full refund.'
    },
    {
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your Pro subscription at any time from your account settings. You\'ll continue to have access to Pro features until the end of your current billing period.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and debit cards. We also support Apple Pay and Google Pay for mobile users.'
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Enterprise') {
      // Open contact form or redirect to sales
      window.location.href = 'mailto:sales@clearcents.com?subject=Enterprise%20Plan%20Inquiry';
    } else if (planName === 'Pro') {
      // TODO: Implement Stripe checkout
      console.log('Upgrade to Pro');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-15 animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-green-200 rounded-full opacity-10 animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full text-sm font-medium shadow-lg mb-6">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Simple & Transparent Pricing
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Choose Your
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Plan
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
              Start free, upgrade when you need more. Everyone starts with our free plan and can upgrade to Pro when they need advanced features.
            </p>
            
            {/* Enhanced Billing Toggle */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <span className={`text-base font-medium transition-colors duration-300 ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-7 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group-hover:bg-white"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                      billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <span className={`text-base font-medium transition-colors duration-300 ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-2 inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded-full border border-green-200 shadow-sm">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Save 17%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards - Compact & Appropriate */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div key={plan.name} className="group relative">
                  {/* Glow effect for popular plan */}
                  {plan.popular && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  )}
                  
                  <Card 
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden ${
                      plan.popular ? 'scale-102' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center py-2 text-sm font-semibold">
                        ⭐ Most Popular
                      </div>
                    )}
                    
                    <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-md ${
                          plan.name === 'Free' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                          plan.name === 'Pro' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' :
                          'bg-gradient-to-br from-purple-500 to-violet-600 text-white'
                        }`}>
                          {plan.icon}
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-base text-gray-600 mb-2">{plan.subtitle}</CardDescription>
                      <p className="text-sm text-gray-600 leading-relaxed">{plan.description}</p>
                      
                      <div className="mt-6">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-lg text-gray-500 ml-2">/{plan.period}</span>
                        </div>
                        {billingCycle === 'yearly' && plan.name === 'Pro' && (
                          <div className="mt-2 inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            Save $24/year
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="px-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-6 pb-6">
                      <Button
                        onClick={() => handleUpgrade(plan.name)}
                        variant={plan.buttonVariant as any}
                        size="lg"
                        className="w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                        disabled={plan.disabled}
                      >
                        {plan.buttonText}
                        {!plan.disabled && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                      
                      {plan.name === 'Free' && user && (
                        <div className="mt-3 text-center">
                          <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            ✓ Your current plan
                          </div>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-15 animate-ping"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200 mb-6">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                Plan Comparison
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                See Exactly What You
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {" "}Get
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Compare features across all plans to make the best choice for your needs
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="text-left py-8 px-8 text-xl font-semibold text-gray-900">Feature</th>
                      <th className="text-center py-8 px-8 text-xl font-semibold text-gray-900">Free</th>
                      <th className="text-center py-8 px-8 text-xl font-semibold text-blue-600">Pro</th>
                      <th className="text-center py-8 px-8 text-xl font-semibold text-purple-600">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: 'Categories', free: `${limits.categories}/month`, pro: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'Budgets', free: `${limits.budgets}/month`, pro: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'Transactions', free: `${limits.transactions}/month`, pro: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'AI Insights', free: `${limits.aiInsights}/month`, pro: '50+/month', enterprise: 'Unlimited' },
                      { feature: 'Team Members', free: '1', pro: 'Up to 5', enterprise: 'Unlimited' },
                      { feature: 'API Access', free: 'No', pro: 'Yes', enterprise: 'Custom' },
                      { feature: 'Priority Support', free: 'Community', pro: 'Email + Chat', enterprise: 'Dedicated' },
                      { feature: 'White-label', free: 'No', pro: 'Basic', enterprise: 'Full' },
                      { feature: 'Custom Integrations', free: 'No', pro: 'Limited', enterprise: 'Custom' },
                      { feature: 'SLA Guarantees', free: 'No', pro: 'No', enterprise: 'Yes' }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50/80 transition-colors duration-300 group">
                        <td className="py-6 px-8 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">{row.feature}</td>
                        <td className="py-6 px-8 text-center text-gray-600">{row.free}</td>
                        <td className="py-6 px-8 text-center text-blue-600 font-semibold">{row.pro}</td>
                        <td className="py-6 px-8 text-center text-purple-600 font-semibold">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-red-200 rounded-full opacity-25 animate-bounce"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-200 rounded-full opacity-15 animate-ping"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200 mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                Got Questions?
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Frequently Asked
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {" "}Questions
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group">
                  <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => toggleFeature(`faq-${index}`)}
                      className="w-full text-left p-8 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                          {faq.question}
                        </h3>
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {expandedFeatures.includes(`faq-${index}`) ? (
                            <ChevronUp className="w-5 h-5 text-orange-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-orange-600" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {expandedFeatures.includes(`faq-${index}`) && (
                      <div className="px-8 pb-8 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed text-lg">{faq.answer}</p>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

              {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/10 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30 mb-8">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              Ready to Transform Your Finances?
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Get Started?
            </h2>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who are already managing their finances better with ClearCents
            </p>
            
            {/* Enhanced CTA Buttons */}
            <div className="space-y-6 mb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white to-gray-100 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <Button
                    onClick={() => {
                      if (!user) {
                        window.location.href = '/signup';
                      }
                    }}
                    className="relative bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 border-0 min-w-[200px]"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span>{user ? 'Upgrade to Pro' : 'Start Free Today'}</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-5 text-xl font-semibold rounded-3xl transition-all duration-300"
                  onClick={() => window.location.href = '/contact'}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
            
            {/* Enhanced Feature Highlights */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-blue-100">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-green-400/30 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-300" />
                  </div>
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-blue-400/30 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="font-medium">Cancel anytime</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 bg-purple-400/30 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="font-medium">30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Pricing;
