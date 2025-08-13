import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  BarChart3,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Crown,
  Sparkles
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useSettings } from "@/contexts/SettingsContext";
import UpgradePopup from "@/components/UpgradePopup";

const categoryOptions = [
  'Salary', 'Freelance', 'Investment', 'Other Income',
  'Groceries', 'Dining', 'Shopping', 'Transportation', 
  'Entertainment', 'Healthcare', 'Utilities', 'Rent', 'Other'
];

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const { isFreePlan, limits } = useUserPlan();
  const { formatCurrency } = useSettings();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Add state for tracking which limit was reached
  const [limitType, setLimitType] = useState<'transactions' | 'categories'>('transactions');
  
  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Add state for custom category input
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Check if user has reached transaction limit
  const hasReachedLimit = isFreePlan && limits.maxTransactions && transactions.length >= limits.maxTransactions;
  const remainingTransactions = (limits.maxTransactions || 10) - transactions.length;

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = totalIncome - totalExpenses;

  // Get all unique categories from transactions (including custom ones)
  const allCategories = Array.from(new Set([
    ...categoryOptions,
    ...transactions.map(t => t.category)
  ])).sort();

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAddTransaction = () => {
    // Check if user has reached the transaction limit
    if (hasReachedLimit) {
      setLimitType('transactions');
      setShowUpgradePopup(true);
      return;
    }

    // Use custom category if provided, otherwise use selected category
    const finalCategory = showCustomCategory && customCategory.trim() ? customCategory.trim() : newTransaction.category;
    
    if (!newTransaction.amount || !finalCategory) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if this is a new category and if it would exceed the category limit
    const isNewCategory = !transactions.some(t => t.category === finalCategory);
    if (isNewCategory && isFreePlan) {
      const currentCategories = Array.from(new Set(transactions.map(t => t.category)));
      if (limits.maxCategories && currentCategories.length >= limits.maxCategories) {
        setLimitType('categories');
        setShowUpgradePopup(true);
        return;
      }
    }

    // Add transaction using the shared context
    addTransaction({
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: finalCategory,
      description: newTransaction.description,
      date: newTransaction.date
    });
    
    // Reset form
    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    // Reset custom category state
    setShowCustomCategory(false);
    setCustomCategory('');
    
    setShowAddForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleCategoryToggle = () => {
    setShowCustomCategory(!showCustomCategory);
    if (showCustomCategory) {
      // Switching back to predefined categories
      setCustomCategory('');
      setNewTransaction({...newTransaction, category: ''});
    } else {
      // Switching to custom category
      setNewTransaction({...newTransaction, category: ''});
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <Receipt className="w-3 h-3 sm:w-4 sm:h-4" />
                Transactions
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Track and manage money flow
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Fast entry, powerful filters, real-time totals</p>
              
              {/* Plan Limit Indicator */}
              {isFreePlan && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    <Crown className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Free Plan: {transactions.length} / {limits.maxTransactions || 10} transactions, {Array.from(new Set(transactions.map(t => t.category))).length} / {limits.maxCategories || 10} categories
                    </span>
                  </div>
                  {remainingTransactions <= 3 && remainingTransactions > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      {remainingTransactions} transactions left
                    </Badge>
                  )}
                  {limits.maxCategories && Array.from(new Set(transactions.map(t => t.category))).length >= limits.maxCategories && (
                    <Badge variant="destructive">
                      Category limit reached
                    </Badge>
                  )}
                  {hasReachedLimit && (
                    <Badge variant="destructive">
                      Transaction limit reached
                    </Badge>
                  )}
                </div>
              )}
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
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button 
                    className={`w-full sm:w-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-200 h-12 ${
                      hasReachedLimit 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    disabled={hasReachedLimit}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {hasReachedLimit ? 'Limit Reached' : 'Add Transaction'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    {hasReachedLimit && (
                      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-2">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          You've reached your limit of {limits.maxTransactions || 10} transactions on the Free plan. 
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-orange-800 dark:text-orange-200 underline"
                            onClick={() => {
                              setShowAddForm(false);
                              setLimitType('transactions');
                              setShowUpgradePopup(true);
                            }}
                          >
                            Upgrade to Pro
                          </Button> for unlimited transactions.
                        </p>
                      </div>
                    )}
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Type</Label>
                        <Select 
                          value={newTransaction.type} 
                          onValueChange={(value: 'income' | 'expense') => 
                            setNewTransaction({...newTransaction, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="category">Category</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCategoryToggle}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {showCustomCategory ? 'Use Predefined' : 'Add Custom'}
                        </Button>
                      </div>
                      
                      {showCustomCategory ? (
                        <Input
                          id="custom-category"
                          placeholder="Enter custom category..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                        />
                      ) : (
                        <Select 
                          value={newTransaction.category} 
                          onValueChange={(value) => 
                            setNewTransaction({...newTransaction, category: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Transaction description..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddTransaction}
                        disabled={hasReachedLimit}
                      >
                        {hasReachedLimit ? 'Limit Reached' : 'Add Transaction'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Transactions</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {transactions.length}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {transactions.length === 0 ? 'No transactions yet' : 'Transactions recorded'}
                </p>
                {isFreePlan && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hasReachedLimit ? 'Limit reached' : `${remainingTransactions} remaining`}
                  </p>
                )}
              </CardContent>
            </Card>

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
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {totalIncome > 0 ? 'Income received' : 'Start adding income'}
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
                  {formatCurrency(totalExpenses)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {totalExpenses > 0 ? 'Expenses tracked' : 'Start tracking expenses'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Net Balance</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${netBalance >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(netBalance)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA Banner - Only show for free users */}
          {isFreePlan && (
            <Card className="rounded-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm shadow-lg border border-blue-200/50 dark:border-blue-700/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                        Free Plan: {transactions.length} / {limits.maxTransactions || 10} transactions
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {hasReachedLimit ? 'Limit reached' : `${remainingTransactions} remaining`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setLimitType('transactions');
                        setShowUpgradePopup(true);
                      }}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 rounded-full"
                    >
                      <Crown className="w-3 h-3 mr-1" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Search */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Recent Transactions
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {transactions.length === 0 ? 'No Transactions Yet' : 'No Matching Transactions'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {transactions.length === 0 
                      ? 'Start by adding your first transaction to track your finances'
                      : 'Try adjusting your search or filters'
                    }
                  </p>
                  {transactions.length === 0 && (
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Transaction
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 dark:bg-green-900/30' 
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {transaction.type === 'income' ? (
                            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                              {transaction.description || transaction.category}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            transaction.type === 'income' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            {transaction.type}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 sm:w-5 sm:w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Transactions Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You can now add, view, and manage transactions
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Transactions page is now fully functional! You can:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• Add new income and expense transactions</li>
                  <li>• Use predefined categories or create custom ones</li>
                  <li>• Search and filter transactions</li>
                  <li>• View real-time totals and balances</li>
                  <li>• Delete transactions as needed</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={hasReachedLimit}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {hasReachedLimit ? 'Limit Reached' : 'Add Transaction'}
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

      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        limitType={limitType}
        currentCount={limitType === 'transactions' ? transactions.length : Array.from(new Set(transactions.map(t => t.category))).length}
        maxCount={limitType === 'transactions' ? (limits.maxTransactions || 10) : (limits.maxCategories || 10)}
      />
    </DashboardLayout>
  );
};

export default Transactions;
