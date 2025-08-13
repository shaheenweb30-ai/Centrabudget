import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BrandingSettings {
  id: string;
  business_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  font_family: string | null;
  font_weights: string | null;
  typography_settings: any | null;
  created_at: string;
  updated_at: string;
}

interface BrandingContextType {
  settings: BrandingSettings | null;
  loading: boolean;
  updateSettings: (updates: Partial<BrandingSettings>) => Promise<BrandingSettings | undefined>;
  uploadLogo: (file: File) => Promise<string>;
  refetch: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBrandingSettings = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBrandingSettings must be used within a BrandingProvider');
  }
  return context;
};

interface BrandingProviderProps {
  children: ReactNode;
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching branding settings:', error);
        
        // If it's a 406 error (RLS issue), provide default settings
        if (error.code === '406') {
          console.log('RLS error detected, using default branding settings');
          setSettings({
            id: 'default',
            business_name: 'CentraBudget',
            logo_url: null,
            favicon_url: null,
            primary_color: '#1752F3',
            secondary_color: '#F0F0F0',
            accent_color: '#4A90E2',
            font_family: 'GT Walsheim Pro',
            font_weights: '["300", "400", "500", "600", "700"]',
            typography_settings: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          return;
        }
        
        // For other errors, still set loading to false
        setSettings(null);
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<BrandingSettings>) => {
    try {
      if (!settings) return;

      const { data, error } = await supabase
        .from('branding_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating branding settings:', error);
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      await updateSettings({ logo_url: publicUrl });
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  return (
    <BrandingContext.Provider value={{ 
      settings, 
      loading, 
      updateSettings, 
      uploadLogo, 
      refetch: fetchSettings 
    }}>
      {children}
    </BrandingContext.Provider>
  );
}