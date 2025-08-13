import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PlanFeature {
  id: string;
  plan_id: string;
  feature_text: string;
  display_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

interface PlanFeaturesContextType {
  features: PlanFeature[];
  isLoading: boolean;
  error: string | null;
  getFeaturesByPlanId: (planId: string) => PlanFeature[];
  updateFeature: (featureId: string, updates: Partial<PlanFeature>) => Promise<void>;
  addFeature: (planId: string, featureText: string, displayOrder: number) => Promise<void>;
  deleteFeature: (featureId: string) => Promise<void>;
  toggleFeature: (featureId: string, isEnabled: boolean) => Promise<void>;
  reorderFeatures: (planId: string, featureIds: string[]) => Promise<void>;
  refreshFeatures: () => Promise<void>;
}

const PlanFeaturesContext = createContext<PlanFeaturesContextType | undefined>(undefined);

export const usePlanFeatures = () => {
  const context = useContext(PlanFeaturesContext);
  if (context === undefined) {
    throw new Error('usePlanFeatures must be used within a PlanFeaturesProvider');
  }
  return context;
};

interface PlanFeaturesProviderProps {
  children: ReactNode;
}

export const PlanFeaturesProvider: React.FC<PlanFeaturesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<PlanFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('plan_features')
        .select('*')
        .order('plan_id')
        .order('display_order');

      if (fetchError) {
        console.error('Error fetching plan features:', fetchError);
        setError('Failed to fetch plan features');
        return;
      }

      setFeatures(data || []);
    } catch (err) {
      console.error('Error fetching plan features:', err);
      setError('Failed to fetch plan features');
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturesByPlanId = (planId: string): PlanFeature[] => {
    return features
      .filter(feature => feature.plan_id === planId && feature.is_enabled)
      .sort((a, b) => a.display_order - b.display_order);
  };

  const updateFeature = async (featureId: string, updates: Partial<PlanFeature>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: updateError } = await supabase
        .from('plan_features')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', featureId);

      if (updateError) {
        console.error('Error updating plan feature:', updateError);
        throw updateError;
      }

      await refreshFeatures();
    } catch (err) {
      console.error('Error updating plan feature:', err);
      throw err;
    }
  };

  const addFeature = async (planId: string, featureText: string, displayOrder: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: insertError } = await supabase
        .from('plan_features')
        .insert({
          plan_id: planId,
          feature_text: featureText.trim(),
          display_order: displayOrder,
          is_enabled: true,
          updated_by: user.id
        });

      if (insertError) {
        console.error('Error adding plan feature:', insertError);
        throw insertError;
      }

      await refreshFeatures();
    } catch (err) {
      console.error('Error adding plan feature:', err);
      throw err;
    }
  };

  const deleteFeature = async (featureId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: deleteError } = await supabase
        .from('plan_features')
        .delete()
        .eq('id', featureId);

      if (deleteError) {
        console.error('Error deleting plan feature:', deleteError);
        throw deleteError;
      }

      await refreshFeatures();
    } catch (err) {
      console.error('Error deleting plan feature:', err);
      throw err;
    }
  };

  const toggleFeature = async (featureId: string, isEnabled: boolean) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error: toggleError } = await supabase
        .from('plan_features')
        .update({
          is_enabled: isEnabled,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('id', featureId);

      if (toggleError) {
        console.error('Error toggling plan feature:', toggleError);
        throw toggleError;
      }

      await refreshFeatures();
    } catch (err) {
      console.error('Error toggling plan feature:', err);
      throw err;
    }
  };

  const reorderFeatures = async (planId: string, featureIds: string[]) => {
    if (!user) throw new Error('User not authenticated');

    try {
      // Update display order for each feature
      const updates = featureIds.map((featureId, index) => ({
        id: featureId,
        display_order: index + 1
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('plan_features')
          .update({
            display_order: update.display_order,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('id', update.id);

        if (updateError) {
          console.error('Error reordering plan features:', updateError);
          throw updateError;
        }
      }

      await refreshFeatures();
    } catch (err) {
      console.error('Error reordering plan features:', err);
      throw err;
    }
  };

  const refreshFeatures = async () => {
    await fetchFeatures();
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const value: PlanFeaturesContextType = {
    features,
    isLoading,
    error,
    getFeaturesByPlanId,
    updateFeature,
    addFeature,
    deleteFeature,
    toggleFeature,
    reorderFeatures,
    refreshFeatures
  };

  return (
    <PlanFeaturesContext.Provider value={value}>
      {children}
    </PlanFeaturesContext.Provider>
  );
};
