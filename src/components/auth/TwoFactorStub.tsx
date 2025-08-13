import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface TwoFactorStubProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
}

export const TwoFactorStub = ({ onSubmit, loading = false }: TwoFactorStubProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste event
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      
      // Focus next empty input or last input
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-advance to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onSubmit(fullCode);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Two-factor verification
        </h1>
        <p className="text-muted-foreground">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="2fa-code" className="sr-only">
            Enter 6-digit code
          </Label>
          
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-mono rounded-xl border-border focus:ring-2 focus:ring-primary focus:ring-offset-0"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl"
          disabled={loading || !isCodeComplete}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </form>

      <div className="space-y-4">
        <Button
          variant="link"
          className="text-primary hover:underline underline-offset-2"
          onClick={() => {
            // TODO: Implement backup code flow
            console.log('Use backup code');
          }}
        >
          Use a backup code
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Trouble? Contact support.
        </p>
      </div>
    </div>
  );
};
