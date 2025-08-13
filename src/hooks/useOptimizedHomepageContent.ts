import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageContent {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_color: string | null;
  button_text_color: string | null;
  title_color: string | null;
  subtitle_color: string | null;
  description_color: string | null;
  image_url: string | null;
}

const HOMEPAGE_CONTENT_KEY = 'homepage-content';

export function useOptimizedHomepageContent() {
  const queryClient = useQueryClient();

  // Fetch all homepage content
  const { data: content = [], isLoading, error } = useQuery({
    queryKey: [HOMEPAGE_CONTENT_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section_id');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Optimistic update mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ sectionId, updates }: { sectionId: string; updates: Partial<HomepageContent> }) => {
      // Check if section exists
      const { data: existingData, error: checkError } = await supabase
        .from('homepage_content')
        .select('id')
        .eq('section_id', sectionId)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      if (existingData) {
        // Update existing
        const { data, error } = await supabase
          .from('homepage_content')
          .update(updates)
          .eq('section_id', sectionId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('homepage_content')
          .insert([{ section_id: sectionId, ...updates }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onMutate: async ({ sectionId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [HOMEPAGE_CONTENT_KEY] });

      // Snapshot the previous value
      const previousContent = queryClient.getQueryData([HOMEPAGE_CONTENT_KEY]);

      // Optimistically update to the new value
      queryClient.setQueryData([HOMEPAGE_CONTENT_KEY], (old: HomepageContent[] = []) => {
        const existingIndex = old.findIndex(item => item.section_id === sectionId);
        if (existingIndex >= 0) {
          return old.map(item => 
            item.section_id === sectionId ? { ...item, ...updates } : item
          );
        } else {
          return [...old, { section_id: sectionId, ...updates } as HomepageContent];
        }
      });

      // Return a context object with the snapshotted value
      return { previousContent };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousContent) {
        queryClient.setQueryData([HOMEPAGE_CONTENT_KEY], context.previousContent);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [HOMEPAGE_CONTENT_KEY] });
    },
  });

  const getContentBySection = (sectionId: string) => {
    return content.find(item => item.section_id === sectionId);
  };

  const updateContent = async (sectionId: string, updates: Partial<HomepageContent>) => {
    return updateContentMutation.mutateAsync({ sectionId, updates });
  };

  return {
    content,
    loading: isLoading,
    error,
    updateContent,
    getContentBySection,
    refetch: () => queryClient.invalidateQueries({ queryKey: [HOMEPAGE_CONTENT_KEY] }),
    isUpdating: updateContentMutation.isPending,
  };
} 