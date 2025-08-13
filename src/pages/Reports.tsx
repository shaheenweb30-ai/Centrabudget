import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  RefreshCw,
  Sparkles,
  Brain,
  Zap,
  Crown,
  CheckCircle,
  FileText,
  Activity,
  ChartBar,
  DownloadCloud,
  FileSpreadsheet,
  CalendarDays,
  Users,
  CreditCard,
  PiggyBank,
  AlertTriangle,
  Lightbulb,
  Clock,
  Award,
  Shield,
  Plus,
  Lock
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useSettings } from "@/contexts/SettingsContext";
import UpgradePopup from "@/components/UpgradePopup";

const Reports = () => {
  const navigate = useNavigate();
  const { transactions, categories } = useTransactions();
  const { isFreePlan, limits } = useUserPlan();
  const { formatCurrency } = useSettings();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  
  const [selectedReportType, setSelectedReportType] = useState<'overview' | 'detailed' | 'custom'>('overview');
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, startDate, endDate]);

  // Calculate reports data
  const reportsData = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Generate monthly data for the last 6 months
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: monthStr,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses,
        date: date
      };
    }).reverse();

    // Generate category breakdown
    const categoryBreakdown = categories.map(category => {
      const categoryTransactions = filteredTransactions.filter(t => t.category === category.name);
      const amount = categoryTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
      
      return {
        category: category.name,
        amount: amount,
        percentage: percentage,
        color: category.color,
        icon: category.icon
      };
    }).filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Get top expenses
    const topExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(t => ({
        description: t.description || t.category,
        amount: t.amount,
        date: new Date(t.date).toLocaleDateString(),
        category: t.category
      }));

    // Calculate emergency fund status
    const monthlyExpenses = totalExpenses / 6; // Average monthly expenses
    const emergencyFundMonths = monthlyExpenses > 0 ? netBalance / monthlyExpenses : 0;
    let emergencyFundStatus: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
    if (emergencyFundMonths >= 6) emergencyFundStatus = 'excellent';
    else if (emergencyFundMonths >= 3) emergencyFundStatus = 'good';
    else if (emergencyFundMonths >= 1) emergencyFundStatus = 'fair';
    else emergencyFundStatus = 'poor';

    // Calculate budget adherence
    const categoriesWithBudgets = categories.filter(cat => cat.budget > 0);
    const budgetAdherence = categoriesWithBudgets.length > 0 
      ? categoriesWithBudgets.filter(cat => cat.spent <= cat.budget).length / categoriesWithBudgets.length * 100
      : 0;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      monthlyData,
      categoryBreakdown,
      topExpenses,
      savingsRate,
      emergencyFundStatus,
      budgetAdherence
    };
  }, [filteredTransactions, categories]);



  const getEmergencyFundColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getEmergencyFundBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-green-900/30 dark:text-slate-300';
    }
  };

  const EmptyState = ({ title, description, icon: Icon }: { title: string; description: string; icon: any }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <Button onClick={() => navigate('/transactions')} className="rounded-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Transaction
      </Button>
    </div>
  );

  // If no transactions, show empty state
  if (transactions.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <EmptyState 
              title="No Data Available"
              description="Add some transactions to see your financial reports and insights."
              icon={ChartBar}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // For free users, show blurred interface with upgrade CTA
  if (isFreePlan) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <ChartBar className="w-3 h-3 sm:w-4 sm:h-4" />
                Financial Reports
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Advanced Financial Insights
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6">
                Unlock comprehensive analysis of your spending, income, and financial health
              </p>
            </div>

            {/* Upgrade CTA Card */}
            <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm shadow-lg border border-blue-200/50 dark:border-blue-700/30 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Reports Locked
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Advanced financial reports and analytics are available exclusively to Pro users. 
                  Upgrade to unlock comprehensive insights into your financial health.
                </p>

                <div className="space-y-4">
                  <Button 
                    onClick={() => setShowUpgradePopup(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blurred Preview of Reports */}
            <div className="relative">
              {/* Blurred Content */}
              <div className="filter blur-sm pointer-events-none opacity-60">
                <div className="space-y-6 sm:space-y-8">
                  {/* Blurred Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Sample Data</CardTitle>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <ChartBar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            $0.00
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Sample data
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Blurred Charts */}
                  <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Sample Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center">
                      <div className="text-center text-slate-400">
                        <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                        <p>Chart preview</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-slate-950/80 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Upgrade Popup */}
        <UpgradePopup
          isOpen={showUpgradePopup}
          onClose={() => setShowUpgradePopup(false)}
          limitType="aiInsights"
          currentCount={0}
          maxCount={0}
        />
      </DashboardLayout>
    );
  }

  // Full reports for Pro users
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <ChartBar className="w-3 h-3 sm:w-4 sm:h-4" />
                Financial Reports
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Your Financial Insights
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Comprehensive analysis of your spending, income, and financial health</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                ← Back to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/transactions')}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Date Range Selector */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Range:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  />
                  <span className="text-slate-500 self-center">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Income</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(reportsData.totalIncome)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {filteredTransactions.filter(t => t.type === 'income').length} transactions
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Expenses</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(reportsData.totalExpenses)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {filteredTransactions.filter(t => t.type === 'expense').length} transactions
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Net Balance</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${reportsData.netBalance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(reportsData.netBalance)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {reportsData.savingsRate.toFixed(1)}% savings rate
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Emergency Fund</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {reportsData.emergencyFundStatus.charAt(0).toUpperCase() + reportsData.emergencyFundStatus.slice(1)}
                </div>
                <Badge className={`text-xs ${getEmergencyFundBadge(reportsData.emergencyFundStatus)}`}>
                  {reportsData.emergencyFundStatus}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportsData.categoryBreakdown.length === 0 ? (
                <div className="text-center py-8">
                  <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">No spending data in selected date range</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportsData.categoryBreakdown.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${category.color}20` }}>
                          {category.icon}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">{category.category}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{category.percentage.toFixed(1)}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(category.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Expenses */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                Top Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportsData.topExpenses.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">No expense data in selected date range</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reportsData.topExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-300">{expense.description}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{expense.category} • {expense.date}</p>
                        </div>
                      </div>
                      <div className="font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                6-Month Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {reportsData.monthlyData.map((month, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-slate-50/50 dark:bg-slate-700/50">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{month.month}</p>
                    <div className="space-y-1">
                      <div className="text-xs text-green-600 dark:text-green-400">
                        +{formatCurrency(month.income)}
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        -{formatCurrency(month.expenses)}
                      </div>
                      <div className={`text-sm font-bold ${month.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(month.balance)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Reports Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Now using your actual transaction data
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Reports page is now fully functional and connected to your transaction data! You can:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• View spending breakdown by category</li>
                  <li>• Track monthly income and expense trends</li>
                  <li>• See your top expenses and financial health</li>
                  <li>• Filter data by custom date ranges</li>
                  <li>• Monitor emergency fund status and savings rate</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/transactions')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Add More Transactions
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/categories-budget')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    View Categories & Budgets
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
