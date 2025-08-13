import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  PiggyBank, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  DollarSign,
  Calendar,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  Zap,
  Crown,
  Lock,
  MoreVertical
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "@/contexts/TransactionContext";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useSettings } from "@/contexts/SettingsContext";
import UpgradePopup from "@/components/UpgradePopup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CategoriesBudget = () => {
  const navigate = useNavigate();
  const { categories, setBudget, deleteTransaction, deleteCategory, addTransaction } = useTransactions();
  const { isFreePlan, limits } = useUserPlan();
  const { preferences, formatCurrency } = useSettings();
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  
  // State for categories and budgets
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newBudget, setNewBudget] = useState({ categoryId: '', amount: '' });
  
  // State for category editing
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState<any>(null);
  const [editCategoryForm, setEditCategoryForm] = useState({ name: '', icon: '', color: '' });

  // State for adding new categories
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', icon: '', color: '' });

  // Check if user has reached limits
  const hasReachedCategoryLimit = isFreePlan && limits.maxCategories && categories.length >= limits.maxCategories;
  const hasReachedBudgetLimit = isFreePlan && limits.maxBudgets && categories.filter(cat => cat.budget > 0).length >= limits.maxBudgets;
  const remainingCategories = (limits.maxCategories || 10) - categories.length;
  const remainingBudgets = (limits.maxBudgets || 10) - categories.filter(cat => cat.budget > 0).length;

  // Get budget period display text
  const getBudgetPeriodText = () => {
    const period = preferences?.budgetPeriod || 'monthly';
    switch (period) {
      case 'quarterly': return 'Quarterly';
      case 'yearly': return 'Yearly';
      default: return 'Monthly';
    }
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    if (budget === 0) return { color: 'text-slate-600 dark:text-slate-400', icon: Eye, status: 'No Budget Set' };
    
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return { color: 'text-red-600 dark:text-red-400', icon: AlertCircle, status: 'Over Budget' };
    if (percentage >= 75) return { color: 'text-yellow-600 dark:text-yellow-400', icon: Clock, status: 'Warning' };
    return { color: 'text-green-700 dark:text-green-400', icon: CheckCircle, status: 'On Track' };
  };

  const handleAddBudget = () => {
    // Check if user has reached the budget limit
    if (hasReachedBudgetLimit) {
      setShowUpgradePopup(true);
      return;
    }

    if (!newBudget.categoryId || !newBudget.amount) return;
    
    setBudget(newBudget.categoryId, parseFloat(newBudget.amount));
    
    setNewBudget({ categoryId: '', amount: '' });
    setShowAddBudget(false);
    setEditingCategory(null);
  };

  const handleUpdateBudget = () => {
    if (!editingCategory || !editingCategory.budget) return;
    
    setBudget(editingCategory.id, editingCategory.budget);
    
    setEditingCategory(null);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategoryData(category);
    setEditCategoryForm({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setShowEditCategory(true);
  };

  const handleDeleteCategory = (category: any) => {
    // Prevent deletion of predefined categories
    if (!category.isCustom) {
      alert('Cannot delete predefined categories. You can only delete custom categories that you created.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the custom category "${category.name}"? This will also remove all ${category.transactionCount} associated transaction${category.transactionCount !== 1 ? 's' : ''}. This action cannot be undone.`)) {
      // Delete the category and all its transactions
      deleteCategory(category.name);
      
      // Show success message
      alert(`Category "${category.name}" and all its transactions have been deleted successfully.`);
    }
  };

  const handleSaveCategoryEdit = () => {
    if (!editingCategoryData || !editCategoryForm.name.trim()) return;
    
    // Update category data
    // Note: This is a simplified implementation - in a real app, you'd update the actual category
    console.log('Updating category:', editingCategoryData.name, 'to:', editCategoryForm);
    
    // For now, we'll just close the dialog
    setShowEditCategory(false);
    setEditingCategoryData(null);
    setEditCategoryForm({ name: '', icon: '', color: '' });
    
    alert('Category editing would be implemented here. For now, changes are not persisted.');
  };

  const handleAddNewCategory = () => {
    // Check if user has reached the category limit
    if (hasReachedCategoryLimit) {
      setShowUpgradePopup(true);
      return;
    }

    if (!newCategoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    // Check if category name already exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryForm.name.trim().toLowerCase()
    );
    
    if (existingCategory) {
      alert('A category with this name already exists. Please choose a different name.');
      return;
    }

    // Create a new transaction with the new category to trigger category creation
    // This is a simplified approach - in a real app, you'd have a dedicated addCategory function
    const newTransaction = {
      type: 'expense' as 'income' | 'expense',
      amount: 0,
      category: newCategoryForm.name.trim(),
      description: 'Category creation',
      date: new Date().toISOString().split('T')[0]
    };

    // Add the transaction to create the category
    addTransaction(newTransaction);
    
    // Reset form and close dialog
    setNewCategoryForm({ name: '', icon: '', color: '' });
    setShowAddCategory(false);
    
    // Show success message
    alert(`Category "${newCategoryForm.name.trim()}" has been created successfully!`);
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const customCategoriesCount = categories.filter(cat => cat.isCustom).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                Categories & Budget
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
                Manage Your Budgets
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                Organize spending by categories and set budget limits
                {customCategoriesCount > 0 && (
                  <span className="ml-2 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Zap className="w-4 h-4" />
                    {customCategoriesCount} custom categories
                  </span>
                )}
              </p>
              
              {/* Plan Limit Indicator */}
              {isFreePlan && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                    <Crown className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Free Plan: {categories.length} / {limits.maxCategories || 10} categories, {categories.filter(cat => cat.budget > 0).length} / {limits.maxBudgets || 10} budgets
                    </span>
                  </div>
                  {(remainingCategories <= 2 && remainingCategories > 0) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      {remainingCategories} categories left
                    </Badge>
                  )}
                  {(remainingBudgets <= 2 && remainingBudgets > 0) && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      {remainingBudgets} budgets left
                    </Badge>
                  )}
                  {(hasReachedCategoryLimit || hasReachedBudgetLimit) && (
                    <Badge variant="destructive">
                      Limit reached
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
              <Button 
                onClick={() => navigate('/transactions')}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add Transaction
              </Button>
              <Button 
                onClick={() => setShowAddCategory(true)}
                disabled={hasReachedCategoryLimit}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {hasReachedCategoryLimit ? 'Category Limit Reached' : 'Add Category'}
              </Button>
            </div>
          </div>



          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Categories</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {categories.length}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {customCategoriesCount > 0 ? `${customCategoriesCount} custom` : 'All predefined'}
                </p>
                {isFreePlan && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hasReachedCategoryLimit ? 'Limit reached' : `${remainingCategories} remaining`}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Budget</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  ${totalBudget.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {getBudgetPeriodText()} budget
                </p>
                {isFreePlan && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {hasReachedBudgetLimit ? 'Limit reached' : `${remainingBudgets} budgets remaining`}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Total Spent</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                  ${totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {getBudgetPeriodText()} spending
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">Remaining</CardTitle>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xl sm:text-2xl lg:text-3xl font-bold ${totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${totalRemaining.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Available to spend
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
                        Free Plan: {categories.length} / {limits.maxCategories || 10} categories, {categories.filter(cat => cat.budget > 0).length} / {limits.maxBudgets || 10} budgets
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {hasReachedCategoryLimit || hasReachedBudgetLimit ? 'Limit reached' : 'Upgrade to Pro for unlimited access'}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setShowUpgradePopup(true)}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 rounded-full"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((category) => {
              const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
              const status = getBudgetStatus(category.spent, category.budget);
              const StatusIcon = status.icon;
              
              return (
                <Card key={category.id} className={`rounded-xl border-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group ${
                  category.isCustom 
                    ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-700/50' 
                    : 'bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/30'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl shadow-sm"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                              {category.name}
                            </CardTitle>
                            {category.isCustom && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Custom
                              </Badge>
                            )}
                            {!category.isCustom && (
                              <Badge variant="outline" className="text-xs text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600">
                                Predefined
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${status.color}`} />
                            <Badge variant="secondary" className="text-xs">
                              {status.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Delete Button - Only for custom categories */}
                        {category.isCustom && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-300 dark:hover:bg-red-950/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title={`Delete "${category.name}" category and all ${category.transactionCount} transaction${category.transactionCount !== 1 ? 's' : ''}`}
                          >
                            <Trash2 className="h-4 w-4 hover:scale-110 transition-transform duration-200" />
                          </Button>
                        )}
                        
                        {/* Meatballs Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Category
                            </DropdownMenuItem>
                            {category.isCustom && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCategory(category)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Category
                                </DropdownMenuItem>
                              </>
                            )}
                            {!category.isCustom && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled className="text-slate-400">
                                  <Lock className="mr-2 h-4 w-4" />
                                  Predefined Category
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.budget > 0 ? (
                      <>
                        <Progress value={percentage} className="h-2 bg-slate-200 dark:bg-slate-700" />
                        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span>${category.spent.toLocaleString()} spent</span>
                          <span>${(category.budget - category.spent).toLocaleString()} remaining</span>
                        </div>
                        <div className="flex justify-center pt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setEditingCategory({ id: category.id, budget: category.budget });
                              setNewBudget({ categoryId: category.id, amount: category.budget.toString() });
                              setShowAddBudget(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit Budget
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Check if user has reached the budget limit
                            if (hasReachedBudgetLimit) {
                              setShowUpgradePopup(true);
                              return;
                            }
                            setNewBudget({ categoryId: category.id, amount: '' });
                            setShowAddBudget(true);
                          }}
                          className="w-full text-xs border-dashed"
                          disabled={hasReachedBudgetLimit}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {hasReachedBudgetLimit ? 'Limit Reached' : 'Set Budget'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Budget Dialog */}
          <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Budget for Category' : 'Set Budget for Category'}
                </DialogTitle>
                {hasReachedBudgetLimit && !editingCategory && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-2">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      You've reached your limit of {limits.maxBudgets || 10} budgets on the Free plan. 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-orange-800 dark:text-orange-200 underline"
                        onClick={() => {
                          setShowAddBudget(false);
                          setShowUpgradePopup(true);
                        }}
                      >
                        Upgrade to Pro
                      </Button> for unlimited budgets.
                    </p>
                  </div>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-amount">Budget Amount</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Budget Period</Label>
                  <div className="flex h-10 items-center px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-md border border-input">
                    {getBudgetPeriodText()}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAddBudget(false);
                    setEditingCategory(null);
                    setNewBudget({ categoryId: '', amount: '' });
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={editingCategory ? handleUpdateBudget : handleAddBudget}
                    disabled={hasReachedBudgetLimit && !editingCategory}
                  >
                    {editingCategory ? 'Update Budget' : hasReachedBudgetLimit ? 'Limit Reached' : 'Set Budget'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={showEditCategory} onOpenChange={setShowEditCategory}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    value={editCategoryForm.name}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, name: e.target.value})}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <Label htmlFor="category-icon">Icon</Label>
                  <Input
                    id="category-icon"
                    value={editCategoryForm.icon}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, icon: e.target.value})}
                    placeholder="Emoji or icon"
                  />
                </div>
                <div>
                  <Label htmlFor="category-color">Color</Label>
                  <Input
                    id="category-color"
                    type="color"
                    value={editCategoryForm.color}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, color: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowEditCategory(false);
                    setEditingCategoryData(null);
                    setEditCategoryForm({ name: '', icon: '', color: '' });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCategoryEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add New Category Dialog */}
          <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                {hasReachedCategoryLimit && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mt-2">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      You've reached your limit of {limits.maxCategories || 10} categories on the Free plan. 
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-orange-800 dark:text-orange-200 underline"
                        onClick={() => {
                          setShowAddCategory(false);
                          setShowUpgradePopup(true);
                        }}
                      >
                        Upgrade to Pro
                      </Button> for unlimited categories.
                    </p>
                  </div>
                )}
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-category-name">Category Name</Label>
                  <Input
                    id="new-category-name"
                    value={newCategoryForm.name}
                    onChange={(e) => setNewCategoryForm({...newCategoryForm, name: e.target.value})}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <Label htmlFor="new-category-icon">Icon</Label>
                  <Input
                    id="new-category-icon"
                    value={newCategoryForm.icon}
                    onChange={(e) => setNewCategoryForm({...newCategoryForm, icon: e.target.value})}
                    placeholder="Emoji or icon"
                  />
                </div>
                <div>
                  <Label htmlFor="new-category-color">Color</Label>
                  <Input
                    id="new-category-color"
                    type="color"
                    value={newCategoryForm.color}
                    onChange={(e) => setNewCategoryForm({...newCategoryForm, color: e.target.value})}
                    className="h-12"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryForm({ name: '', icon: '', color: '' });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNewCategory} disabled={hasReachedCategoryLimit}>
                    {hasReachedCategoryLimit ? 'Limit Reached' : 'Add Category'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>


        </div>
      </div>

      {/* Upgrade Popup */}
      <UpgradePopup
        isOpen={showUpgradePopup}
        onClose={() => setShowUpgradePopup(false)}
        limitType={hasReachedBudgetLimit ? "budgets" : "categories"}
        currentCount={hasReachedBudgetLimit ? categories.filter(cat => cat.budget > 0).length : categories.length}
        maxCount={hasReachedBudgetLimit ? (limits.maxBudgets || 10) : (limits.maxCategories || 10)}
      />
    </DashboardLayout>
  );
};

export default CategoriesBudget;
