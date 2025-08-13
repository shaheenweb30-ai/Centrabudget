import { Button } from "@/components/ui/button";
import { Play, Shield, Globe, BarChart3, Sparkles, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
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
          
          {/* CTA Button */}
          <div className="flex justify-center mb-12">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start free — no card
              </Button>
            </Link>
          </div>
          

        </div>
      </div>
    </section>
  );
}
    