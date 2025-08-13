import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  PieChart,
  DollarSign,
  Target,
  Plus,
  Edit,
  Eye,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  is_default: boolean;
}

interface Budget {
  id: string;
  category_id: string;
  amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category_id: string;
  transaction_date: string;
  categories?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface CategorySummary {
  category: Category;
  budget?: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on-track' | 'warning' | 'overspent';
  transactions: Transaction[];
}

interface BudgetForm {
  category_id: string;
  amount: string;
  period: 'monthly' | 'yearly';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C80'];

const Summary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<BudgetForm>({
    category_id: '',
    amount: '',
    period: 'monthly'
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${user?.id},is_default.eq.true`)
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user?.id);

      if (budgetsError) throw budgetsError;
      setBudgets(budgetsData || []);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            color,
            icon
          )
        `)
        .eq('user_id', user?.id)
        .eq('type', 'expense');

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

      // Calculate summaries
      calculateCategorySummaries(categoriesData || [], budgetsData || [], transactionsData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load summary data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCategorySummaries = (categories: Category[], budgets: Budget[], transactions: Transaction[]) => {
    const summaries: CategorySummary[] = categories.map(category => {
      const budget = budgets.find(b => b.category_id === category.id);
      const categoryTransactions = transactions.filter(t => t.category_id === category.id);
      const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const remaining = budget ? budget.amount - spent : 0;
      const percentage = budget ? Math.min((spent / budget.amount) * 100, 100) : 0;

      let status: 'on-track' | 'warning' | 'overspent' = 'on-track';
      if (percentage >= 90) status = 'overspent';
      else if (percentage >= 75) status = 'warning';

      return {
        category,
        budget,
        spent,
        remaining,
        percentage,
        status,
        transactions: categoryTransactions
      };
    });

    setCategorySummaries(summaries);
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_id || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const budgetData = {
        user_id: user?.id,
        category_id: formData.category_id,
        amount: parseFloat(formData.amount),
        period: formData.period,
        start_date: new Date().toISOString().split('T')[0]
      };

      if (editingBudget) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update(budgetData)
          .eq('id', editingBudget.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Budget updated successfully"
        });
      } else {
        // Create new budget
        const { error } = await supabase
          .from('budgets')
          .insert([budgetData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Budget created successfully"
        });
      }

      // Reset form and close dialog
      resetForm();
      setIsBudgetDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      amount: '',
      period: 'monthly'
    });
    setEditingBudget(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overspent':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-600';
      case 'overspent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Prepare data for pie chart
  const pieChartData = categorySummaries
    .filter(summary => summary.spent > 0)
    .map(summary => ({
      name: summary.category.name,
      value: summary.spent,
      color: summary.category.color
    }));

  // Calculate insights
  const totalBudgeted = categorySummaries.reduce((sum, summary) => sum + (summary.budget?.amount || 0), 0);
  const totalSpent = categorySummaries.reduce((sum, summary) => sum + summary.spent, 0);
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  
  const topSpendingCategory = categorySummaries
    .filter(summary => summary.spent > 0)
    .sort((a, b) => b.spent - a.spent)[0];

  const overspentCategories = categorySummaries.filter(summary => summary.status === 'overspent');
  const onTrackCategories = categorySummaries.filter(summary => summary.status === 'on-track');

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Budget Summary</h1>
              <p className="text-muted-foreground">Track your spending against budgets</p>
            </div>
            <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsBudgetDialogOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label>Budget Amount *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Period */}
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select value={formData.period} onValueChange={(value: 'monthly' | 'yearly') => setFormData(prev => ({ ...prev, period: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsBudgetDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingBudget ? 'Update' : 'Add'} Budget
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBudgeted.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  {overallPercentage.toFixed(1)}% of budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Track</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">{onTrackCategories.length}</div>
                <p className="text-xs text-muted-foreground">
                  Categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overspent</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overspentCategories.length}</div>
                <p className="text-xs text-muted-foreground">
                  Categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topSpendingCategory && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: topSpendingCategory.category.color }}
                      />
                      <div>
                        <p className="font-medium">Top Spending Category</p>
                        <p className="text-sm text-muted-foreground">{topSpendingCategory.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${topSpendingCategory.spent.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {topSpendingCategory.budget ? `${topSpendingCategory.percentage.toFixed(1)}%` : 'No budget'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Overall Performance</p>
                      <p className="text-sm text-muted-foreground">
                        {overallPercentage <= 100 ? 'On track' : 'Overspending'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${overallPercentage <= 100 ? 'text-green-700' : 'text-red-600'}`}>
                      {overallPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">of total budget</p>
                  </div>
                </div>

                {overspentCategories.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Overspent Categories</p>
                        <p className="text-sm text-red-600">{overspentCategories.length} need attention</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No spending data to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySummaries.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No categories with budgets yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsBudgetDialogOpen(true)}
                  >
                    Set up your first budget
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {categorySummaries.map((summary) => (
                    <div key={summary.category.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: summary.category.color }}
                          />
                          <div>
                            <h3 className="font-medium">{summary.category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {summary.budget ? `${summary.budget.period} budget` : 'No budget set'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(summary.status)}
                          <span className={`text-sm font-medium ${getStatusColor(summary.status)}`}>
                            {summary.status === 'on-track' ? 'On Track' : 
                             summary.status === 'warning' ? 'Warning' : 'Overspent'}
                          </span>
                        </div>
                      </div>

                      {summary.budget && (
                        <>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Budget: ${summary.budget.amount.toFixed(2)}</span>
                            <span>Spent: ${summary.spent.toFixed(2)}</span>
                          </div>
                          <Progress 
                            value={summary.percentage} 
                            className="h-2 mb-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{summary.percentage.toFixed(1)}% used</span>
                            <span>${summary.remaining.toFixed(2)} remaining</span>
                          </div>
                        </>
                      )}

                      {!summary.budget && summary.spent > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Spent: ${summary.spent.toFixed(2)} (no budget set)
                        </div>
                      )}

                      <div className="flex justify-end mt-3 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingBudget(summary.budget || null);
                            setFormData({
                              category_id: summary.category.id,
                              amount: summary.budget?.amount.toString() || '',
                              period: summary.budget?.period || 'monthly'
                            });
                            setIsBudgetDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {summary.budget ? 'Edit' : 'Set'} Budget
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Summary;
