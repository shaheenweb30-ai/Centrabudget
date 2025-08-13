import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const AuthDebug = () => {
  const { user, session, loading, isEmailVerified } = useAuth();

  const debugInfo = {
    user: !!user,
    userEmail: user?.email,
    userId: user?.id,
    session: !!session,
    loading,
    isEmailVerified,
    timestamp: new Date().toISOString(),
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div><strong>User:</strong> {user ? 'Yes' : 'No'}</div>
        <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
        <div><strong>User ID:</strong> {user?.id || 'N/A'}</div>
        <div><strong>Session:</strong> {session ? 'Yes' : 'No'}</div>
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Email Verified:</strong> {isEmailVerified ? 'Yes' : 'No'}</div>
        <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
      </div>
      <Button 
        onClick={copyToClipboard} 
        size="sm" 
        className="mt-2 text-xs"
        variant="outline"
      >
        Copy Debug Info
      </Button>
    </div>
  );
};
