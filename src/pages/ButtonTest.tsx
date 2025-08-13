import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { robustLogout, forceLogout } from '@/lib/auth-utils';

export default function ButtonTest() {
  const { user, signOut } = useAuth();

  const handleTestLogout = async () => {
    console.log('🧪 Testing logout functionality...');
    try {
      await signOut();
      console.log('✅ AuthContext logout successful');
    } catch (error) {
      console.error('❌ AuthContext logout failed:', error);
    }
  };

  const handleTestRobustLogout = async () => {
    console.log('🧪 Testing robust logout...');
    try {
      await robustLogout();
      console.log('✅ Robust logout successful');
    } catch (error) {
      console.error('❌ Robust logout failed:', error);
    }
  };

  const handleTestForceLogout = () => {
    console.log('🧪 Testing force logout...');
    try {
      forceLogout();
      console.log('✅ Force logout successful');
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Force logout failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Button Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current User Status</h2>
          <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Logout Tests</h2>
          
          <Button 
            onClick={handleTestLogout}
            variant="outline"
            className="w-full"
          >
            Test AuthContext Logout
          </Button>
          
          <Button 
            onClick={handleTestRobustLogout}
            variant="outline"
            className="w-full"
          >
            Test Robust Logout
          </Button>
          
          <Button 
            onClick={handleTestForceLogout}
            variant="destructive"
            className="w-full"
          >
            Test Force Logout (Emergency)
          </Button>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Debug Information</h3>
          <p className="text-sm text-yellow-700">
            Check the browser console for detailed logout process logs.
            This will help identify where the 403 error is occurring.
          </p>
        </div>
      </div>
    </div>
  );
}
