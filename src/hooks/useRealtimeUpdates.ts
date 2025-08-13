import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    
    return () => {};
  }, [queryClient]);
} 