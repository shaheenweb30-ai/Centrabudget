import { useState } from "react";
import { SignUpPage } from "./SignUpPage";
import { SignInPage } from "./SignInPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { ResetPasswordPage } from "./ResetPasswordPage";
import { VerifyEmailPage } from "./VerifyEmailPage";
import { TwoFactorPage } from "./TwoFactorPage";

type AuthPage = 'signup' | 'signin' | 'forgot-password' | 'reset-password' | 'verify-email' | 'two-factor';

export const AuthRouterDemo = () => {
  const [currentPage, setCurrentPage] = useState<AuthPage>('signup');

  const pages: { key: AuthPage; label: string }[] = [
    { key: 'signup', label: 'Sign Up' },
    { key: 'signin', label: 'Sign In' },
    { key: 'forgot-password', label: 'Forgot Password' },
    { key: 'reset-password', label: 'Reset Password' },
    { key: 'verify-email', label: 'Verify Email' },
    { key: 'two-factor', label: 'Two Factor' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <SignUpPage />;
      case 'signin':
        return <SignInPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'reset-password':
        return <ResetPasswordPage />;
      case 'verify-email':
        return <VerifyEmailPage />;
      case 'two-factor':
        return <TwoFactorPage />;
      default:
        return <SignUpPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm p-2">
          <div className="flex flex-wrap gap-1">
            {pages.map((page) => (
              <button
                key={page.key}
                onClick={() => setCurrentPage(page.key)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  currentPage === page.key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Page */}
      {renderPage()}
    </div>
  );
};
