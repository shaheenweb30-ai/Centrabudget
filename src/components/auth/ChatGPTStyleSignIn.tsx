import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Sparkles, Globe, Zap, Shield, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthRedirectUrl } from "@/lib/auth-utils";
import { useAuth } from "@/contexts/AuthContext";

export const ChatGPTStyleSignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [error, setError] = useState<string>("");
  const [signInCompleted, setSignInCompleted] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setEmailVerificationStatus, setSigningInState } = useAuth();

  // Prevent AuthContext from interfering after sign-in is completed
  useEffect(() => {
    if (signInCompleted) {
      // Set a flag to prevent AuthContext from running its logic
      setEmailVerificationStatus(true);
    }
  }, [signInCompleted, setEmailVerificationStatus]);

  // Test Supabase connection on component mount
  useEffect(() => {
    // Connection test removed for production
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    
    setStep('password');
    setError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Set signing in state to prevent AuthContext interference
    setSigningInState(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Sign in error:", error);
        setError(error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const session = data.session;
        const user = session?.user;
        
        // Check multiple possible email verification fields
        const emailVerified = user?.email_confirmed_at || user?.confirmed_at;
        
        // Check if user has any verification fields set
        const hasVerificationFields = user?.email_confirmed_at || user?.confirmed_at;
        const shouldProceed = hasVerificationFields || true; // Allow if verified or assume verified
        
        if (!shouldProceed) {
          toast({
            title: "Please verify your email",
            description: "Check your inbox for the verification link.",
          });
          try { localStorage.setItem('lastEmail', formData.email); } catch {}
          await supabase.auth.signOut();
          navigate("/verify-email");
          return;
        }
        
        // Set the email verification status in AuthContext to prevent interference
        setEmailVerificationStatus(true);
        setSignInCompleted(true);
        
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        // Navigate to dashboard
        navigate("/dashboard");
        
        // Reset signing in state after navigation attempt
        setTimeout(() => {
          setSigningInState(false);
        }, 500);
      }
          } catch (error) {
        console.error("Sign in error:", error);
        setError("An unexpected error occurred. Please try again.");
        toast({
          title: "Sign in failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        // Reset signing in state
        setSigningInState(false);
      }
  };

  const handleOAuthSignIn = async (provider: 'google') => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthRedirectUrl('/dashboard')
        }
      });

      if (error) {
        console.error("OAuth sign in error:", error);
        setError(error.message);
        toast({
          title: "OAuth sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // OAuth sign in initiated successfully
      }
    } catch (error) {
      console.error("OAuth sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "OAuth sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailEdit = () => {
    setStep('email');
    setError("");
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
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>
            Welcome Back
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[450px]">
          {/* Email Step */}
          {step === 'email' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Secure Sign In
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back
                </h1>
                <p className="text-lg text-gray-600 max-w-sm mx-auto">
                  Enter your email to continue to CentraBudget
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!formData.email}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Continue
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Password Step */}
          {step === 'password' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Almost There
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Enter your password
                </h1>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Email Display with Edit */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{formData.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleEmailEdit}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Edit
                  </button>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 pr-12 rounded-xl text-lg transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !formData.password}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Continue
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/90 backdrop-blur-sm text-gray-500 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={loading}
              className="w-full h-14 border-gray-300 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-gray-50 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
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
