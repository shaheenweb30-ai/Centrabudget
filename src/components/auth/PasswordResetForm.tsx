import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordField } from "./PasswordField";
import { StrengthMeter } from "./StrengthMeter";
import { CheckCircle } from "lucide-react";

interface PasswordResetFormProps {
  onSubmit: (password: string) => void;
  loading?: boolean;
}

export const PasswordResetForm = ({ onSubmit, loading = false }: PasswordResetFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Password must contain at least 1 letter and 1 number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(password);
      setSuccess(true);
    }
  };

  const handleInputChange = (field: 'password' | 'confirmPassword', value: string) => {
    if (field === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Password updated</h3>
        <p className="text-muted-foreground">
          Your password has been successfully updated. You can now sign in.
        </p>
        <Button
          onClick={() => window.location.href = '/signin'}
          className="mt-4"
        >
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* New Password */}
      <PasswordField
        id="new-password"
        label="New password"
        value={password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        required
        placeholder="Enter your new password"
        autoComplete="new-password"
      />

      {/* Password Strength Meter */}
      <StrengthMeter password={password} />

      {/* Confirm Password */}
      <PasswordField
        id="confirm-new-password"
        label="Confirm new password"
        value={confirmPassword}
        onChange={(value) => handleInputChange('confirmPassword', value)}
        error={errors.confirmPassword}
        required
        placeholder="Confirm your new password"
        autoComplete="new-password"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full rounded-xl"
        disabled={loading}
      >
        {loading ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  );
};
