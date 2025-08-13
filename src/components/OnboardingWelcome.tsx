import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Plus, 
  BarChart3, 
  Settings, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Wallet,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  actionPath: string;
  completed: boolean;
}

export const OnboardingWelcome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to CentraBudget! 🎉',
      description: 'Let\'s get you started with managing your finances. We\'ll walk through the basics in just a few steps.',
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      action: 'Get Started',
      actionPath: '',
      completed: false
    },
    {
      id: 'categories',
      title: 'Set Up Your Budget Categories',
      description: 'Create categories for your spending (like Food, Transport, Entertainment) and set monthly budgets.',
      icon: <Target className="w-8 h-8 text-green-600" />,
      action: 'Set Up Categories',
      actionPath: '/categories-budget',
      completed: false
    },
    {
      id: 'transactions',
      title: 'Add Your First Transaction',
      description: 'Start tracking your income and expenses. Add your first transaction to see your financial data come to life.',
      icon: <Plus className="w-8 h-8 text-purple-600" />,
      action: 'Add Transaction',
      actionPath: '/transactions',
      completed: false
    },
    {
      id: 'dashboard',
      title: 'Explore Your Dashboard',
      description: 'View your financial overview, track spending patterns, and monitor your budget progress.',
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      action: 'View Dashboard',
      actionPath: '/dashboard',
      completed: false
    },
    {
      id: 'settings',
      title: 'Customize Your Experience',
      description: 'Set your preferred currency, budget periods, and notification preferences.',
      icon: <Settings className="w-8 h-8 text-orange-600" />,
      action: 'Customize Settings',
      actionPath: '/settings',
      completed: false
    }
  ]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mark welcome step as completed
    setSteps(prev => prev.map(step => 
      step.id === 'welcome' ? { ...step, completed: true } : step
    ));
  }, []);

  const handleStepComplete = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
    
    toast({
      title: "Great job! 🎯",
      description: "You're making progress on your financial journey.",
    });
  };

  const handleSkipOnboarding = () => {
    try {
      localStorage.setItem('centrabudget_welcomeShown', 'true');
      localStorage.removeItem('centrabudget_newUser');
    } catch {}
    
    toast({
      title: "Onboarding skipped",
      description: "You can always access help and tutorials from the Help section.",
    });
    
    navigate('/dashboard');
  };

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('centrabudget_welcomeShown', 'true');
      localStorage.removeItem('centrabudget_newUser');
    } catch {}
    
    toast({
      title: "Welcome to CentraBudget! 🚀",
      description: "You're all set to start managing your finances effectively.",
    });
    
    navigate('/dashboard');
  };

  const goToStep = (stepId: string) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </CardTitle>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentStepData.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Step Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                    index === currentStep
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : step.completed
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    )}
                  </div>
                  <div className="text-xs font-medium">{step.title.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {currentStepData.actionPath && (
                <Button
                  onClick={() => {
                    handleStepComplete(currentStepData.id);
                    navigate(currentStepData.actionPath);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {currentStepData.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleCompleteOnboarding}
                  variant="outline"
                  className="px-8 py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Setup
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  variant="outline"
                  className="px-8 py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <Button
                    onClick={prevStep}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ← Previous
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleSkipOnboarding}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Pro Tip:</strong> Take your time with each step. Setting up your categories and budgets properly now will make tracking much easier later!
          </p>
        </div>
      </div>
    </div>
  );
};
