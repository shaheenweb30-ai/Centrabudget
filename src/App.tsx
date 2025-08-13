import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrandingProvider } from "@/contexts/BrandingContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import { PricingProvider } from "@/contexts/PricingContext";
import { PackageDescriptionsProvider } from "@/contexts/PackageDescriptionsContext";
import { PlanFeaturesProvider } from "@/contexts/PlanFeaturesContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { ContentUpdateIndicator } from "@/components/ContentUpdateIndicator";

import { ScrollToTop } from "@/components/ScrollToTop";
import './i18n';
import Homepage1 from "./pages/Homepage1";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";

import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";




import CategoriesBudget from "./pages/CategoriesBudget";
import Subscription from "./pages/Subscription";
import Checkout from "./pages/Checkout";

import Reports from "./pages/Reports";
import ButtonTest from "./pages/ButtonTest";

import AdminUsers from "./pages/admin/AdminUsers";
import AdminTranslations from "./pages/admin/AdminTranslations";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminPackageDescriptions from "./pages/admin/AdminPackageDescriptions";
import AdminPlanFeatures from "./pages/admin/AdminPlanFeatures";

// Import new auth pages
import { 
  ForgotPasswordPage, 
  ResetPasswordPage, 
  VerifyEmailPage, 
  TwoFactorPage,
  AuthRouterDemo,
  ProtectedRoute
} from "@/components/auth";

import { OnboardingWelcome } from "@/components/OnboardingWelcome";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '1rem' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
              Please refresh the page to try again
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('App: Creating QueryClient');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});
console.log('App: QueryClient created successfully');

const AppContent = () => {
  console.log('AppContent: Starting to render');
  
  return (
    <>
      <AuthProvider>
        <BrandingProvider>
          <BrowserRouter>
            <SettingsProvider>
              <TransactionProvider>
                <PricingProvider>
                  <PackageDescriptionsProvider>
                    <PlanFeaturesProvider>
                      <TooltipProvider>
                      <Toaster />
                      {import.meta.env.PROD && <Analytics />}
                      <ScrollToTop />
                      <Routes>
                  <Route path="/" element={<Homepage1 />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />

                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/two-factor" element={<TwoFactorPage />} />
                  <Route path="/auth-demo" element={<AuthRouterDemo />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <OnboardingWelcome />
                    </ProtectedRoute>
                  } />
                  <Route path="/transactions" element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  } />

                  <Route path="/categories-budget" element={
                    <ProtectedRoute>
                      <CategoriesBudget />
                    </ProtectedRoute>
                  } />

          
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/subscription" element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />


                  <Route path="/help" element={<Help />} />
                  <Route path="/privacy" element={<Privacy />} />
                   <Route path="/terms" element={<Terms />} />
                   <Route path="/refund-policy" element={<RefundPolicy />} />
                   
                   {/* Debug Route */}
                   <Route path="/button-test" element={<ButtonTest />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/translations" element={<AdminTranslations />} />
                  <Route path="/admin/pricing" element={<AdminPricing />} />
                  <Route path="/admin/package-descriptions" element={<AdminPackageDescriptions />} />
                  <Route path="/admin/plan-features" element={<AdminPlanFeatures />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                        </TooltipProvider>
                      </PlanFeaturesProvider>
                    </PackageDescriptionsProvider>
                  </PricingProvider>
              </TransactionProvider>
            </SettingsProvider>
          </BrowserRouter>
        </BrandingProvider>
      </AuthProvider>
      <ContentUpdateIndicator isUpdating={false} />
    </>
  );
};

const App = () => {
  console.log('App: Main component rendering');
  
  try {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App: Error in main render:', error);
    throw error;
  }
};

export default App;
