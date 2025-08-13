import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUserRole(user: User | null) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchUserRole = async (retryCount = 0) => {
    if (!user || !isMountedRef.current) {
      setRole(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      // Check if the component is still mounted before making the request
      if (!isMountedRef.current) {
        return; // Component unmounted
      }

      const { data, error: supabaseError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .abortSignal(abortControllerRef.current.signal);

      // Check if the request was aborted after completion
      if (!isMountedRef.current) {
        return; // Component unmounted during request
      }

      if (supabaseError) {
        // Check if it's a network resource error
        if (supabaseError.message.includes('Failed to fetch') || 
            supabaseError.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
          
          console.warn(`Network resource error (attempt ${retryCount + 1}):`, supabaseError);
          
          // Retry with exponential backoff (max 3 retries)
          if (retryCount < 3) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // 1s, 2s, 4s
            
            retryTimeoutRef.current = setTimeout(() => {
              // Check if component is still mounted before retrying
              if (isMountedRef.current) {
                fetchUserRole(retryCount + 1);
              }
            }, delay);
            
            return;
          } else {
            setError('Network resource limit reached. Please try again later.');
          }
        } else if (supabaseError.message.includes('signal is aborted') || 
                   supabaseError.message.includes('AbortError')) {
          // This is an abort error from Supabase - don't treat as error
          return;
        } else {
          console.error('Error fetching user role:', supabaseError);
          setError(supabaseError.message);
        }
        
        setRole(null);
      } else {
        const roles = (data || []).map((r: any) => r.role as string);
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
        setError(null);
      }
    } catch (error) {
      // Check if the component is still mounted before handling errors
      if (!isMountedRef.current) {
        return; // Component unmounted
      }

      // Check if it's an abort error (user navigated away) - don't log these as errors
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Don't set error for aborted requests
      }
      
      // Only log and set error for actual errors, not aborts
      console.error('Error fetching user role:', error);
      setError('Failed to fetch user role. Please try again.');
      setRole(null);
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Only fetch if we have a user
    if (user) {
      fetchUserRole();
    }

    // Cleanup function
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      
      // Abort any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null; // Clear the reference
      }
      
      // Clear any pending retry timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null; // Clear the reference
      }
    };
  }, [user]);

  // Manual retry function
  const retry = () => {
    if (user && isMountedRef.current) {
      setError(null);
      fetchUserRole();
    }
  };

  return { 
    role, 
    loading, 
    error,
    retry,
    isAdmin: role === 'admin',
    isSubscriber: role === 'subscriber',
    isUser: role === 'user' || !role
  };
}