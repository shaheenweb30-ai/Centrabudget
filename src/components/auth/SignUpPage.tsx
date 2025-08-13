import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles, User, Mail, Lock, ArrowLeft, AlertCircle, Shield, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAuthRedirectUrl, getEmailRedirectUrl } from "@/lib/auth-utils";

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [signupAttempts, setSignupAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Rate limiting constants
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  // Generate CSRF token on component mount
  useEffect(() => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    setCsrfToken(token);
  }, []);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input.replace(/[<>]/g, '').trim();
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return "Password must contain uppercase, lowercase, and numbers";
    }
    
    return null;
  };

  const validateForm = () => {
    // Check rate limiting
    const now = Date.now();
    if (signupAttempts >= MAX_ATTEMPTS) {
      if (now - lastAttemptTime < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - (now - lastAttemptTime)) / 60000);
        setError(`Too many signup attempts. Please try again in ${remainingTime} minutes.`);
        return false;
      } else {
        // Reset attempts after lockout period
        setSignupAttempts(0);
      }
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Increment signup attempts
      setSignupAttempts(prev => prev + 1);
      setLastAttemptTime(Date.now());
      
      // Sanitize inputs before sending
      const sanitizedData = {
        email: sanitizeInput(formData.email),
        password: formData.password, // Don't sanitize password
        fullName: sanitizeInput(formData.fullName)
      };
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedData.email,
        password: sanitizedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            full_name: sanitizedData.fullName,
            csrf_token: csrfToken, // Add CSRF token to user metadata
          }
        }
      });

      console.log('Supabase signup response:', { data, error });

      if (error) {
        let userFriendlyMessage = "Sign up failed. Please try again.";
        
        switch (error.message) {
          case 'User already registered':
            userFriendlyMessage = "An account with this email already exists. Please sign in instead.";
            break;
          case 'Password should be at least 6 characters':
            userFriendlyMessage = "Password must be at least 8 characters long.";
            break;
          case 'Invalid email':
            userFriendlyMessage = "Please enter a valid email address.";
            break;
          case 'Signup is disabled':
            userFriendlyMessage = "Sign up is currently disabled. Please contact support.";
            break;
          case 'Too many requests':
            userFriendlyMessage = "Too many requests. Please wait a moment and try again.";
            break;
          default:
            userFriendlyMessage = error.message;
        }
        
        setError(userFriendlyMessage);
        toast({
          title: "Sign up failed",
          description: userFriendlyMessage,
          variant: "destructive",
        });
      } else {
        // Reset signup attempts on success
        setSignupAttempts(0);
        
        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
          try { 
            localStorage.setItem('lastEmail', sanitizedData.email); 
          } catch {}
          
          // Set success state and show email verification instructions
          setSignupSuccess(true);
          setUserEmail(sanitizedData.email);
          
          toast({
            title: "Check your email! 📧",
            description: "We've sent you a verification link. Please check your inbox and click the link to verify your account.",
          });
          
          // Don't navigate immediately - let user check their email first
          // The verification link will redirect them to /verify-email with tokens
        } else if (data.user && data.user.email_confirmed_at) {
          toast({
            title: "Account created successfully!",
            description: "Welcome to CentraBudget!",
          });
          navigate("/dashboard");
        } else {
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
        toast({
          title: 'Sign-in failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signing in...',
          description: 'Redirecting to Google for authentication.',
        });
      }
    } catch (error) {
      toast({
        title: 'Sign-in failed',
        description: 'An unexpected error occurred during Google sign-in.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is currently locked out
  const isLockedOut = signupAttempts >= MAX_ATTEMPTS && 
    (Date.now() - lastAttemptTime) < LOCKOUT_TIME;

  const remainingLockoutTime = isLockedOut 
    ? Math.ceil((LOCKOUT_TIME - (Date.now() - lastAttemptTime)) / 60000)
    : 0;

  // If signup was successful, show email verification instructions
  if (signupSuccess) {
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
              Account Created
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-[500px]">
            {/* Success Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Account Created Successfully! 🎉
                </h1>
                <p className="text-lg text-gray-600">
                  Welcome to CentraBudget! We've sent a verification link to:
                </p>
                <p className="text-lg font-semibold text-blue-600 mt-2">
                  {userEmail}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
                <ol className="text-left text-blue-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                    Check your email inbox (and spam folder)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    Click the verification link in the email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    You'll be automatically signed in and redirected to the dashboard
                  </li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setSignupSuccess(false)}
                  variant="outline"
                  className="w-full"
                >
                  ← Back to Sign Up
                </Button>
                
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="w-full"
                >
                  Already verified? Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Join CentraBudget
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create your account
              </h1>
              <p className="text-lg text-gray-600 max-w-sm mx-auto">
                Start your financial journey with AI-powered insights
              </p>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-blue-600">
                  Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>

            {/* Rate Limiting Warning */}
            {isLockedOut && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-red-600 font-medium">
                      Too many signup attempts
                    </p>
                    <p className="text-xs text-red-500">
                      Please try again in {remainingLockoutTime} minutes
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={isLockedOut}
                  maxLength={100}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300"
                  placeholder="Enter your email"
                  disabled={isLockedOut}
                  maxLength={254}
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
                    placeholder="Create a password (min. 8 characters)"
                    disabled={isLockedOut}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    disabled={isLockedOut}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must contain uppercase, lowercase, and numbers
                </p>
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
                    disabled={isLockedOut}
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 transition-colors duration-300"
                    disabled={isLockedOut}
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
                  disabled={isLockedOut}
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
                disabled={loading || !agreeToTerms || isLockedOut}
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
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={loading || isLockedOut}
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
