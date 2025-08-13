import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PackageDescription {
  id: string;
  plan_id: string;
  description: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

interface PackageDescriptionsContextType {
  descriptions: PackageDescription[];
  isLoading: boolean;
  error: string | null;
  updateDescription: (planId: string, description: string, isEnabled: boolean) => Promise<void>;
  toggleDescription: (planId: string, isEnabled: boolean) => Promise<void>;
  refreshDescriptions: () => Promise<void>;
  getDescriptionByPlanId: (planId: string) => PackageDescription | undefined;
}

const PackageDescriptionsContext = createContext<PackageDescriptionsContextType | undefined>(undefined);

export const usePackageDescriptions = () => {
  const context = useContext(PackageDescriptionsContext);
  if (context === undefined) {
    throw new Error('usePackageDescriptions must be used within a PackageDescriptionsProvider');
  }
  return context;
};

interface PackageDescriptionsProviderProps {
  children: ReactNode;
}

export const PackageDescriptionsProvider: React.FC<PackageDescriptionsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [descriptions, setDescriptions] = useState<PackageDescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDescriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('package_descriptions')
        .select('*')
        .order('plan_id');

      if (fetchError) {
        console.error('Error fetching package descriptions:', fetchError);
        setError('Failed to fetch package descriptions');
        return;
      }

      setDescriptions(data || []);
    } catch (err) {
      console.error('Error fetching package descriptions:', err);
      setError('Failed to fetch package descriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDescription = async (planId: string, description: string, isEnabled: boolean) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: updateError } = await supabase
        .from('package_descriptions')
        .update({
          description: description.trim(),
          is_enabled: isEnabled,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('plan_id', planId);

      if (updateError) {
        console.error('Error updating package description:', updateError);
        throw updateError;
      }

      // Update local state
      await refreshDescriptions();
    } catch (err) {
      console.error('Error updating package description:', err);
      throw err;
    }
  };

  const toggleDescription = async (planId: string, isEnabled: boolean) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: toggleError } = await supabase
        .from('package_descriptions')
        .update({
          is_enabled: isEnabled,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('plan_id', planId);

      if (toggleError) {
        console.error('Error toggling package description:', toggleError);
        throw toggleError;
      }

      // Update local state
      await refreshDescriptions();
    } catch (err) {
      console.error('Error toggling package description:', err);
      throw err;
    }
  };

  const refreshDescriptions = async () => {
    await fetchDescriptions();
  };

  const getDescriptionByPlanId = (planId: string): PackageDescription | undefined => {
    return descriptions.find(desc => desc.plan_id === planId);
  };

  useEffect(() => {
    fetchDescriptions();
  }, []);

  const value: PackageDescriptionsContextType = {
    descriptions,
    isLoading,
    error,
    updateDescription,
    toggleDescription,
    refreshDescriptions,
    getDescriptionByPlanId
  };

  return (
    <PackageDescriptionsContext.Provider value={value}>
      {children}
    </PackageDescriptionsContext.Provider>
  );
};
