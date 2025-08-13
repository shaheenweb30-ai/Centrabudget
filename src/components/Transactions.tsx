import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  MessageSquare, 
  List, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Target, 
  HelpCircle, 
  Settings, 
  Moon, 
  LogOut, 
  ChevronRight, 
  Bell, 
  Calendar, 
  Sparkles, 
  Download, 
  Filter, 
  MoreHorizontal,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Transactions = () => {
  const navigate = useNavigate();
  
  const transactions = [
    { id: 'TXN-24020110', name: 'Transfer from Bank', amount: 980, type: 'income', date: 'February 29, 2025 09:41 PM', status: 'Completed' },
    { id: 'TXN-24020109', name: 'Youtube Premium', amount: -20, type: 'expense', date: 'February 29, 2025 09:41 PM', status: 'Completed' },
    { id: 'TXN-24020108', name: 'Internet', amount: -120, type: 'expense', date: 'February 29, 2025 01:56 PM', status: 'Completed' },
    { id: 'TXN-24020107', name: 'Transfer from Bank', amount: 1000, type: 'income', date: 'February 29, 2025 11:36 AM', status: 'Completed' },
    { id: 'TXN-24020106', name: 'Transfer from Bank', amount: 1200, type: 'income', date: 'February 29, 2025 11:25 AM', status: 'Completed' },
    { id: 'TXN-24020105', name: 'Starbucks Coffee', amount: -12, type: 'expense', date: 'February 29, 2025 09:41 AM', status: 'Completed' },
    { id: 'TXN-24020104', name: 'Salary (Freelance)', amount: 100, type: 'income', date: 'February 28, 2025 10:12 PM', status: 'Completed' },
    { id: 'TXN-24020103', name: 'Crypto Investment', amount: 1000, type: 'income', date: 'February 28, 2025 10:12 PM', status: 'Completed' },
    { id: 'TXN-24020102', name: 'Amazon Purchase', amount: -30, type: 'expense', date: 'February 27, 2025 10:12 PM', status: 'Completed' },
    { id: 'TXN-24020101', name: 'Spotify Premium', amount: -40, type: 'expense', date: 'February 27, 2025 08:00 AM', status: 'Failed' },
  ];


    { name: 'Youtube', amount: 20, logo: '🎥' },
    { name: 'Spotify', amount: 69, logo: '🎵' },
    { name: 'Dribbble Pro', amount: 59, logo: '🎨' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white transform rotate-45"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">mowany</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">P</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Peter Parker</div>
              <div className="text-xs text-gray-500">Personal Account</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div 
              className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              <Compass className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">AI Financial Insights</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <List className="w-5 h-5" />
              <span className="text-sm font-medium">Transactions</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Budget & Expense</span>
            </div>
            <div 
              className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              onClick={() => navigate('/categories-budget')}
            >
              <Target className="w-5 h-5" />
              <span className="text-sm">Categories & Budget</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Investment</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Invoices</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <Target className="w-5 h-5" />
              <span className="text-sm">Goals & Savings</span>
            </div>
          </div>

          {/* Others Section */}
          <div className="mt-8">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">Others</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">Help Center</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5" />
                  <span className="text-sm">Dark Mode</span>
                </div>
                <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                  <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search anything..." 
                className="pl-10 pr-8 bg-gray-50 border-gray-200"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                ⌘F
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">February 2025</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button className="bg-blue-600 text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Ask Mowany AI
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Left Content */}
          <div className="flex-1 p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Transactions This Month</p>
                      <p className="text-2xl font-bold text-gray-900">$125,430</p>
                    </div>
                    <div className="text-green-600 text-sm font-medium">↑ 12.5%</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Income</p>
                      <p className="text-2xl font-bold text-gray-900">$92,000</p>
                    </div>
                    <div className="text-green-600 text-sm font-medium">↑ 15.5%</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                      <p className="text-2xl font-bold text-gray-900">$58,500</p>
                    </div>
                    <div className="text-red-600 text-sm font-medium">↓ 8.5%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input 
                        placeholder="Search..." 
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Latest" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <Checkbox />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Transaction ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Payment Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <Checkbox />
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">{transaction.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-900">{transaction.name}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={transaction.status === 'Completed' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">Show data 10 of 200</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">{"<<"}</Button>
                    <Button variant="outline" size="sm">{"<"}</Button>
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <span className="text-gray-600">...</span>
                    <Button variant="outline" size="sm">10</Button>
                    <Button variant="outline" size="sm">{">"}</Button>
                    <Button variant="outline" size="sm">{">>"}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
            {/* Category Breakdown */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">125K</div>
                        <div className="text-xs text-gray-600">Total Balance</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Income</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                    <span className="text-sm text-gray-600">Expense</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Your dining expense increased by 20% compared to last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">AI Insight</h3>
                </div>
                <p className="text-sm text-blue-800 mb-4">
                  You have saved $1,200 this month. Based on your spending habits, allocating an additional 5% to savings can help you reach your financial goal faster.
                </p>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Auto Save Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions; 