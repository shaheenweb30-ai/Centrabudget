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

// Sample initial data
const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', amount: 2500.00, category: 'Salary', description: 'Monthly salary payment', date: '2025-01-15', created_at: '2025-01-15T09:00:00Z' },
  { id: '2', type: 'expense', amount: 120.00, category: 'Groceries', description: 'Weekly grocery shopping', date: '2025-01-14', created_at: '2025-01-14T16:30:00Z' },
  { id: '3', type: 'expense', amount: 45.00, category: 'Dining', description: 'Lunch at restaurant', date: '2025-01-13', created_at: '2025-01-13T12:15:00Z' },
  { id: '4', type: 'income', amount: 500.00, category: 'Freelance', description: 'Web design project', date: '2025-01-12', created_at: '2025-01-12T14:20:00Z' },
  { id: '5', type: 'expense', amount: 89.99, category: 'Shopping', description: 'New headphones', date: '2025-01-11', created_at: '2025-01-11T10:45:00Z' },
  { id: '6', type: 'expense', amount: 65.00, category: 'Transportation', description: 'Gas and parking', date: '2025-01-10', created_at: '2025-01-10T08:30:00Z' },
  { id: '7', type: 'expense', amount: 75.00, category: 'Gym Membership', description: 'Monthly gym fee', date: '2025-01-09', created_at: '2025-01-09T08:00:00Z' },
  { id: '8', type: 'expense', amount: 120.00, category: 'Pet Care', description: 'Vet visit and supplies', date: '2025-01-08', created_at: '2025-01-08T14:30:00Z' },
  { id: '9', type: 'expense', amount: 45.00, category: 'Hobby Expenses', description: 'Art supplies', date: '2025-01-07', created_at: '2025-01-07T16:45:00Z' },
];

// Predefined categories with default budgets
const predefinedCategories = [
  { name: 'Food & Dining', icon: '🍔', color: '#10B981', defaultBudget: 500 },
  { name: 'Transportation', icon: '🚗', color: '#3B82F6', defaultBudget: 300 },
  { name: 'Entertainment', icon: '🎬', color: '#8B5CF6', defaultBudget: 200 },
  { name: 'Shopping', icon: '🛍️', color: '#F59E0B', defaultBudget: 400 },
  { name: 'Groceries', icon: '🛒', color: '#84CC16', defaultBudget: 400 },
  { name: 'Dining', icon: '🍽️', color: '#F97316', defaultBudget: 300 },
  { name: 'Salary', icon: '💰', color: '#10B981', defaultBudget: 0 },
  { name: 'Freelance', icon: '💼', color: '#06B6D4', defaultBudget: 0 },
];

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
    setCategories(newCategories);
    
    // Save to localStorage
          localStorage.setItem('centrabudget_transactions', JSON.stringify(transactions));
  }, [transactions]);

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
