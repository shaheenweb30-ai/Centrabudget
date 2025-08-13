import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeUpdates() {
  console.log('useRealtimeUpdates: Hook called - DISABLED FOR TESTING');
  const queryClient = useQueryClient();
  console.log('useRealtimeUpdates: QueryClient obtained:', !!queryClient);

  useEffect(() => {
    
    return () => {};
  }, [queryClient]);
} 