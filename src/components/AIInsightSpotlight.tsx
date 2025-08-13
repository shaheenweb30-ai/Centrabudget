import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Clock, X, Sparkles, Zap, CheckCircle, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AI_INSIGHTS = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    message: "You're trending 18% over 'Dining Out'. Set a soft cap at $220?",
    actions: [
      { label: "Set cap", variant: "default" as const },
      { label: "Snooze", variant: "outline" as const }
    ],
    color: "border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800"
  },
  {
    id: 2,
    type: 'savings',
    icon: TrendingUp,
    message: "Cancel 'Pro Suite'—unused for 45 days. Save $14.99/mo.",
    actions: [
      { label: "Review", variant: "default" as const },
      { label: "Dismiss", variant: "outline" as const }
    ],
    color: "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800"
  },
  {
    id: 3,
    type: 'suggestion',
    icon: Brain,
    message: "Move $120 from 'Leisure' to 'Groceries' to stay on budget.",
    actions: [
      { label: "Move now", variant: "default" as const },
      { label: "Later", variant: "outline" as const }
    ],
    color: "border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800"
  }
];

export function AIInsightSpotlight() {
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
    <section id="insights" className="py-24 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Insights
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            AI that keeps you
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              in control
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Not just dashboards—clear recommendations when they matter most.
          </p>
        </div>
        
        {/* Insight Card */}
        <div className="max-w-3xl mx-auto">
          <div
            className={`relative rounded-3xl border-2 p-10 shadow-2xl transition-all duration-500 transform hover:scale-105 ${currentInsight.color} dark:shadow-purple-500/10`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            {/* AI Badge */}
            <div className="absolute -top-4 left-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Insight
            </div>
            
            {/* Content */}
            <div className="flex items-start gap-6 mt-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <IconComponent className="w-8 h-8 text-purple-600" />
              </div>
              
              <div className="flex-1">
                <p className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
                  {currentInsight.message}
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  {currentInsight.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="lg"
                      className={`flex-1 rounded-full px-6 py-3 font-semibold ${
                        action.variant === 'default' 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl' 
                          : 'border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Dismiss Button */}
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Dismiss insight"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {AI_INSIGHTS.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 w-8 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to insight ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Privacy Note */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-200">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">
              You control what's analysed. Privacy by design.
            </p>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Ready to experience AI insights?</span>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
