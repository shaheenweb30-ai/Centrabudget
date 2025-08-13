import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "./PasswordField";

interface EmailSignInFormProps {
  onSubmit: (data: SignInData) => void;
  loading?: boolean;
}

interface SignInData {
  email: string;
  password: string;
}

export const EmailSignInForm = ({ onSubmit, loading = false }: EmailSignInFormProps) => {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<SignInData>>({});
  const [genericError, setGenericError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<SignInData> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGenericError(''); // Clear any previous generic errors
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SignInData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (genericError) {
      setGenericError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          className={`rounded-xl ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-500" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        required
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      {/* Generic Error (for security - never show which field is wrong) */}
      {genericError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-600">{genericError}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>

      {/* Helper Text */}
      <p className="text-sm text-muted-foreground text-center">
        Having trouble? Contact support.
      </p>
    </form>
  );
};
