import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface BudgetWithCategory extends Budget {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export const useBudgets = (userId: string | undefined) => {
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBudgets = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBudgets(data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast({
        title: "Error",
        description: "Failed to load budgets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (categoryId: string, amount: number, period: 'weekly' | 'monthly' | 'yearly') => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          category_id: categoryId,
          amount,
          period,
          user_id: userId
        })
        .select(`
          *,
          category:categories(id, name, icon, color)
        `)
        .single();

      if (error) throw error;

      setBudgets([data, ...budgets]);
      
      toast({
        title: "Budget added",
        description: "Budget has been successfully created.",
      });

      return data;
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error",
        description: "Failed to add budget.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBudget = async (id: string, amount: number, period: 'weekly' | 'monthly' | 'yearly') => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .update({
          amount,
          period
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setBudgets(budgets.map(budget => 
        budget.id === id 
          ? { ...budget, amount, period, updated_at: new Date().toISOString() }
          : budget
      ));
      
      toast({
        title: "Budget updated",
        description: "Budget has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to update budget.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      setBudgets(budgets.filter(budget => budget.id !== id));
      
      toast({
        title: "Budget deleted",
        description: "Budget has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast({
        title: "Error",
        description: "Failed to delete budget.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getBudgetByCategory = (categoryId: string, period: 'weekly' | 'monthly' | 'yearly') => {
    return budgets.find(budget => 
      budget.category_id === categoryId && budget.period === period
    );
  };

  const getTotalBudgetAmount = (period: 'weekly' | 'monthly' | 'yearly') => {
    return budgets
      .filter(budget => budget.period === period)
      .reduce((total, budget) => total + budget.amount, 0);
  };

  // Convert budget amount between periods
  const convertBudgetAmount = (amount: number, fromPeriod: 'weekly' | 'monthly' | 'yearly', toPeriod: 'weekly' | 'monthly' | 'yearly') => {
    if (fromPeriod === toPeriod) return amount;
    
    // Convert to monthly first (base unit)
    let monthlyAmount = amount;
    if (fromPeriod === 'weekly') {
      monthlyAmount = amount * 4; // 4 weeks per month
    } else if (fromPeriod === 'yearly') {
      monthlyAmount = amount / 12; // 12 months per year
    }
    
    // Convert from monthly to target period
    if (toPeriod === 'weekly') {
      return monthlyAmount / 4; // 4 weeks per month
    } else if (toPeriod === 'yearly') {
      return monthlyAmount * 12; // 12 months per year
    }
    
    return monthlyAmount; // monthly
  };

  // Get converted budget amounts for a specific period
  const getConvertedBudgets = (targetPeriod: 'weekly' | 'monthly' | 'yearly') => {
    return budgets.map(budget => ({
      ...budget,
      convertedAmount: convertBudgetAmount(budget.amount, budget.period, targetPeriod),
      originalAmount: budget.amount,
      originalPeriod: budget.period
    }));
  };

  // Get total converted budget amount for a specific period
  const getTotalConvertedBudgetAmount = (targetPeriod: 'weekly' | 'monthly' | 'yearly') => {
    return budgets.reduce((total, budget) => {
      const convertedAmount = convertBudgetAmount(budget.amount, budget.period, targetPeriod);
      return total + convertedAmount;
    }, 0);
  };

  useEffect(() => {
    fetchBudgets();
  }, [userId]);

  return {
    budgets,
    loading,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
    getTotalBudgetAmount,
    convertBudgetAmount,
    getConvertedBudgets,
    getTotalConvertedBudgetAmount
  };
};
