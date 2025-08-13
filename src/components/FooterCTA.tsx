import { Button } from "@/components/ui/button";
import { Play, Shield, Globe, BarChart3, Sparkles, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function FooterCTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Gradient Card */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50/90 rounded-3xl p-8 lg:p-12 text-center shadow-2xl border border-white/20 backdrop-blur-sm">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Start Your Journey
          </div>
          
          {/* Main Content */}
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Ready to try
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CentraBudget?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start free, set up in under 2 minutes. No credit card required.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start free — no card
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 font-semibold transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center gap-3 bg-white/50 rounded-xl p-4 border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Bank-level security</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/50 rounded-xl p-4 border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">100+ currencies</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/50 rounded-xl p-4 border border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">Real-time analytics</span>
            </div>
          </div>
          
          {/* Additional Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg text-white mb-2">No Setup Fees</h4>
              <p className="text-gray-300 text-sm">Start immediately with zero upfront costs</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg text-white mb-2">AI-Powered Insights</h4>
              <p className="text-gray-300 text-sm">Smart recommendations to save money</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-lg text-white mb-2">Cancel Anytime</h4>
              <p className="text-gray-300 text-sm">No long-term contracts or commitments</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
