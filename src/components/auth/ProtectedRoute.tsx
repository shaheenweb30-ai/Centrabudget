import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requireEmailVerification = false, // Changed to false by default
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, isEmailVerified, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // During OAuth (PKCE) callback, Supabase exchanges the code in the URL for a session.
  // Avoid redirecting away while these params are present to prevent interrupting the exchange.
  const isProcessingOAuthCallback = typeof window !== 'undefined' && (
    (window.location.search && (
      window.location.search.includes('code=') ||
      window.location.search.includes('access_token=') ||
      window.location.search.includes('refresh_token=') ||
      window.location.search.includes('error_description=')
    )) ||
    (window.location.hash && (
      window.location.hash.includes('access_token=') ||
      window.location.hash.includes('refresh_token=') ||
      window.location.hash.includes('type=recovery')
    ))
  );

  // Add debugging
  console.log('🔍 DEBUG: ProtectedRoute - User:', !!user, 'EmailVerified:', isEmailVerified, 'Loading:', loading);

  useEffect(() => {
    // Don't redirect while loading or while OAuth callback is being processed
    if (loading || isProcessingOAuthCallback) return;

    // If no user, redirect to login
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate(fallbackPath);
      return;
    }

    // If email verification is required and user is not verified, redirect to verification
    if (requireEmailVerification && !isEmailVerified) {
      console.log('🔍 DEBUG: ProtectedRoute - Email not verified, redirecting to verification');
      toast({
        title: "Email verification required",
        description: "Please verify your email address to access this page.",
        variant: "destructive",
      });
      navigate('/verify-email');
      return;
    }
  }, [user, isEmailVerified, loading, isProcessingOAuthCallback, navigate, toast, requireEmailVerification, fallbackPath]);

  // Show loading state while checking auth
  if (loading || isProcessingOAuthCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render children (will redirect in useEffect)
  if (!user) {
    return null;
  }

  // If email verification is required and user is not verified, don't render children
  if (requireEmailVerification && !isEmailVerified) {
    return null;
  }

  // User is authenticated and verified (if required), render children
  return <>{children}</>;
};
