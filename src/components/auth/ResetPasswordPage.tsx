import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
import { PasswordResetForm } from "./PasswordResetForm";

export const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (password: string) => {
    setLoading(true);
    
    try {
      // TODO: Wire to real authentication service (Supabase/Firebase/Cognito/Custom)
      console.log('Password reset with new password');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast and redirect to sign in
      // TODO: Show toast "Password updated"
      window.location.href = '/signin';
      
    } catch (error) {
      console.error('Password reset error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="rounded-2xl border shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Set a new password
              </h1>
              <p className="text-muted-foreground">
                Choose a strong password for your account.
              </p>
            </div>

            {/* Password Reset Form */}
            <PasswordResetForm onSubmit={handlePasswordReset} loading={loading} />
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
