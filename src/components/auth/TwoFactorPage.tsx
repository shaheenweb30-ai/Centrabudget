import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AuthLayout } from "./AuthLayout";
import { TwoFactorStub } from "./TwoFactorStub";

export const TwoFactorPage = () => {
  const [loading, setLoading] = useState(false);

  const handleTwoFactor = async (code: string) => {
    setLoading(true);
    
    try {
      // TODO: Wire to real authentication service (Supabase/Firebase/Cognito/Custom)
      console.log('2FA code submitted:', code);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard
      window.location.href = '/app';
      
    } catch (error) {
      console.error('2FA verification error:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showSidePanel={false}>
      <Card className="rounded-2xl border shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6 md:p-8">
          <TwoFactorStub onSubmit={handleTwoFactor} loading={loading} />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
