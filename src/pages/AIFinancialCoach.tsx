import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Calculator, Shield, TrendingUp, PiggyBank, DollarSign, Plus, Trash2, Play, RotateCcw, Settings, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AllocationBasket {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  percentage: number;
  amount: number;
  actualTotal: number;
  target: number;
  status: 'on-track' | 'below-target' | 'exceeding';
}

interface BasketTransaction {
  id: string;
  basketName: string;
  amount: number;
  date: Date;
  description: string;
  type: 'contribution' | 'withdrawal';
}

const AIFinancialCoach = () => {
  const { toast } = useToast();
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(5000);
  const [allocations, setAllocations] = useState<AllocationBasket[]>([
    {
      name: 'Financial Security',
      description: 'Essential expenses, debt payments, insurance',
      icon: Shield,
      color: 'bg-blue-500',
      percentage: 40,
      amount: 2000,
      actualTotal: 2500,
      target: 2000,
      status: 'exceeding'
    },
    {
      name: 'Investments',
      description: 'Long-term wealth building and retirement',
      icon: TrendingUp,
      color: 'bg-green-500',
      percentage: 40,
      amount: 2000,
      actualTotal: 1800,
      target: 2000,
      status: 'below-target'
    },
    {
      name: 'Emergency Savings',
      description: 'Rainy day fund and unexpected expenses',
      icon: PiggyBank,
      color: 'bg-purple-500',
      percentage: 20,
      amount: 1000,
      actualTotal: 1200,
      target: 1000,
      status: 'exceeding'
    }
  ]);

  const [transactions, setTransactions] = useState<BasketTransaction[]>([
    {
      id: '1',
      basketName: 'Financial Security',
      amount: 500,
      date: new Date('2024-01-15'),
      description: 'Monthly debt payment',
      type: 'contribution'
    },
    {
      id: '2',
      basketName: 'Investments',
      amount: 800,
      date: new Date('2024-01-15'),
      description: '401k contribution',
      type: 'contribution'
    },
    {
      id: '3',
      basketName: 'Emergency Savings',
      amount: 400,
      date: new Date('2024-01-15'),
      description: 'Monthly savings transfer',
      type: 'contribution'
    }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    basketName: '',
    amount: '',
    description: '',
    type: 'contribution' as 'contribution' | 'withdrawal'
  });

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [editingTargetValue, setEditingTargetValue] = useState('');

  // Calculate net surplus (same as monthly net income in this simplified version)
  const netSurplus = monthlyNetIncome;

  // Update basket amounts when net surplus changes
  useEffect(() => {
    const newAllocations = allocations.map(basket => ({
      ...basket,
      amount: Math.round((netSurplus * basket.percentage) / 100)
    }));
    setAllocations(newAllocations);
  }, [netSurplus]);

  // Calculate actual totals from transactions
  useEffect(() => {
    const newAllocations = allocations.map(basket => {
      const basketTransactions = transactions.filter(t => t.basketName === basket.name);
      const totalContributions = basketTransactions
        .filter(t => t.type === 'contribution')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawals = basketTransactions
        .filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const actualTotal = totalContributions - totalWithdrawals;
      
      // Update status based on actual vs target
      let status: 'on-track' | 'below-target' | 'exceeding';
      if (actualTotal >= basket.target) {
        status = actualTotal > basket.target ? 'exceeding' : 'on-track';
      } else {
        status = 'below-target';
      }
      
      return {
        ...basket,
        actualTotal,
        status
      };
    });
    setAllocations(newAllocations);
  }, [transactions]);

  const addTransaction = () => {
    console.log('Adding transaction:', newTransaction); // Debug log
    
    if (!newTransaction.basketName || !newTransaction.amount || !newTransaction.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive"
      });
      return;
    }

    const transaction: BasketTransaction = {
      id: Date.now().toString(),
      basketName: newTransaction.basketName,
      amount: amount,
      date: new Date(),
      description: newTransaction.description,
      type: newTransaction.type
    };

    console.log('Created transaction:', transaction); // Debug log

    setTransactions(prev => [transaction, ...prev]);
    
    // Reset form
    setNewTransaction({
      basketName: '',
      amount: '',
      description: '',
      type: 'contribution'
    });
    
    setShowTransactionForm(false);

    toast({
      title: "Transaction Added",
      description: `${newTransaction.type === 'contribution' ? 'Added' : 'Withdrew'} $${amount.toLocaleString()} to/from ${newTransaction.basketName}`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Transaction Deleted",
      description: "Transaction has been removed",
    });
  };

  const generateAIInsights = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "AI Insights Generated",
        description: "New financial recommendations are available",
      });
    }, 2000);
  };

  const startTargetEdit = (basketName: string, currentTarget: number) => {
    setEditingTarget(basketName);
    setEditingTargetValue(currentTarget.toString());
  };

  const saveTarget = (basketName: string) => {
    const newTarget = Number(editingTargetValue);
    if (isNaN(newTarget) || newTarget < 0) {
      toast({
        title: "Invalid Target",
        description: "Please enter a valid positive number",
        variant: "destructive"
      });
      return;
    }

    const updatedAllocations = allocations.map(basket => 
      basket.name === basketName 
        ? { ...basket, target: newTarget }
        : basket
    );
    
    setAllocations(updatedAllocations);
    setEditingTarget(null);
    setEditingTargetValue('');

    toast({
      title: "Target Updated",
      description: `${basketName} target set to $${newTarget.toLocaleString()}`,
    });
  };

  const cancelTargetEdit = () => {
    setEditingTarget(null);
    setEditingTargetValue('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'below-target':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'exceeding':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return '✓';
      case 'below-target':
        return '⚠';
      case 'exceeding':
        return '↑';
      default:
        return '•';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              AI Financial Coach
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Get personalized financial advice and optimize your budget allocation
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Advanced'} Settings
            </Button>
            
            <Button
              onClick={generateAIInsights}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
            </Button>
          </div>
        </div>

        {/* Page's Top Section: Income Management */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Calculator className="w-5 h-5" />
              Monthly Net Income Input
            </CardTitle>
            <CardDescription>
              Enter your monthly net income to automatically allocate to financial baskets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Monthly Net Income (USD)</Label>
                <Input
                  id="income"
                  type="number"
                  value={monthlyNetIncome}
                  onChange={(e) => setMonthlyNetIncome(Number(e.target.value))}
                  placeholder="5000"
                  className="mt-1 text-2xl font-bold text-center"
                />
              </div>
              
              <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  ${monthlyNetIncome.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Available for Allocation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Three-Basket Allocation System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {allocations.map((basket, index) => (
            <Card key={basket.name} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${basket.color} rounded-lg flex items-center justify-center`}>
                      <basket.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{basket.name}</CardTitle>
                      <CardDescription className="text-sm">{basket.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(basket.status)}>
                    {getStatusIcon(basket.status)}
                    <span className="ml-1 capitalize">{basket.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${basket.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {basket.percentage}% of net income
                  </div>
                </div>
                
                <Progress value={basket.percentage} className="h-2" />
                
                {/* Target Setting Section */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Monthly Target</span>
                    {editingTarget === basket.name ? (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => saveTarget(basket.name)}
                          className="h-6 px-2 text-xs border-green-300 text-green-700 hover:bg-green-100"
                        >
                          ✓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelTargetEdit}
                          className="h-6 px-2 text-xs border-red-300 text-red-700 hover:bg-red-100"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startTargetEdit(basket.name, basket.target)}
                        className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Set Target
                      </Button>
                    )}
                  </div>
                  
                  {editingTarget === basket.name ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={editingTargetValue}
                        onChange={(e) => setEditingTargetValue(e.target.value)}
                        className="text-center font-bold text-blue-900 dark:text-blue-100 border-blue-300 focus:border-blue-500"
                        placeholder="Enter target amount"
                        min="0"
                        step="0.01"
                      />
                      <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                        Press ✓ to save or ✕ to cancel
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      ${basket.target.toLocaleString()}
                    </div>
                  )}
                </div>
                
                {/* Actual Total vs Target */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actual Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${basket.actualTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Target: ${basket.target.toLocaleString()}</span>
                    <span className={`font-medium ${
                      basket.actualTotal >= basket.target ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {basket.actualTotal >= basket.target ? '✓ On Track' : '⚠ Below Target'}
                    </span>
                  </div>
                  
                  {/* Progress towards target */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.min(100, Math.round((basket.actualTotal / basket.target) * 100))}%</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (basket.actualTotal / basket.target) * 100)} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transaction Logging System */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Transaction Log
                </CardTitle>
                <CardDescription>
                  Track your actual contributions and withdrawals to each basket
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowTransactionForm(!showTransactionForm)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showTransactionForm ? 'Cancel' : 'Add Transaction'}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Add Transaction Form */}
            {showTransactionForm && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="basket">Basket *</Label>
                    <Select
                      value={newTransaction.basketName}
                      onValueChange={(value) => {
                        console.log('Basket selected:', value); // Debug log
                        setNewTransaction(prev => ({ ...prev, basketName: value }));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select basket" />
                      </SelectTrigger>
                      <SelectContent>
                        {allocations.map((basket) => (
                          <SelectItem key={basket.name} value={basket.name}>
                            {basket.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="amount">Amount (USD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => {
                        console.log('Amount changed:', e.target.value); // Debug log
                        setNewTransaction(prev => ({ ...prev, amount: e.target.value }));
                      }}
                      placeholder="100"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={newTransaction.description}
                      onChange={(e) => {
                        console.log('Description changed:', e.target.value); // Debug log
                        setNewTransaction(prev => ({ ...prev, description: e.target.value }));
                      }}
                      placeholder="Monthly contribution"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={newTransaction.type}
                      onValueChange={(value: 'contribution' | 'withdrawal') => {
                        console.log('Type selected:', value); // Debug log
                        setNewTransaction(prev => ({ ...prev, type: value }));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contribution">Contribution</SelectItem>
                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    onClick={addTransaction} 
                    className="flex items-center gap-2"
                    disabled={!newTransaction.basketName || !newTransaction.amount || !newTransaction.description}
                  >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                  </Button>
                </div>
                
                {/* Debug info - remove in production */}
                <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                  <div>Debug: Basket: "{newTransaction.basketName}" | Amount: "{newTransaction.amount}" | Description: "{newTransaction.description}" | Type: "{newTransaction.type}"</div>
                </div>
              </div>
            )}

            {/* Transaction History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                <span>Recent Transactions</span>
                <span className="text-xs">Total: {transactions.length}</span>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No transactions yet. Add your first contribution to start tracking!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'contribution' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'contribution' ? '+' : '-'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {transaction.basketName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {transaction.date.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${
                          transaction.type === 'contribution' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'contribution' ? '+' : '-'}
                          ${transaction.amount.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIFinancialCoach;
