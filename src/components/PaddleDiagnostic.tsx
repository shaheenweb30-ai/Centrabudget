import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { useUserPlan } from '@/hooks/useUserPlan';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Zap,
  Clock,
  User
} from 'lucide-react';

export const PaddleDiagnostic = () => {
  const { user } = useAuth();
  const { isActive: isSubscriptionActive, isLoading: isSubscriptionLoading } = useRealtimeSubscription();
  const { currentPlan, isFreePlan, refreshPlan } = useUserPlan();
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkUserRoles = async () => {
    if (!user) return;
    
    setLoadingRoles(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user roles:', error);
      } else {
        setUserRoles(data || []);
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('Error checking user roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    checkUserRoles();
  }, [user]);

  const getStatusIcon = (isActive: boolean) => {
    if (isActive) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Paddle Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please log in to view diagnostic information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Real-Time Subscription Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Real-Time Hook Status:</span>
              {getStatusIcon(isSubscriptionActive)}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">User Plan Hook Status:</span>
              {getStatusIcon(!isFreePlan)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {isSubscriptionActive ? 'Pro' : 'Free'}
              </div>
              <div className="text-sm text-blue-600">Real-Time Status</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {currentPlan}
              </div>
              <div className="text-sm text-green-600">User Plan Hook</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {isFreePlan ? 'Free' : 'Pro'}
              </div>
              <div className="text-sm text-purple-600">Plan Status</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Last updated: {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
            </span>
            <Button 
              onClick={checkUserRoles} 
              disabled={loadingRoles}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loadingRoles ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-500" />
            Database State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">User ID:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {user.id}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">User Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Email Confirmed:</span>
              <span className="text-sm">
                {user.email_confirmed_at ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">User Roles in Database:</h4>
            {userRoles.length > 0 ? (
              <div className="space-y-2">
                {userRoles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{role.role}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(role.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No roles found for this user
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Troubleshooting Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium">Check Webhook Deployment</h4>
                <p className="text-sm text-gray-600">
                  Ensure your webhook handler is deployed and accessible. Check the deployment guide.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium">Verify Paddle Configuration</h4>
                <p className="text-sm text-gray-600">
                  Check Paddle dashboard for webhook URL and ensure it's active.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium">Test Payment Flow</h4>
                <p className="text-sm text-gray-600">
                  Make a test purchase and check webhook logs for any errors.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-medium">Check Database Functions</h4>
                <p className="text-sm text-gray-600">
                  Ensure the `activate_user_subscription` function exists in Supabase.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Common Issue</span>
            </div>
            <p className="text-sm text-yellow-700">
              If real-time detection isn't working, the most likely cause is that the webhook handler 
              isn't deployed or isn't receiving data from Paddle. Check the deployment guide first.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
