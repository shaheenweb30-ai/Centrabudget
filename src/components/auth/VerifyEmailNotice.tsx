import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";

interface VerifyEmailNoticeProps {
  email?: string;
  onResend?: () => void;
  loading?: boolean;
}

export const VerifyEmailNotice = ({ 
  email = localStorage.getItem('lastEmail') || 'your email',
  onResend,
  loading = false 
}: VerifyEmailNoticeProps) => {
  const [countdown, setCountdown] = useState(0);

  const handleResend = () => {
    if (onResend) {
      onResend();
      setCountdown(30);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Verify your email
        </h1>
        <p className="text-muted-foreground">
          We've sent a verification link to <strong>{email}</strong>.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleResend}
          disabled={loading || countdown > 0}
          variant="outline"
          className="w-full rounded-xl"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : countdown > 0 ? (
            `Resend in ${countdown}s`
          ) : (
            'Resend link'
          )}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Didn't receive it? Check your spam folder or try again.
        </p>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Already verified?{' '}
          <Button
            variant="link"
            className="p-0 h-auto text-primary hover:underline underline-offset-2"
            onClick={() => window.location.href = '/signin'}
          >
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};
