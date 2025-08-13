import { Button } from "@/components/ui/button";
import { Play, Shield, Globe, BarChart3, Sparkles, Zap, TrendingUp, CheckCircle, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturesHero() {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              AI-Powered Features
            </div>
            
            {/* Main Headline */}
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-tight text-gray-900">
              All the features you need—
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                plus AI that does the heavy lifting
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Track spending, set budgets, and get real-time, actionable insights—without <span className="inline-flex items-center gap-1"><FileSpreadsheet className="w-6 h-6 text-green-600" />spreadsheets</span>.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <span className="mr-2">🚀</span>
                  Start free — no card
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Button>
              </Link>
            </div>
            
            {/* Trust Chips */}
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="font-medium">100+ currencies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium">Real-time analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-md">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Bank-level security</span>
              </div>
            </div>
          </div>
          
          {/* Right Visual - App Mockup */}
          <div className="relative group">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200/50 transform group-hover:scale-105 transition-all duration-500">
              {/* App Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">C</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">CentraBudget</span>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-2 mb-8">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                  Wallet
                </button>
                <button className="px-6 py-3 text-gray-600 hover:text-gray-900 rounded-xl text-sm font-medium transition-colors">
                  Budgets
                </button>
                <button className="px-6 py-3 text-gray-600 hover:text-gray-900 rounded-xl text-sm font-medium transition-colors">
                  Insights
                </button>
              </div>
              
              {/* Content Area */}
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <span className="text-sm text-gray-600 font-medium">Total Balance</span>
                  <span className="text-2xl font-bold text-gray-900">$2,847.32</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm">🍽️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">Dining Out</div>
                        <div className="text-xs text-gray-600">$156.80 this month</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">$156.80</div>
                      <div className="text-xs text-red-600 font-medium">18% over</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-green-600 font-bold text-sm">🛒</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">Groceries</div>
                        <div className="text-xs text-gray-600">$89.45 this month</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">$89.45</div>
                      <div className="text-xs text-green-600 font-medium">On track</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating AI Tip */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-2xl shadow-2xl max-w-xs transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold mb-2">AI Insight</div>
                  <div className="text-xs opacity-90 leading-relaxed">
                    You're 18% over dining budget. Consider setting a soft cap to stay on track!
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/2 -right-2 w-4 h-4 bg-purple-200 rounded-full opacity-80 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
