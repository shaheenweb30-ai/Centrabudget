import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart as LineChartIcon,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface InteractiveFinancialChartProps {
  monthlyData: MonthlyData[];
  formatCurrency: (amount: number) => string;
}

type ChartType = 'line' | 'area' | 'bar' | 'pie';

const CHART_TYPES = [
  { type: 'line', label: 'Line Chart', icon: LineChartIcon, description: 'Trend analysis' },
  { type: 'area', label: 'Area Chart', icon: BarChart3, description: 'Volume visualization' },
  { type: 'bar', label: 'Bar Chart', icon: BarChart3, description: 'Comparison view' },
  { type: 'pie', label: 'Pie Chart', icon: PieChartIcon, description: 'Distribution' }
] as const;

const COLORS = {
  income: '#10B981',
  expenses: '#EF4444',
  balance: '#3B82F6',
  positive: '#10B981',
  negative: '#EF4444'
};

export function InteractiveFinancialChart({ monthlyData, formatCurrency }: InteractiveFinancialChartProps) {
  const { toast } = useToast();
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('line');
  const [showIncome, setShowIncome] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  // Filter data based on selected period
  const getFilteredData = () => {
    const months = selectedPeriod === '3m' ? 3 : selectedPeriod === '6m' ? 6 : 12;
    return monthlyData.slice(-months);
  };

  const filteredData = getFilteredData();

  // Calculate summary statistics
  const totalIncome = filteredData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.expenses, 0);
  const totalBalance = filteredData.reduce((sum, item) => sum + item.balance, 0);
  const avgBalance = totalBalance / filteredData.length;

  // Generate pie chart data for expenses breakdown
  const pieChartData = [
    { name: 'Income', value: totalIncome, color: COLORS.income },
    { name: 'Expenses', value: totalExpenses, color: COLORS.expenses }
  ];

  const renderChart = () => {
    const data = filteredData.map(item => ({
      ...item,
      balanceFormatted: formatCurrency(item.balance),
      incomeFormatted: formatCurrency(item.income),
      expensesFormatted: formatCurrency(item.expenses)
    }));

    switch (selectedChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-600 dark:text-slate-400">
                              {entry.name}:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {showIncome && (
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke={COLORS.income}
                  strokeWidth={3}
                  dot={{ fill: COLORS.income, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: COLORS.income, strokeWidth: 2 }}
                  name="Income"
                />
              )}
              {showExpenses && (
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke={COLORS.expenses}
                  strokeWidth={3}
                  dot={{ fill: COLORS.expenses, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: COLORS.expenses, strokeWidth: 2 }}
                  name="Expenses"
                />
              )}
              {showBalance && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={COLORS.balance}
                  strokeWidth={3}
                  dot={{ fill: COLORS.balance, strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: COLORS.balance, strokeWidth: 2 }}
                  name="Balance"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-600 dark:text-slate-400">
                              {entry.name}:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {showIncome && (
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke={COLORS.income}
                  fill={COLORS.income}
                  fillOpacity={0.6}
                  name="Income"
                />
              )}
              {showExpenses && (
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="1"
                  stroke={COLORS.expenses}
                  fill={COLORS.expenses}
                  fillOpacity={0.6}
                  name="Expenses"
                />
              )}
              {showBalance && (
                <Area
                  type="monotone"
                  dataKey="balance"
                  stackId="1"
                  stroke={COLORS.balance}
                  fill={COLORS.balance}
                  fillOpacity={0.6}
                  name="Balance"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 mb-1">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-slate-600 dark:text-slate-400">
                              {entry.name}:
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {formatCurrency(entry.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {showIncome && (
                <Bar
                  dataKey="income"
                  fill={COLORS.income}
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
              )}
              {showExpenses && (
                <Bar
                  dataKey="expenses"
                  fill={COLORS.expenses}
                  radius={[4, 4, 0, 0]}
                  name="Expenses"
                />
              )}
              {showBalance && (
                <Bar
                  dataKey="balance"
                  fill={COLORS.balance}
                  radius={[4, 4, 0, 0]}
                  name="Balance"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          {payload[0]?.name}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          Amount: {formatCurrency(payload[0]?.value || 0)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const handleDownloadChart = () => {
    // Implementation for downloading chart as image
    toast({
      title: "Chart Download",
      description: "Chart download feature coming soon!",
    });
  };

  return (
    <Card className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-slate-700/30">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <LineChartIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Interactive Financial Trends
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visualize your financial data with interactive charts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadChart}
              className="rounded-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top Two Charts - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Net Balance Chart */}
          <div className="bg-slate-50/30 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Net Balance - Month</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                          <p className={`font-bold ${payload[0]?.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(payload[0]?.value || 0)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={COLORS.balance}
                  strokeWidth={3}
                  dot={{ fill: COLORS.balance, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.balance, strokeWidth: 2 }}
                  name="Net Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Total Expenses Chart */}
          <div className="bg-slate-50/30 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Total Expenses - Month</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</p>
                          <p className="font-bold text-red-600">
                            {formatCurrency(payload[0]?.value || 0)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke={COLORS.expenses}
                  strokeWidth={3}
                  dot={{ fill: COLORS.expenses, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.expenses, strokeWidth: 2 }}
                  name="Total Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {CHART_TYPES.map((chartType) => {
            const IconComponent = chartType.icon;
            return (
              <Button
                key={chartType.type}
                variant={selectedChartType === chartType.type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChartType(chartType.type)}
                className={`rounded-full transition-all duration-200 ${
                  selectedChartType === chartType.type
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {chartType.label}
              </Button>
            );
          })}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Period:</span>
          {(['3m', '6m', '12m'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-full text-xs ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : ''
              }`}
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Data Series Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show:</span>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showIncome"
              checked={showIncome}
              onChange={(e) => setShowIncome(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="showIncome" className="text-sm text-slate-600 dark:text-slate-400">
              Income
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showExpenses"
              checked={showExpenses}
              onChange={(e) => setShowExpenses(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="showExpenses" className="text-sm text-slate-600 dark:text-slate-400">
              Expenses
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showBalance"
              checked={showBalance}
              onChange={(e) => setShowBalance(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showBalance" className="text-sm text-slate-600 dark:text-slate-400">
              Balance
            </label>
          </div>
        </div>

        {/* Main Interactive Chart */}
        <div className="bg-slate-50/30 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200/30 dark:border-slate-600/30">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Combined Financial Overview</h3>
          </div>
          {renderChart()}
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-600 dark:text-slate-400">Balance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
