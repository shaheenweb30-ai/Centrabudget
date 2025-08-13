import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthRedirectUrl, getEmailRedirectUrl } from "@/lib/auth-utils";

export const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleEmailContinue = () => {
    setError("");
    if (validateEmail()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the current origin and ensure it's properly formatted
      const currentOrigin = window.location.origin;
      const redirectUrl = `${currentOrigin}/verify-email`;
      
      // Use the correct production domain for email verification
      const productionUrl = 'https://www.centrabudget.com/verify-email';
      
      // Use production URL if we're in production, otherwise use current origin
      let finalRedirectUrl = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1') 
        ? redirectUrl 
        : productionUrl;
      
      // Additional safety check - ensure we're not using any centrabudget.com URLs
      if (finalRedirectUrl.includes('centrabudget.com')) {
        console.error('ERROR: Redirect URL contains centrabudget.com, using production URL instead');
        finalRedirectUrl = productionUrl;
      }
      
      console.log('Starting signup process for email:', email);
      console.log('Current origin:', currentOrigin);
      console.log('Redirect URL:', redirectUrl);
      console.log('Production URL:', productionUrl);
      console.log('Final redirect URL:', finalRedirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: formData.password,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
          data: {
            full_name: formData.fullName,
          }
        }
      });

      console.log('Supabase signup response:', { data, error });

      if (error) {
        console.error("Sign up error:", error);
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log("Sign up successful:", data);
        
        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
          console.log('User created but email not confirmed. Confirmation email should be sent.');
          try { localStorage.setItem('lastEmail', email); } catch {}
          
          toast({
            title: "Verify your email",
            description: "We sent you a verification link. Please verify to continue.",
          });
          navigate("/verify-email");
        } else if (data.user && data.user.email_confirmed_at) {
          console.log('User created and email already confirmed.');
          
          toast({
            title: "Account created successfully!",
            description: "Welcome to CentraBudget!",
          });
          navigate("/dashboard");
        } else {
          console.log('Unexpected response format:', data);
          setError("Unexpected response from server. Please try again.");
        }
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setError("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getAuthRedirectUrl('/dashboard'),
        },
      });
      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: 'Sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Google sign-in initiated:', data);
        toast({
          title: 'Signing in...',
          description: 'Redirecting to Google for authentication.',
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Sign-in failed',
        description: 'An unexpected error occurred during Google sign-in.',
        variant: 'destructive',
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
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            New Account
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[500px]">
          {/* Card Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                 {step === 1 ? "Join CentraBudget" : "Set your password"}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                 {step === 1 ? "Create your account" : "Set your password for CentraBudget to continue"}
              </h1>
              {step === 1 && (
                <p className="text-lg text-gray-600 max-w-sm mx-auto">
                  Start your financial journey with AI-powered insights
                </p>
              )}
            </div>

            {/* Step 1: Email Only */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                    placeholder="Enter your email"
                  />
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

                {/* Continue Button */}
                <Button
                  onClick={handleEmailContinue}
                  disabled={loading || !email.trim()}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Continue
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      OR
                    </span>
                  </div>
                </div>

                {/* OAuth Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full h-12 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-full font-medium"
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

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Password and Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Display */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email address
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      value={email}
                      disabled
                      className="h-14 border-gray-300 bg-gray-50 text-gray-600 px-4 rounded-xl text-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToEmail}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 pr-12 rounded-xl text-lg transition-all duration-300"
                      placeholder="Create a password"
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 pr-12 rounded-xl text-lg transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200/50">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="terms" className="text-sm text-gray-700 font-medium">
                      I agree to the{" "}
                      <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                        Privacy Policy
                      </a>
                    </Label>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create account
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      OR
                    </span>
                  </div>
                </div>

                {/* OAuth Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full h-12 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-full font-medium"
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

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
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
      </div>
    </div>
  );
};
