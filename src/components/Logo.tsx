import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link to="/" className={`flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group ${className}`}>
      <img 
        src="/assets/centrabudget-mark.svg" 
        alt="CentraBudget" 
        className={`${sizeClasses[size]} w-auto object-contain group-hover:scale-110 transition-transform duration-300`}
      />
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-gray-900 group-hover:scale-105 transition-transform duration-300`}>
          CentraBudget
        </span>
      )}
    </Link>
  );
}
