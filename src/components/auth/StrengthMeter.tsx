import { useMemo } from "react";

interface StrengthMeterProps {
  password: string;
}

interface StrengthLevel {
  label: string;
  color: string;
  bgColor: string;
  width: string;
}

const strengthLevels: StrengthLevel[] = [
  { label: "Very weak", color: "text-red-500", bgColor: "bg-red-500", width: "w-1/5" },
  { label: "Weak", color: "text-orange-500", bgColor: "bg-orange-500", width: "w-2/5" },
  { label: "Fair", color: "text-yellow-500", bgColor: "bg-yellow-500", width: "w-3/5" },
  { label: "Strong", color: "text-blue-500", bgColor: "bg-blue-500", width: "w-4/5" },
  { label: "Very strong", color: "text-green-500", bgColor: "bg-green-500", width: "w-full" }
];

export const StrengthMeter = ({ password }: StrengthMeterProps) => {
  const strength = useMemo(() => {
    if (!password) return null;

    let score = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    // Length scoring
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;

    // Character variety scoring
    if (hasLower) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSymbol) score += 1;

    // Bonus for mixed case
    if (hasLower && hasUpper) score += 1;

    // Determine level
    if (score <= 1) return 0; // Very weak
    if (score <= 2) return 1; // Weak
    if (score <= 3) return 2; // Fair
    if (score <= 4) return 3; // Strong
    return 4; // Very strong
  }, [password]);

  if (!password) return null;

  const currentLevel = strengthLevels[strength!];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Password strength</span>
        <span className={`text-xs font-medium ${currentLevel.color}`}>
          {currentLevel.label}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${currentLevel.bgColor} ${currentLevel.width}`}
          role="progressbar"
          aria-valuenow={strength! + 1}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label={`Password strength: ${currentLevel.label}`}
        />
      </div>
      
      <p className="text-xs text-muted-foreground">
        Use 12+ characters, mixed case, numbers, and symbols.
      </p>
    </div>
  );
};
