import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminSetup = () => {
  const { user } = useAuth();
  const { isAdmin, role, loading } = useUserRole(user);
  const { toast } = useToast();
  const [settingUp, setSettingUp] = useState(false);

  const makeAdmin = async () => {
    if (!user) return;
    
    setSettingUp(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) {
        console.error('Error setting admin role:', error);
        toast({
          title: "Error",
          description: "Failed to set admin role. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You are now an admin! Please refresh the page.",
        });
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Error setting admin role:', error);
      toast({
        title: "Error",
        description: "Failed to set admin role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSettingUp(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user role...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">User ID: {user?.id}</p>
          <p className="text-sm text-muted-foreground">Current Role: {role || 'No role assigned'}</p>
          <p className="text-sm text-muted-foreground">Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
        </div>
        
        {!isAdmin && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Click the button below to make yourself an admin. This will give you access to the website administration features.
            </p>
            <Button 
              onClick={makeAdmin} 
              disabled={settingUp}
              className="w-full"
            >
              {settingUp ? 'Setting up admin...' : 'Make Me Admin'}
            </Button>
          </div>
        )}
        
        {isAdmin && (
          <div className="space-y-2">
            <p className="text-sm text-green-600 font-medium">✅ You are an admin!</p>
            <p className="text-sm text-muted-foreground">
              You can now access the website administration features in the Settings page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 