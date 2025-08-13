import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  User, 
  TrendingUp, 
  BarChart3,
  ArrowRight
} from 'lucide-react';

export const AuthenticatedHomepage = () => {
  const { user } = useAuth();
  
  console.log('AuthenticatedHomepage: User data:', user);

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Ready to continue managing your finances? Here's what you can do next.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <LayoutDashboard className="w-5 h-5 mr-2 text-blue-600" />
                Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                View your financial overview, budgets, and insights at a glance.
              </p>
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Receipt className="w-5 h-5 mr-2 text-green-600" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track your income, expenses, and manage your transaction history.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/transactions">
                  View Transactions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Generate detailed reports and analyze your spending patterns.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/reports">
                  View Reports
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Update your personal information and manage your account settings.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">
                  Edit Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Settings className="w-5 h-5 mr-2 text-orange-600" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Customize your preferences, currency, and notification settings.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">
                  Manage Settings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get AI-powered insights and recommendations for your finances.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/insights">
                  View Insights
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Preview */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need to see the public homepage? <Link to="/?public=true" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">Click here</Link>
          </p>
        </div>
      </div>
    </div>
    </Layout>
  );
};
