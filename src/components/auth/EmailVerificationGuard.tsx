import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const EmailVerificationGuard = ({ 
  children, 
  fallbackPath = '/verify-email' 
}: EmailVerificationGuardProps) => {
  const { user, isEmailVerified, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If user exists but email is not verified, redirect to verification
    if (user && !isEmailVerified) {
      toast({
        title: "Email verification required",
        description: "Please verify your email address to access this page.",
        variant: "destructive",
      });
      navigate(fallbackPath);
      return;
    }
  }, [user, isEmailVerified, loading, navigate, toast, fallbackPath]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not verified, don't render children (will redirect in useEffect)
  if (user && !isEmailVerified) {
    return null;
  }

  // If no user, don't render children (user should be redirected to login)
  if (!user) {
    return null;
  }

  // User is verified, render children
  return <>{children}</>;
};
