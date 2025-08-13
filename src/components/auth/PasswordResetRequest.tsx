import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, Sparkles, Shield } from "lucide-react";

interface PasswordResetRequestProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

export const PasswordResetRequest = ({ onSubmit, loading = false }: PasswordResetRequestProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail()) {
      onSubmit(email);
      setSuccess(true);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError('');
    if (success) setSuccess(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Check your inbox</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            If that email exists, we've sent a secure reset link to <strong className="text-gray-900">{email}</strong>.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
          className="mt-6 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 font-semibold rounded-full transition-all duration-300"
        >
          <Mail className="w-4 h-4 mr-2" />
          Send another link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email address
        </Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Enter your email address"
          className={`h-14 border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 rounded-xl text-lg transition-all duration-300 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'reset-email-error' : undefined}
          autoComplete="email"
        />
        {error && (
          <div id="reset-email-error" className="p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg hover:shadow-xl"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending reset link...
          </div>
        ) : (
          <>
            <Shield className="w-5 h-5 mr-2" />
            Send reset link
          </>
        )}
      </Button>
    </form>
  );
};
