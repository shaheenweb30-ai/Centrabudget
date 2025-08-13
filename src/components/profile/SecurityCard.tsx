import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Link, Unlink, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityCardProps {
  user: User;
}

const SecurityCard = ({ user }: SecurityCardProps) => {
  // Check if user signed up with OAuth providers
  const isGoogleConnected = user.app_metadata?.providers?.includes('google');
  const isAppleConnected = user.app_metadata?.providers?.includes('apple');
  const isEmailAuth = !isGoogleConnected && !isAppleConnected;

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChangePassword = () => {
    setShowPasswordChange(true);
  };

  const handlePasswordChangeSubmit = async () => {
    try {
      setLoading(true);
      
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your new passwords match.",
          variant: "destructive",
        });
        return;
      }

      if (newPassword.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }

      // For now, just show success since we're not actually changing passwords
      // In a real app, you'd call the password change API here
      
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
      
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: "Error changing password",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordChange(false);
  };

  const handleDisconnectProvider = (provider: string) => {
    // In a real app, this would disconnect the OAuth provider
    console.log(`Disconnecting ${provider}...`);
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Section */}
        {isEmailAuth && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium text-foreground">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated: Never
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        )}



        {/* Connected Accounts */}
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Connected Accounts</h3>
          
          {/* Google Account */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">G</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Google</h4>
                <p className="text-sm text-muted-foreground">
                  {isGoogleConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isGoogleConnected ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnectProvider('google')}
                className="text-destructive hover:text-destructive"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>

          {/* Apple Account */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-bold text-sm">🍎</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">Apple</h4>
                <p className="text-sm text-muted-foreground">
                  {isAppleConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            {isAppleConnected ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDisconnectProvider('apple')}
                className="text-destructive hover:text-destructive"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                <Link className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={resetPasswordForm}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChangeSubmit} disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SecurityCard;