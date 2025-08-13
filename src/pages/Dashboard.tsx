import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3,
  Plus,
  Target,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Lightbulb,
  Zap
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";
import { useSettings } from "@/contexts/SettingsContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, categories } = useTransactions();
  const { preferences, formatCurrency } = useSettings();
  
  // Calculate financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalBalance = totalIncome - totalExpenses;
  
  // Calculate monthly metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate budget metrics
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Get budget period display text
  const getBudgetPeriodText = () => {
    const period = preferences?.budgetPeriod || 'monthly';
    switch (period) {
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };
  
  // Get top spending categories
  const topCategories = categories
    .filter(cat => cat.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);
  

  
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                Dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Financial Dashboard
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Track your financial health at a glance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button 
                onClick={() => navigate('/categories-budget')}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Categories & Budget
              </Button>
              <Button 
                onClick={() => navigate('/transactions')}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Top Hero Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {/* Total Balance */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Balance</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalBalance)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                    {formatCurrency(monthlyIncome - monthlyExpenses)} this {getBudgetPeriodText().toLowerCase()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Income */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Income</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpenses)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Lifetime spending
                </p>
              </CardContent>
            </Card>

            {/* Budget Summary */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{getBudgetPeriodText()} Budget</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(totalBudget)} / {formatCurrency(totalSpent)}
                </div>
                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${budgetProgress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {budgetProgress.toFixed(0)}% of budget spent
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Spending Categories & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Spending Categories */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Top Spending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topCategories.length > 0 ? (
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg">
                            {category.icon}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {category.name}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {category.transactionCount} transactions
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatCurrency(category.spent)}
                          </div>
                          {category.budget > 0 && (
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              of {formatCurrency(category.budget)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No spending data yet</p>
                    <p className="text-sm">Add transactions to see your spending patterns</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 dark:text-slate-200">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          transaction.type === 'income' 
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                    {transactions.length > 5 && (
                      <div className="text-center pt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/transactions')}
                          className="rounded-full"
                        >
                          View All Transactions
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions yet</p>
                    <p className="text-sm">Add your first transaction to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
