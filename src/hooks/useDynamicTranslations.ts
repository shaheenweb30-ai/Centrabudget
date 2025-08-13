import { useTranslation } from 'react-i18next';
import { useOptimizedHomepageContent } from './useOptimizedHomepageContent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TranslationContent {
  id: string;
  language: string;
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

const TRANSLATIONS_KEY = 'translations';

export function useDynamicTranslations() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const queryClient = useQueryClient();

  // Fetch translations for current language
  const { data: translations = [], isLoading, error } = useQuery({
    queryKey: [TRANSLATIONS_KEY, currentLanguage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .eq('language', currentLanguage)
        .order('section_id');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update translation mutation
  const updateTranslationMutation = useMutation({
    mutationFn: async ({ 
      sectionId, 
      language, 
      updates 
    }: { 
      sectionId: string; 
      language: string; 
      updates: Partial<TranslationContent> 
    }) => {
      // Check if translation exists
      const { data: existingData, error: checkError } = await supabase
        .from('translations')
        .select('id')
        .eq('section_id', sectionId)
        .eq('language', language)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      if (existingData) {
        // Update existing translation
        const { data, error } = await supabase
          .from('translations')
          .update(updates)
          .eq('section_id', sectionId)
          .eq('language', language)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new translation
        const { data, error } = await supabase
          .from('translations')
          .insert([{ 
            section_id: sectionId, 
            language, 
            ...updates 
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onMutate: async ({ sectionId, language, updates }) => {
      await queryClient.cancelQueries({ queryKey: [TRANSLATIONS_KEY, language] });

      const previousTranslations = queryClient.getQueryData([TRANSLATIONS_KEY, language]);

      queryClient.setQueryData([TRANSLATIONS_KEY, language], (old: TranslationContent[] = []) => {
        const existingIndex = old.findIndex(item => 
          item.section_id === sectionId && item.language === language
        );
        if (existingIndex >= 0) {
          return old.map(item => 
            item.section_id === sectionId && item.language === language 
              ? { ...item, ...updates } 
              : item
          );
        } else {
          return [...old, { section_id: sectionId, language, ...updates } as TranslationContent];
        }
      });

      return { previousTranslations };
    },
    onError: (err, variables, context) => {
      if (context?.previousTranslations) {
        queryClient.setQueryData([TRANSLATIONS_KEY, variables.language], context.previousTranslations);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: [TRANSLATIONS_KEY, variables.language] });
    },
  });

  // Get translation for a specific section
  const getTranslationBySection = (sectionId: string) => {
    return translations.find(t => t.section_id === sectionId);
  };

  // Update translation for a section
  const updateTranslation = async (
    sectionId: string, 
    updates: Partial<TranslationContent>
  ) => {
    return updateTranslationMutation.mutateAsync({
      sectionId,
      language: currentLanguage,
      updates
    });
  };

  // Get fallback content (from static translations or default)
  const getFallbackContent = (sectionId: string, field: string) => {
    const translationKey = `home.${sectionId}.${field}`;
    return t(translationKey);
  };

  // Get content with fallback
  const getContentWithFallback = (sectionId: string, field: string) => {
    const translation = getTranslationBySection(sectionId);
    if (translation && translation[field as keyof TranslationContent]) {
      return translation[field as keyof TranslationContent];
    }
    return getFallbackContent(sectionId, field);
  };

  return {
    translations,
    isLoading,
    error,
    getTranslationBySection,
    updateTranslation,
    getContentWithFallback,
    currentLanguage,
    updateTranslationMutation
  };
} 