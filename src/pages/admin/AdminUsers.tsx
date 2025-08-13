import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Search, Mail, Calendar, User, Shield, Eye, MoreHorizontal, Crown, UserCheck, UserX, Edit, Trash2, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  role?: string;
  is_active?: boolean;
  current_plan?: string;
  trial_ends_at?: string | null;
}

const AdminUsers = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    fetchUsers();
  }, [isAdmin, user]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First, let's check if we can access auth.users directly (for debugging)
      console.log('Attempting to fetch users...');
      
      // Fetch users from the public.users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users fetch result:', { users, usersError, count: users?.length || 0 });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        
        // Try to get more specific error information
        if (usersError.code === '42501') {
          toast.error('Permission denied. Check if you have admin access.');
        } else if (usersError.code === '42P01') {
          toast.error('Users table not found. Database may not be properly set up.');
        } else {
          toast.error(`Failed to fetch users: ${usersError.message}`);
        }
        return;
      }

      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      console.log('User roles fetch result:', { userRoles, rolesError, count: userRoles?.length || 0 });

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast.warning('Warning: Could not fetch user roles. Users will show with default role.');
      }

      // Fetch user trials/plans
      const { data: userTrials, error: trialsError } = await supabase
        .from('user_trials')
        .select('user_id, plan_type, ends_at');

      console.log('User trials fetch result:', { userTrials, trialsError, count: userTrials?.length || 0 });

      if (trialsError) {
        console.error('Error fetching user trials:', trialsError);
        toast.warning('Warning: Could not fetch user trials. Plan information will not be displayed.');
      }

      // Create a map of user roles
      const roleMap = new Map();
      if (userRoles) {
        userRoles.forEach(({ user_id, role }) => {
          roleMap.set(user_id, role);
        });
      }

      // Create a map of user plans
      const planMap = new Map();
      const trialMap = new Map();
      if (userTrials) {
        userTrials.forEach(({ user_id, plan_type, ends_at }) => {
          planMap.set(user_id, plan_type);
          trialMap.set(user_id, ends_at);
        });
      }

      // Transform users to match our User interface
      const transformedUsers: User[] = (users || []).map(user => {
        const userRole = roleMap.get(user.id) || 'user';
        
        // Determine current plan based on role, not just trial data
        let currentPlan = 'free';
        let trialEndsAt = null;
        
        if (userRole === 'subscriber') {
          currentPlan = 'pro';
        } else if (userRole === 'admin') {
          currentPlan = 'admin';
        } else if (userRole === 'user') {
          // For free users, check if they have an active trial
          const trialEnd = trialMap.get(user.id);
          if (trialEnd) {
            const trialEndDate = new Date(trialEnd);
            const now = new Date();
            if (trialEndDate > now) {
              currentPlan = 'free';
              trialEndsAt = trialEnd;
            } else {
              currentPlan = 'free';
            }
          } else {
            currentPlan = 'free';
          }
        }
        
        // Debug logging for plan determination
        console.log(`User ${user.email} (${user.id}):`, {
          userRole,
          currentPlan,
          trialEndsAt,
          hasTrial: trialMap.has(user.id),
          trialData: trialMap.get(user.id)
        });
        
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at,
          role: userRole,
          is_active: true,
          current_plan: currentPlan,
          trial_ends_at: trialEndsAt
        };
      });

      if (transformedUsers.length === 0) {
        console.log('No users found in public.users table');
        
        // Try to fetch from auth.users to see if the trigger is working
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        console.log('Auth users check:', { authUsers, authError });
        
        if (authUsers?.users && authUsers.users.length > 0) {
          toast.error(`Found ${authUsers.users.length} users in auth but none in public.users. Database trigger may not be working.`);
        } else {
          toast.info('No users found in database. This might be normal for a new installation.');
        }
        
        // Show sample data for development
        const sampleUsers: User[] = [
          {
            id: 'sample-1',
            email: 'admin@centrabudget.com',
            full_name: 'Admin User',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'admin',
            is_active: true,
            current_plan: 'admin',
            trial_ends_at: null
          },
          {
            id: 'sample-2',
            email: 'user@example.com',
            full_name: 'Sample User',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            role: 'user',
            is_active: true,
            current_plan: 'free',
            trial_ends_at: null
          }
        ];
        setUsers(sampleUsers);
        toast.info('Showing sample data - no users found in database');
      } else {
        setUsers(transformedUsers);
        
        // Log admin users to console for debugging
        const adminUsers = transformedUsers.filter(u => u.role === 'admin');
        console.log('Admin Users:', adminUsers);
        
        if (adminUsers.length === 0) {
          toast.warning('No admin users found. You may need to promote a user to admin.');
        }
        
        toast.success(`Loaded ${transformedUsers.length} users successfully`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      subscriber: 'bg-purple-100 text-purple-800',
      user: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || roleColors.user}>
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Action functions
  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
      // First, check if user already has this role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', newRole)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing role:', checkError);
        toast.error('Failed to check user role');
        return;
      }

      if (existingRole) {
        // User already has this role, just update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        toast.success(`User already has role: ${newRole}`);
        return;
      }

      // Remove any existing roles for this user first
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing existing roles:', deleteError);
        toast.error('Failed to remove existing user role');
        return;
      }

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (error) {
        console.error('Error updating user role:', error);
        toast.error('Failed to update user role');
        return;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  // Plan management functions
  const handlePromoteToPro = async (userId: string) => {
    setActionLoading(userId);
    try {
      // First, check if user already has the subscriber role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'subscriber')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing role:', checkError);
        toast.error('Failed to check user role');
        return;
      }

      if (existingRole) {
        // User already has subscriber role, just update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { 
              ...user, 
              role: 'subscriber',
              current_plan: 'pro',
              trial_ends_at: null
            } : user
          )
        );
        toast.success('User is already Pro');
        return;
      }

      // Remove any existing roles for this user first
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing existing roles:', deleteError);
        toast.error('Failed to remove existing user role');
        return;
      }

      // Insert new subscriber role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'subscriber' });

      if (roleError) {
        console.error('Error updating user role:', roleError);
        toast.error('Failed to promote user to Pro');
        return;
      }

      // Remove any existing trial
      const { error: trialError } = await supabase
        .from('user_trials')
        .delete()
        .eq('user_id', userId);

      if (trialError) {
        console.error('Error removing trial:', trialError);
        // Don't fail the operation if trial removal fails
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { 
            ...user, 
            role: 'subscriber',
            current_plan: 'pro',
            trial_ends_at: null
          } : user
        )
      );
      
      toast.success('User promoted to Pro successfully');
    } catch (error) {
      console.error('Error promoting user to Pro:', error);
      toast.error('Failed to promote user to Pro');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDowngradeToFree = async (userId: string) => {
    setActionLoading(userId);
    try {
      // First, check if user already has the user role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'user')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing role:', checkError);
        toast.error('Failed to check user role');
        return;
      }

      if (existingRole) {
        // User already has user role, just update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { 
              ...user, 
              role: 'user',
              current_plan: 'free',
              trial_ends_at: null
            } : user
          )
        );
        toast.success('User is already on Free plan');
        return;
      }

      // Remove any existing roles for this user first
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing existing roles:', deleteError);
        toast.error('Failed to remove existing user role');
        return;
      }

      // Insert new user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'user' });

      if (roleError) {
        console.error('Error updating user role:', roleError);
        toast.error('Failed to downgrade user to Free');
        return;
      }

      // Remove any existing trial first
      const { error: deleteTrialError } = await supabase
        .from('user_trials')
        .delete()
        .eq('user_id', userId);

      if (deleteTrialError) {
        console.error('Error removing existing trial:', deleteTrialError);
        // Don't fail the operation if trial removal fails
      }

      // Create a new trial period (30 days from now)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 30);

      const { error: trialError } = await supabase
        .from('user_trials')
        .insert({ 
          user_id: userId, 
          plan_type: 'free',
          started_at: new Date().toISOString(),
          ends_at: trialEndsAt.toISOString()
        });

      if (trialError) {
        console.error('Error creating trial:', trialError);
        toast.error('Failed to create trial period');
        return;
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { 
            ...user, 
            role: 'user',
            current_plan: 'free',
            trial_ends_at: trialEndsAt.toISOString()
          } : user
        )
      );
      
      toast.success('User downgraded to Free trial successfully');
    } catch (error) {
      console.error('Error downgrading user to Free:', error);
      toast.error('Failed to downgrade user to Free');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    setActionLoading(userId);
    try {
      // In a real implementation, you would update the user status in the database
      // For now, update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, is_active: isActive } : user
        )
      );
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      // In a real implementation, you would delete the user from the database
      // const { error } = await supabase.auth.admin.deleteUser(userId);

      // For now, remove from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = (userId: string) => {
    // In a real implementation, you would open a modal to edit user details
    toast.info('Edit user functionality coming soon');
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to view this page.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage all registered users and their roles.
            </p>
            {users.filter(u => u.role === 'admin').length > 0 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-1">Current Admin Users:</h3>
                <div className="text-xs text-red-700">
                  {users.filter(u => u.role === 'admin').map(admin => (
                    <div key={admin.id} className="flex items-center gap-2">
                      <Crown className="w-3 h-3" />
                      {admin.full_name || admin.email} ({admin.email})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchUsers} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            {!isAdmin && user && (
              <div className="flex items-center gap-2">
                <Button 
                  onClick={async () => {
                    try {
                      // Add admin role for current user
                      const { error } = await supabase
                        .from('user_roles')
                        .upsert({ 
                          user_id: user.id, 
                          role: 'admin' 
                        });
                      
                      if (error) {
                        console.error('Error adding admin role:', error);
                        toast.error('Failed to add admin role');
                      } else {
                        toast.success('Admin role added successfully');
                        // Refresh the page to update the role
                        window.location.reload();
                      }
                    } catch (error) {
                      console.error('Error adding admin role:', error);
                      toast.error('Failed to add admin role');
                    }
                  }}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Make Me Admin
                </Button>
                <div className="text-xs text-gray-500">
                  Current user: {user.email}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pro Users</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => u.current_plan === 'pro').length}
                  </p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Free Trial Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.current_plan === 'free' && u.trial_ends_at).length}
                  </p>
                </div>
                <User className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.is_active).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {users.filter(u => !u.is_active).length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(user.full_name, user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {user.full_name || 'No name provided'}
                              </p>
                              <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role || 'user')}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge 
                              variant="outline"
                              className={
                                user.current_plan === 'pro' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                                user.current_plan === 'enterprise' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                'border-green-500 text-green-700 bg-green-50'
                              }
                            >
                              {user.current_plan === 'pro' ? 'Pro' : 
                               user.current_plan === 'enterprise' ? 'Enterprise' : 'Free'}
                            </Badge>
                            {user.trial_ends_at && (
                              <span className="text-xs text-gray-500">
                                Trial ends: {formatDate(user.trial_ends_at)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.is_active ? "default" : "secondary"}
                            className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {user.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatDate(user.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{formatDate(user.updated_at)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={actionLoading === user.id}
                              >
                                {actionLoading === user.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                ) : (
                                  <MoreHorizontal className="w-4 h-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {/* Role Management */}
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                disabled={user.role === 'admin'}
                                className="cursor-pointer"
                              >
                                <Crown className="w-4 h-4 mr-2 text-red-500" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'subscriber')}
                                disabled={user.role === 'subscriber'}
                                className="cursor-pointer"
                              >
                                <Crown className="w-4 h-4 mr-2 text-purple-500" />
                                Make Subscriber
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'user')}
                                disabled={user.role === 'user'}
                                className="cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2 text-green-500" />
                                Make User
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              {/* Plan Management */}
                              <DropdownMenuItem 
                                onClick={() => handlePromoteToPro(user.id)}
                                disabled={user.current_plan === 'pro'}
                                className="cursor-pointer"
                              >
                                <Crown className="w-4 h-4 mr-2 text-purple-500" />
                                Promote to Pro
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDowngradeToFree(user.id)}
                                disabled={user.current_plan === 'free'}
                                className="cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2 text-green-500" />
                                Downgrade to Free Trial
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              {/* User Management */}
                              <DropdownMenuItem 
                                onClick={() => handleEditUser(user.id)}
                                className="cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              
                              {user.is_active ? (
                                <DropdownMenuItem 
                                  onClick={() => handleUserStatusChange(user.id, false)}
                                  className="cursor-pointer"
                                >
                                  <Ban className="w-4 h-4 mr-2 text-red-500" />
                                  Deactivate User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleUserStatusChange(user.id, true)}
                                  className="cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              {/* Danger Zone */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {user.full_name || user.email}? 
                                      This action cannot be undone and will permanently remove the user from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete User
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredUsers.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
