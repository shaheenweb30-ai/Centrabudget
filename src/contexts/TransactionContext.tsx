import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget: number;
  spent: number;
  isCustom: boolean;
  transactionCount: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => void;
  deleteTransaction: (id: string) => void;
  deleteCategory: (categoryName: string) => void;
  setBudget: (categoryId: string, amount: number) => void;
  getCategoryByName: (name: string) => Category | undefined;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Start with empty data for new users
const initialTransactions: Transaction[] = [];

// Start with empty predefined categories for new users
const predefinedCategories: Array<{ name: string; icon: string; color: string; defaultBudget: number }> = [];

// Generate random colors for custom categories
const generateColor = (categoryName: string) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];
  const index = categoryName.charCodeAt(0) % colors.length;
  return colors[index];
};

// Generate icons for custom categories
const generateIcon = (categoryName: string) => {
  const iconMap: { [key: string]: string } = {
    'Gym': '🏋️', 'Pet': '🐾', 'Hobby': '🎨', 'Medical': '🏥', 'Education': '📚',
    'Home': '🏠', 'Business': '💼', 'Travel': '✈️', 'Technology': '💻', 'Sports': '⚽'
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  
  // Default icons for common words
  const defaultIcons = ['📁', '🎯', '💡', '🔧', '📱', '🎵', '🎬', '🍔', '🚗', '🛍️'];
  const index = categoryName.charCodeAt(0) % defaultIcons.length;
  return defaultIcons[index];
};

// Function to generate categories from transactions
const generateCategoriesFromTransactions = (transactions: Transaction[]): Category[] => {
  const transactionCategories = Array.from(new Set(transactions.map(t => t.category)));
  
  return transactionCategories.map(categoryName => {
    const predefined = predefinedCategories.find(p => p.name === categoryName);
    const categoryTransactions = transactions.filter(t => t.category === categoryName);
    const spent = categoryTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      id: categoryName,
      name: categoryName,
      icon: predefined?.icon || generateIcon(categoryName),
      color: predefined?.color || generateColor(categoryName),
      budget: predefined?.defaultBudget || 0,
      spent: spent,
      isCustom: !predefined,
      transactionCount: categoryTransactions.length
    };
  });
};

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('centrabudget_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    // Generate categories from initial transactions
    return generateCategoriesFromTransactions(initialTransactions);
  });

  // Update categories whenever transactions change
  useEffect(() => {
    const newCategories = generateCategoriesFromTransactions(transactions);
    
    // Only update if categories actually changed to prevent infinite loops
    const hasChanged = JSON.stringify(newCategories) !== JSON.stringify(categories);
    
    if (hasChanged) {
      setCategories(newCategories);
    }
    
    // Save to localStorage
    localStorage.setItem('centrabudget_transactions', JSON.stringify(transactions));
  }, [transactions]); // Remove categories from dependency to prevent circular updates

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const deleteCategory = (categoryName: string) => {
    // Delete all transactions in this category
    setTransactions(prev => prev.filter(t => t.category !== categoryName));
    // Categories will be automatically updated via useEffect when transactions change
  };

  const setBudget = (categoryId: string, amount: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, budget: amount }
        : cat
    ));
  };

  const getCategoryByName = (name: string) => {
    return categories.find(cat => cat.name === name);
  };

  const value: TransactionContextType = {
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    deleteCategory,
    setBudget,
    getCategoryByName
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
