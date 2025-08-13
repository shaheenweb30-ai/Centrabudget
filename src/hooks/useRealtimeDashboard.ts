import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category_id: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Category {
  id: string;
  name: string;
  budgeted_amount: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period: string;
  created_at: string;
  updated_at: string;
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  totalSavings: number;
  monthlyNetChange: number;
  monthlyBudgetTotal: number;
  monthlyBudgetSpent: number;
  aiInsightCount: number;

    id: string;
    name: string;
    amount: number;
    status: 'Active' | 'Recent';
    color: string;
  }>;
  fixedCostsTotal: number;
  categoryBudgets: Array<{
    category: Category;
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
  totalTransactions: number;
  periodTransactions: number;
  periodIncome: number;
  periodExpenses: number;
  averageTransactionAmount: number;
  transactionFrequency: string;
}

export const useRealtimeDashboard = (startDate?: string, endDate?: string) => {
  const { user } = useAuth();
  const { preferences } = useSettings();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    totalSavings: 0,
    monthlyNetChange: 0,
    monthlyBudgetTotal: 0,
    monthlyBudgetSpent: 0,
    aiInsightCount: 0,

    fixedCostsTotal: 0,
    categoryBudgets: [],
    recentTransactions: [],
    totalTransactions: 0,
    periodTransactions: 0,
    periodIncome: 0,
    periodExpenses: 0,
    averageTransactionAmount: 0,
    transactionFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(true);

  const selectedPeriod: 'weekly' | 'monthly' | 'yearly' = (preferences.budgetPeriod as 'weekly' | 'monthly' | 'yearly') || 'monthly';

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const now = new Date();

      // Use custom date range if provided, otherwise use period-based range
      let periodStart: Date, periodEnd: Date;
      
      if (startDate && endDate) {
        // Use custom date range
        periodStart = new Date(startDate);
        periodEnd = new Date(endDate);
        periodEnd.setHours(23, 59, 59, 999); // Set to end of day
      } else {
        // Determine period range based on selected timeline
        const getPeriodRange = (date: Date, period: 'weekly' | 'monthly' | 'yearly') => {
          if (period === 'yearly') {
            const start = new Date(date.getFullYear(), 0, 1);
            const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
            return { start, end };
          }
          if (period === 'weekly') {
            // Get the start of the week (Monday)
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
            const start = new Date(date.getFullYear(), date.getMonth(), diff);
            const end = new Date(date.getFullYear(), date.getMonth(), diff + 6, 23, 59, 59, 999);
            return { start, end };
          }
          const start = new Date(date.getFullYear(), date.getMonth(), 1);
          const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
          return { start, end };
        };

        const range = getPeriodRange(now, selectedPeriod);
        periodStart = range.start;
        periodEnd = range.end;
      }

      const isInPeriod = (dateStr: string) => {
        const d = new Date(dateStr);
        return d >= periodStart && d <= periodEnd;
      };

      const scaleAmount = (
        amount: number,
        from: string | null | undefined,
        to: 'weekly' | 'monthly' | 'yearly'
      ) => {
        const f = (from || 'monthly').toLowerCase();
        
        // Handle weekly/monthly/yearly periods (from useBudgets)
        if (f === 'weekly' || f === 'monthly' || f === 'yearly') {
          if (f === to) return amount;
          
          // Convert to monthly first (base unit)
          let monthlyAmount = amount;
          if (f === 'weekly') {
            monthlyAmount = amount * 4; // 4 weeks per month
          } else if (f === 'yearly') {
            monthlyAmount = amount / 12; // 12 months per year
          }
          
          // Convert from monthly to target period
          if (to === 'weekly') {
            return monthlyAmount / 4; // 4 weeks per month
          } else if (to === 'yearly') {
            return monthlyAmount * 12; // 12 months per year
          }
          
          return monthlyAmount; // monthly
        }
        
        // Handle period scaling
        const map: Record<string, number> = { monthly: 1, yearly: 12 };
        const fromFactor = map[f] ?? 1;
        const toFactor = map[to] ?? 1;
        return amount * (toFactor / fromFactor);
      };

      // Fetch transactions
      let transactions: Transaction[] = [];
      try {
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (transactionsError) {
          console.warn('Dashboard: Error fetching transactions:', transactionsError);
        } else {
          transactions = transactionsData || [];
        }
      } catch (error) {
        console.warn('Dashboard: Failed to fetch transactions:', error);
      }

      // Fetch budget categories (this replaces the old categories table)
      let budgetCategories: Category[] = [];
      try {
        const { data: budgetCategoriesData, error: budgetCategoriesError } = await supabase
          .from('budget_categories')
          .select('*')
          .eq('user_id', user?.id);

        if (budgetCategoriesError) {
          console.warn('Dashboard: Error fetching budget categories:', budgetCategoriesError);
          // Fallback: try to fetch from old categories table
          try {
            const { data: oldCategoriesData, error: oldCategoriesError } = await supabase
              .from('categories')
              .select('*')
              .eq('user_id', user?.id);
            
            if (!oldCategoriesError && oldCategoriesData) {
              budgetCategories = oldCategoriesData.map(cat => ({
                ...cat,
                budgeted_amount: 0 // Default budget amount for old categories
              }));
            }
          } catch (fallbackError) {
            console.warn('Dashboard: Fallback categories also failed:', fallbackError);
          }
        } else {
          budgetCategories = budgetCategoriesData || [];
        }
      } catch (error) {
        console.warn('Dashboard: Failed to fetch budget categories:', error);
      }

      // No separate budgets table - budget information is in budget_categories
      const budgets = budgetCategories?.map(cat => ({
        id: cat.id,
        user_id: cat.user_id,
        category_id: cat.id,
        amount: cat.budgeted_amount || 0,
        period: 'monthly', // Default to monthly since the schema doesn't specify
        created_at: cat.created_at,
        updated_at: cat.updated_at
      })) || [];
      
      // Calculate totals
      const totalIncome = transactions
        ?.filter(t => t.amount > 0)
        ?.reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses = transactions
        ?.filter(t => t.amount < 0)
        ?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

      const totalBalance = totalIncome - totalExpenses;
      const totalSavings = totalBalance;
      
      // Period net change
      const monthlyIncome = transactions?.filter(t => t.amount > 0 && isInPeriod(t.transaction_date))
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      const monthlyExpenses = transactions?.filter(t => t.amount < 0 && isInPeriod(t.transaction_date))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      const monthlyNetChange = monthlyIncome - monthlyExpenses;
      
      // Calculate transaction metrics
      const totalTransactions = transactions?.length || 0;
      const periodTransactions = transactions?.filter(t => isInPeriod(t.transaction_date)).length || 0;
      const periodIncome = monthlyIncome;
      const periodExpenses = monthlyExpenses;
      
      const averageTransactionAmount = totalTransactions > 0 
        ? (totalIncome + totalExpenses) / totalTransactions 
        : 0;

      // Determine transaction frequency
      const getTransactionFrequency = (count: number, period: string) => {
        if (period === 'monthly') {
          if (count >= 30) return 'Daily';
          if (count >= 15) return 'Bi-weekly';
          if (count >= 8) return 'Weekly';
          if (count >= 4) return 'Bi-weekly';
          return 'Monthly';

        } else {
          if (count >= 365) return 'Daily';
          if (count >= 180) return 'Bi-weekly';
          if (count >= 52) return 'Weekly';
          if (count >= 24) return 'Bi-weekly';
          return 'Monthly';
        }
      };
      
      const transactionFrequency = getTransactionFrequency(periodTransactions, selectedPeriod);

      // Calculate category budgets
      const categoryBudgets = budgets?.map(budget => {
        try {
          const category = budgetCategories?.find(c => c.id === budget.category_id);
          const categoryTransactions = transactions?.filter(t => 
            t.category_id === budget.category_id && 
            t.amount < 0 &&
            isInPeriod(t.transaction_date)
          ) || [];
          
          const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
          const remaining = Math.max(0, (budget.amount || 0) - spent);
          const percentage = budget.amount && budget.amount > 0 
            ? Math.min((spent / budget.amount) * 100, 100) 
            : 0;

          return {
            category: category || { id: '', name: 'Unknown', budgeted_amount: 0, user_id: '', created_at: '', updated_at: '' },
            budget,
            spent,
            remaining,
            percentage
          };
        } catch (error) {
          console.warn('Dashboard: Error calculating category budget:', error);
          return {
            category: { id: '', name: 'Error', budgeted_amount: 0, user_id: '', created_at: '', updated_at: '' },
            budget,
            spent: 0,
            remaining: budget.amount || 0,
            percentage: 0
          };
        }
      }) || [];

      // Budget summary scaled to selected period
      const monthlyBudgetTotal = budgets?.reduce((sum, b) => sum + scaleAmount(b.amount || 0, (b as Budget).period, selectedPeriod), 0) || 0;
      const monthlyBudgetSpent = transactions?.filter(t => t.amount < 0 && isInPeriod(t.transaction_date))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

      // Simple AI insight count heuristic: risky categories >= 75% used
      const aiInsightCount = categoryBudgets.filter(cb => cb.percentage >= 75).length || 0;



      let fixedCostsTotal = 0;
      try {
        const fixedCostsTotalMonthly = (preferences.fixedCosts || []).reduce((s, i) => s + (i.amount || 0), 0);
        const periodFactor = selectedPeriod === 'monthly' ? 1 : selectedPeriod === 'yearly' ? 12 : 4;
        fixedCostsTotal = fixedCostsTotalMonthly * periodFactor;
      } catch (error) {
        console.warn('Dashboard: Error calculating fixed costs:', error);
      }

      const finalData = {
        totalIncome,
        totalExpenses,
        totalBalance,
        totalSavings,
        monthlyNetChange,
        monthlyBudgetTotal,
        monthlyBudgetSpent,
        aiInsightCount,

        fixedCostsTotal,
        categoryBudgets,
        recentTransactions: transactions?.slice(0, 5) || [],
        totalTransactions,
        periodTransactions,
        periodIncome,
        periodExpenses,
        averageTransactionAmount,
        transactionFrequency
      };
      
      setDashboardData(finalData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedPeriod, preferences.fixedCosts, startDate, endDate]);

  
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchDashboardData();

    
    const channel = supabase
      .channel('dashboard-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch data when transactions change
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchDashboardData]);

  return {
    dashboardData,
    loading,
    refetch: fetchDashboardData
  };
};
