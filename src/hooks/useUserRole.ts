import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Start with false

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      setLoading(true); // Only set loading when we actually have a user to fetch for
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          const roles = (data || []).map(r => r.role as string);
          const resolvedRole = roles.includes('admin')
            ? 'admin'
            : roles.includes('moderator')
            ? 'moderator'
            : roles.includes('subscriber')
            ? 'subscriber'
            : roles.includes('user')
            ? 'user'
            : null;
          setRole(resolvedRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user]);

  return { 
    role, 
    loading, 
    isAdmin: role === 'admin',
    isSubscriber: role === 'subscriber',
    isUser: role === 'user' || !role
  };
}