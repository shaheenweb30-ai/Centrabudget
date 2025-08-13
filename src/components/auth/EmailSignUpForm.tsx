import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordField } from "./PasswordField";
import { StrengthMeter } from "./StrengthMeter";

interface EmailSignUpFormProps {
  onSubmit: (data: SignUpData) => void;
  loading?: boolean;
}

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  currency: string;
  agreeToTerms: boolean;
  marketingOptIn: boolean;
}

const CURRENCIES = [
  { code: 'USD', label: 'USD $' },
  { code: 'GBP', label: 'GBP £' },
  { code: 'EUR', label: 'EUR €' },
  { code: 'AED', label: 'AED د.إ' },
  { code: 'KWD', label: 'KWD د.ك' },
];

export const EmailSignUpForm = ({ onSubmit, loading = false }: EmailSignUpFormProps) => {
  const [formData, setFormData] = useState<SignUpData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    currency: 'USD',
    agreeToTerms: false,
    marketingOptIn: false
  });

  const [errors, setErrors] = useState<Partial<SignUpData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpData> = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().split(' ').length < 2 && formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 words or 2 characters)';
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 letter and 1 number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Please agree to the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SignUpData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          className={`rounded-xl ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-sm text-red-500" role="alert">
            {errors.fullName}
          </p>
        )}
      </div>

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
        placeholder="Create a password"
        autoComplete="new-password"
      />

      {/* Password Strength Meter */}
      <StrengthMeter password={formData.password} />

      {/* Confirm Password */}
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        value={formData.confirmPassword}
        onChange={(value) => handleInputChange('confirmPassword', value)}
        error={errors.confirmPassword}
        required
        placeholder="Confirm your password"
        autoComplete="new-password"
      />

      {/* Currency Selection */}
      <div className="space-y-2">
        <Label htmlFor="currency">Preferred currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) => handleInputChange('currency', value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:underline underline-offset-2">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline underline-offset-2">
                Privacy Policy
              </a>
            </Label>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500" role="alert">
                {errors.agreeToTerms}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="marketingOptIn"
            checked={formData.marketingOptIn}
            onCheckedChange={(checked) => handleInputChange('marketingOptIn', checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="marketingOptIn" className="text-sm text-muted-foreground">
            Send me monthly tips and product updates
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      {/* Fine Print */}
      <p className="text-xs text-muted-foreground text-center">
        By continuing, you agree to our Terms and acknowledge our Privacy Policy.
      </p>
    </form>
  );
};
