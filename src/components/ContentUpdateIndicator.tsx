import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ContentUpdateIndicatorProps {
  isUpdating: boolean;
  message?: string;
}

export function ContentUpdateIndicator({ isUpdating, message = "Updating content..." }: ContentUpdateIndicatorProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isUpdating && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isUpdating, showSuccess]);

  useEffect(() => {
    if (isUpdating) {
      setShowSuccess(false);
    } else if (!isUpdating && !showSuccess) {
      setShowSuccess(true);
    }
  }, [isUpdating]);

  if (!isUpdating && !showSuccess) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 flex items-center space-x-2">
        {isUpdating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{message}</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Content updated successfully!</span>
          </>
        )}
      </div>
    </div>
  );
} 