import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "./AuthLayout";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight, RefreshCw } from "lucide-react";

export const VerifyEmailPage = () => {
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'checking' | 'success' | 'error' | 'pending'>('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const handleVerification = async () => {
    try {
      setLoading(true);
      setVerificationStatus('checking');
      
      console.log('🔍 DEBUG: Starting verification process...');
      console.log('🔍 DEBUG: Current URL:', window.location.href);
      
      // Get the current URL and extract tokens from hash fragment
      const url = new URL(window.location.href);
      const hash = window.location.hash;
      
      console.log('🔍 DEBUG: Hash length:', hash.length);
      
      // Parse hash fragment for tokens (Supabase sends tokens in hash, not query params)
      let hashParams;
      let accessToken = null;
      let refreshToken = null;
      let type = null;
      
      if (hash && hash.length > 1) {
        try {
          hashParams = new URLSearchParams(hash.substring(1)); // Remove the # and parse
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          type = hashParams.get('type');
          
          console.log('🔍 DEBUG: Hash parsing successful');
          console.log('🔍 DEBUG: Type:', type);
        } catch (hashError) {
          console.error('❌ ERROR: Failed to parse hash:', hashError);
        }
      } else {
        console.log('⚠️ WARNING: No hash found in URL');
      }
      
      console.log('🔍 DEBUG: Verification URL params:', { 
        accessToken: !!accessToken, 
        refreshToken: !!refreshToken, 
        type,
        fullUrl: window.location.href,
        hash: hash,
        hashParams: hashParams ? Object.fromEntries(hashParams.entries()) : null
      });
      
      if (accessToken && refreshToken) {
        console.log('🔍 DEBUG: Processing verification with tokens...');
        
        // Set the session with the tokens from the hash
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        console.log('🔍 DEBUG: Session set result:', { 
          data: !!data, 
          error: !!error, 
          session: !!data?.session,
          user: !!data?.user,
          userEmail: data?.user?.email,
          emailConfirmed: data?.user?.email_confirmed_at,
          errorMessage: error?.message
        });
        
        if (error) {
          console.error('❌ ERROR: Setting session failed:', error);
          setVerificationStatus('error');
          setErrorMessage(`Session error: ${error.message}`);
          return;
        }
        
        if (data.session && data.user) {
          console.log('✅ SUCCESS: Session set successfully, user:', data.user.email);
          
          // Check if email is verified
          if (data.user.email_confirmed_at) {
            console.log('✅ SUCCESS: Email verified successfully, redirecting to dashboard...');
            setVerificationStatus('success');
            
            // Store that this is a new user for onboarding
            try {
              localStorage.setItem('centrabudget_newUser', 'true');
              localStorage.setItem('centrabudget_welcomeShown', 'false');
            } catch {}
            
            // Show success toast
            toast({
              title: "Email verified successfully! 🎉",
              description: "Welcome to CentraBudget! Redirecting you to the dashboard...",
            });
            
            // Force a page refresh to ensure AuthContext is properly updated
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
            return;
          } else {
            console.log('⚠️ WARNING: Email not confirmed after session set');
            setVerificationStatus('error');
            setErrorMessage('Email verification failed. Please try again.');
            return;
          }
        } else {
          console.log('❌ ERROR: No session or user data after setting session');
          setVerificationStatus('error');
          setErrorMessage('Failed to create session. Please try signing in again.');
          return;
        }
      } else {
        console.log('🔍 DEBUG: No tokens in hash, checking current auth state...');
        
        // Check if user is already authenticated and verified
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email_confirmed_at) {
          console.log('✅ SUCCESS: User already verified, redirecting to dashboard...');
          setVerificationStatus('success');
          
          // Store that this is a new user for onboarding
          try {
            localStorage.setItem('centrabudget_newUser', 'true');
            localStorage.setItem('centrabudget_welcomeShown', 'false');
          } catch {}
          
          toast({
            title: "Already verified! 🎉",
            description: "Redirecting to dashboard...",
          });
          
          // Force a page refresh to ensure AuthContext is properly updated
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          return;
        } else if (user && !user.email_confirmed_at) {
          console.log('⚠️ WARNING: User not verified yet');
          setVerificationStatus('pending');
        } else {
          console.log('🔍 DEBUG: No user found, showing manual verification instructions');
          setVerificationStatus('pending');
        }
      }
    } catch (error) {
      console.error('❌ ERROR: Verification process failed:', error);
      setVerificationStatus('error');
      setErrorMessage('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify when component mounts
  useEffect(() => {
    // Check if we have any URL parameters that might indicate email verification
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    console.log('🔍 DEBUG: URL search params:', Object.fromEntries(urlParams.entries()));
    console.log('🔍 DEBUG: URL hash params:', Object.fromEntries(hashParams.entries()));
    console.log('🔍 DEBUG: Full URL:', window.location.href);
    console.log('🔍 DEBUG: Hash:', window.location.hash);
    
    // If we have any verification-related parameters, try to handle them
    if (urlParams.has('token') || urlParams.has('type') || hashParams.has('access_token')) {
      console.log('🔍 DEBUG: Found verification parameters, processing...');
      handleVerification();
    } else {
      console.log('🔍 DEBUG: No verification parameters found, checking auth state...');
      handleVerification();
    }
  }, []);

  // Handle manual verification button click
  const handleManualVerification = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 DEBUG: Manual verification triggered');
      
      // Check current auth state
      const { data: { user } } = await supabase.auth.getUser();
      console.log('🔍 DEBUG: Current user state:', { 
        exists: !!user, 
        email: user?.email,
        emailConfirmed: user?.email_confirmed_at 
      });
      
      if (user && user.email_confirmed_at) {
        console.log('✅ SUCCESS: User is verified, redirecting...');
        setVerificationStatus('success');
        
        // Store that this is a new user for onboarding
        try {
          localStorage.setItem('centrabudget_newUser', 'true');
          localStorage.setItem('centrabudget_welcomeShown', 'false');
        } catch {}
        
        toast({
          title: "Email verified! 🎉",
          description: "Redirecting to dashboard...",
        });
        
        // Force a page refresh to ensure AuthContext is properly updated
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else if (user && !user.email_confirmed_at) {
        console.log('⚠️ WARNING: User exists but email not confirmed');
        setVerificationStatus('pending');
        setErrorMessage('Your email is not verified yet. Please check your inbox and click the verification link.');
      } else {
        console.log('🔍 DEBUG: No user found, checking if we can verify by email');
        
        // Try to get the email from localStorage (set during signup)
        const lastEmail = localStorage.getItem('lastEmail');
        
        if (lastEmail) {
          console.log('🔍 DEBUG: Found email in localStorage:', lastEmail);
          
          // Try to check if this email is already verified by attempting a sign-in
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: lastEmail,
              password: 'dummy-password-to-check-status' // This will fail but we can check the error
            });
            
            if (signInError && signInError.message.includes('Invalid login credentials')) {
              // This means the email exists but password is wrong
              console.log('🔍 DEBUG: Email exists, checking verification status...');
              
              // Try to get user info another way
              const { data: { user: emailUser } } = await supabase.auth.getUser();
              
              if (emailUser && emailUser.email === lastEmail) {
                if (emailUser.email_confirmed_at) {
                  console.log('✅ SUCCESS: User is verified via email check!');
                  setVerificationStatus('success');
                  
                  // Store that this is a new user for onboarding
                  try {
                    localStorage.setItem('centrabudget_newUser', 'true');
                    localStorage.setItem('centrabudget_welcomeShown', 'false');
                  } catch {}
                  
                  toast({
                    title: "Email verified! 🎉",
                    description: "Redirecting to dashboard...",
                  });
                  
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 1500);
                  return;
                } else {
                  console.log('⚠️ WARNING: Email exists but not verified');
                  setVerificationStatus('pending');
                  setErrorMessage('Please check your email and click the verification link.');
                }
              } else {
                console.log('🔍 DEBUG: Could not determine user status');
                setVerificationStatus('pending');
                setErrorMessage('Please check your email and click the verification link.');
              }
            } else {
              setVerificationStatus('pending');
              setErrorMessage('Please check your email and click the verification link.');
            }
          } catch (checkError) {
            setVerificationStatus('pending');
            setErrorMessage('Please check your email and click the verification link.');
          }
        } else {
          setVerificationStatus('pending');
          setErrorMessage('Please check your email and click the verification link.');
        }
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage('Verification check failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    try {
      setLoading(true);
      
      // Get the email from localStorage (set during signup)
      const lastEmail = localStorage.getItem('lastEmail');
      
      if (!lastEmail) {
        setErrorMessage('No email found. Please try signing up again.');
        return;
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: lastEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        setErrorMessage(`Failed to resend verification: ${error.message}`);
      } else {
        toast({
          title: "Verification email sent! 📧",
          description: "Please check your inbox and click the verification link.",
        });
        setVerificationStatus('pending');
      }
    } catch (error) {
      console.error('Resend verification failed:', error);
      setErrorMessage('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh verification check
  const handleRefreshVerification = async () => {
    try {
      setLoading(true);
      setVerificationStatus('checking');
      
      // Wait a moment and then check again
      setTimeout(async () => {
        await handleVerification();
      }, 1000);
    } catch (error) {
      console.error('Refresh verification failed:', error);
      setVerificationStatus('error');
      setErrorMessage('Failed to refresh verification status. Please try again.');
    }
  };

  // Handle go to login
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            Please verify your email address to continue
          </p>
        </div>

        <Card className="w-full">
          <CardContent className="p-6">
            {verificationStatus === 'checking' && (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Checking verification status...</p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a few moments...
                </p>
              </div>
            )}

            {verificationStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Verified Successfully! 🎉
                </h2>
                <p className="text-gray-600 mb-6">
                  Welcome to CentraBudget! You're being redirected to the dashboard...
                </p>
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}

            {verificationStatus === 'error' && (
              <div className="text-center py-8">
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  {errorMessage || 'There was an issue verifying your email. Please try again.'}
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleManualVerification}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Check Verification Status
                  </Button>
                  <Button
                    onClick={handleRefreshVerification}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                  <Button
                    onClick={handleGoToLogin}
                    variant="ghost"
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            )}

            {verificationStatus === 'pending' && (
              <div className="text-center py-8">
                <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-6">
                  We've sent you a verification link. Please check your email and click the link to verify your account.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleManualVerification}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    I've Verified My Email
                  </Button>
                  <Button
                    onClick={handleRefreshVerification}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                  <Button
                    onClick={handleGoToLogin}
                    variant="ghost"
                    className="w-full"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Having trouble? Check your spam folder or contact support.
          </p>
          <Button
            onClick={handleGoToLogin}
            variant="ghost"
            className="text-blue-600 hover:text-blue-700"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
