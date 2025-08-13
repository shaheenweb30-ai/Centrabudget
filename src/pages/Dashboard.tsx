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
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useOnboarding } from "@/hooks/useOnboarding";

const Dashboard = () => {
  const navigate = useNavigate();
  const { transactions, categories } = useTransactions();
  const { preferences, formatCurrency } = useSettings();
  const { isNewUser, shouldShowWelcome, markWelcomeShown } = useOnboarding();
  
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

  // Check if user has any data
  const hasData = transactions.length > 0 || categories.some(cat => cat.budget > 0);

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

  // Show welcome banner for new users
  if (shouldShowWelcome) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl mb-8">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  Welcome to CentraBudget! 🎉
                </h1>
                <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                  You're all set! Let's get you started with managing your finances. 
                  We'll guide you through setting up your budget categories and adding your first transactions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      markWelcomeShown();
                      navigate('/categories-budget');
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold shadow-lg"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set Up Budget Categories
                  </Button>
                  <Button
                    onClick={() => {
                      markWelcomeShown();
                      navigate('/transactions');
                    }}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Set Up Categories</h3>
                  <p className="text-sm text-gray-600">
                    Create budget categories like Food, Transport, and Entertainment
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Add Transactions</h3>
                  <p className="text-sm text-gray-600">
                    Start tracking your income and expenses
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Monitor Progress</h3>
                  <p className="text-sm text-gray-600">
                    Watch your financial health improve over time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Skip Option */}
            <div className="text-center">
              <Button
                onClick={() => markWelcomeShown()}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                Skip welcome and go to dashboard
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                {isNewUser ? "Welcome! Let's start building your financial future" : "Track your financial health at a glance"}
              </p>
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

          {/* Enhanced Empty State for New Users */}
          {!hasData && isNewUser && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Start Your Financial Journey? 🚀
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Your dashboard is ready to show your financial insights! Start by setting up your budget categories 
                  and adding your first transaction. We'll help you track your spending and achieve your financial goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/categories-budget')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set Up Categories
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => navigate('/transactions')}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                  {hasData ? formatCurrency(totalBalance) : '—'}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {hasData ? (
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-green-600 dark:text-green-400">
                      <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3" />
                      {formatCurrency(monthlyIncome - monthlyExpenses)} this {getBudgetPeriodText().toLowerCase()}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {isNewUser ? 'Set up your budget to start' : 'No data yet'}
                    </span>
                  )}
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
                  {hasData ? formatCurrency(totalIncome) : '—'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {hasData ? 'Lifetime earnings' : isNewUser ? 'Add income transactions' : 'No data yet'}
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
                  {hasData ? formatCurrency(totalExpenses) : '—'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {hasData ? 'Lifetime spending' : isNewUser ? 'Track your expenses' : 'No data yet'}
                </p>
              </CardContent>
            </Card>

            {/* Budget Progress */}
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Budget Progress</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {hasData ? `${formatCurrency(totalBudget)} / ${formatCurrency(totalSpent)}` : '—'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {hasData ? `${Math.round(budgetProgress)}% used` : isNewUser ? 'Set up your budget' : 'No budget set'}
                </p>
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
                    <Button 
                      onClick={() => navigate('/transactions')}
                      className="mt-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Transaction
                    </Button>
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
