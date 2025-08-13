import { useState } from "react";
import { Link } from "react-router-dom";
import { PasswordResetRequest } from "./PasswordResetRequest";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetRequest = async (email: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Password reset email sent to:', email);
        toast({
          title: "Reset link sent!",
          description: "Check your email for the password reset link.",
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>

      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/90 backdrop-blur-sm relative z-10">
        <Link to="/" className="group">
          <div className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            CentraBudget
          </div>
        </Link>
        
        {/* Header Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5 animate-pulse"></span>
            Password Reset
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[500px]">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50">
            {/* Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium border border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                Secure Reset
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reset your password
              </h1>
              <p className="text-lg text-gray-600 max-w-sm mx-auto">
                Enter your email and we'll send a secure reset link.
              </p>
            </div>

            {/* Password Reset Form */}
            <PasswordResetRequest onSubmit={handleResetRequest} loading={loading} />

            {/* Links */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <a href="/terms" className="hover:text-gray-900 transition-colors duration-300 font-medium">
            Terms of Use
          </a>
          <span className="text-gray-400">|</span>
          <a href="/privacy" className="hover:text-gray-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};
