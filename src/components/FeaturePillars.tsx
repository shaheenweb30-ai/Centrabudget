import { Clock, Target, Brain, Globe, Sparkles, Zap, TrendingUp, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FEATURE_PILLARS = [
  {
    id: 'tracking',
    title: 'Real-time Tracking',
    body: 'See where your money goes with automatic categorization and live updates.',
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'budgets',
    title: 'Smart Budgets',
    body: 'Create budgets for any category and get alerts when you\'re close to limits.',
    icon: Target,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'insights',
    title: 'AI Insights',
    body: 'Get personalized suggestions to save money and improve your spending habits.',
    icon: Brain,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'currency',
    title: 'Multi-Currency',
    body: 'Track spending in 100+ currencies with live exchange rates for travelers.',
    icon: Globe,
    color: 'text-orange-600 dark:text-orange-400'
  }
];

const AI_INSIGHTS = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    message: "You're $20 away from your dining budget. Consider setting a reminder to stay on track.",
    actions: [
      { label: "Set reminder", variant: "default" as const },
      { label: "Dismiss", variant: "outline" as const }
    ],
    color: "border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800"
  },
  {
    id: 2,
    type: 'savings',
    icon: TrendingUp,
    message: "You haven't used Netflix in 3 months. Cancel it to save $15.99/month.",
    actions: [
      { label: "Review", variant: "default" as const },
      { label: "Keep it", variant: "outline" as const }
    ],
    color: "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
  },
  {
    id: 3,
    type: 'suggestion',
    icon: Brain,
    message: "You usually spend $400 on groceries but have $500. Move $100 to savings?",
    actions: [
      { label: "Move money", variant: "default" as const },
      { label: "Later", variant: "outline" as const }
    ],
    color: "border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800"
  }
];

export function FeaturePillars() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate insights every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % AI_INSIGHTS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentInsight = AI_INSIGHTS[currentIndex];
  const IconComponent = currentInsight.icon;

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Core Features
          </div>
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}manage your money
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Powerful features that work together to give you complete control over your finances
          </p>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          {/* Left: Feature Cards */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
                <CheckCircle className="w-4 h-4" />
                What You Can Do
              </div>
              <h3 className="font-bold text-3xl text-gray-900 mb-4">
                Four powerful ways to
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}take control
                </span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURE_PILLARS.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="group bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100 hover:border-gray-200 relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <IconComponent className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-semibold text-lg text-gray-900 mb-3 relative z-10">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      {feature.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right: AI Insights */}
          <div>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
                <Brain className="w-4 h-4" />
                AI-Powered Insights
              </div>
              <h3 className="font-bold text-3xl text-gray-900 mb-4">
                Smart suggestions that
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}save you money
                </span>
              </h3>
            </div>
            
            {/* Insight Card */}
            <div
              className="relative group"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            >
              {/* Floating card with backdrop blur */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 transform group-hover:scale-105 transition-all duration-500">
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and badge */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        AI Tip
                      </div>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <p className="text-gray-800 text-lg font-medium mb-8 leading-relaxed">
                    {currentInsight.message}
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4 mb-6">
                    {currentInsight.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        size="lg"
                        className={`flex-1 rounded-2xl font-semibold transition-all duration-300 ${
                          index === 0 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' 
                            : 'bg-white/50 border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300'
                        }`}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Progress dots */}
                  <div className="flex justify-center gap-3">
                    {AI_INSIGHTS.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8 shadow-lg'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to insight ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Privacy Note */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Your data stays private & secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
