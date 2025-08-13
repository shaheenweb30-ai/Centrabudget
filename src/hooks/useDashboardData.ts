import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted_amount: number;
  spent_amount: number;
  progress_percentage: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  category_name?: string;
}

interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalSpending: number;
  budgetCategories: BudgetCategory[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (user: User | null, dateRange: string) => {
  const [data, setData] = useState<DashboardData>({
    totalBalance: 0,
    totalIncome: 0,
    totalSpending: 0,
    budgetCategories: [],
    loading: false,
    error: null,
  });

  const fetchData = async () => {
    if (!user) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Get date range for current period
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case "weekly":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "yearly":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Fetch transactions for the period
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          id,
          description,
          amount,
          transaction_date,
          budget_categories(name)
        `)
        .eq('user_id', user.id)
        .gte('transaction_date', startDate.toISOString().split('T')[0])
        .lte('transaction_date', now.toISOString().split('T')[0]);

      if (transactionsError) throw transactionsError;

      // Calculate totals
      let income = 0;
      let spending = 0;

      transactions?.forEach(transaction => {
        if (transaction.amount > 0) {
          income += transaction.amount;
        } else {
          spending += Math.abs(transaction.amount);
        }
      });

      // Fetch budget categories with spending data
      const { data: categories, error: categoriesError } = await supabase
        .from('budget_categories')
        .select('id, name, budgeted_amount')
        .eq('user_id', user.id);

      if (categoriesError) throw categoriesError;

      // Calculate spending per category
      const categoriesWithSpending = categories?.map(category => {
        const categoryTransactions = transactions?.filter(t => 
          t.budget_categories?.name === category.name
        ) || [];

        const spentAmount = categoryTransactions.reduce((sum, t) => 
          sum + Math.abs(Math.min(0, t.amount)), 0
        );

        const progressPercentage = category.budgeted_amount > 0 
          ? Math.min((spentAmount / category.budgeted_amount) * 100, 100)
          : 0;

        return {
          id: category.id,
          name: category.name,
          budgeted_amount: category.budgeted_amount,
          spent_amount: spentAmount,
          progress_percentage: progressPercentage
        };
      }) || [];

      setData({
        totalBalance: income - spending,
        totalIncome: income,
        totalSpending: spending,
        budgetCategories: categoriesWithSpending,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, dateRange]);

  return {
    ...data,
    refetch: fetchData,
  };
}; 