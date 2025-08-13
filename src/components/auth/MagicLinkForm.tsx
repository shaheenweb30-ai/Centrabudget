import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface MagicLinkFormProps {
  onSubmit: (email: string) => void;
  loading?: boolean;
}

export const MagicLinkForm = ({ onSubmit, loading = false }: MagicLinkFormProps) => {
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
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Check your inbox</h3>
        <p className="text-muted-foreground">
          We've sent a magic link to <strong>{email}</strong>. 
          The link expires in 10 minutes.
        </p>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
          className="mt-4"
        >
          Send another link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="magic-email">Email</Label>
        <Input
          id="magic-email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Enter your email"
          className={`rounded-xl ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'magic-email-error' : undefined}
          autoComplete="email"
        />
        {error && (
          <p id="magic-email-error" className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={loading}
      >
        {loading ? 'Sending link...' : 'Send link'}
      </Button>
    </form>
  );
};
