import { useFeaturesContent } from "@/hooks/useFeaturesContent";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  BarChart3, 
  DollarSign, 
  Target, 
  Zap, 
  Smartphone,
  Globe,
  Lock,
  TrendingUp,
  PieChart,
  CreditCard,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Layout from "@/components/Layout";

export function DynamicFeatures() {
  const { content, loading, getContentBySection } = useFeaturesContent();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  const heroContent = getContentBySection('hero');
  const smartBudgetingContent = getContentBySection('smart-budgeting');
  const expenseTrackingContent = getContentBySection('expense-tracking');
  const analyticsContent = getContentBySection('analytics');
  const securityContent = getContentBySection('security');
  const integrationsContent = getContentBySection('integrations');

  return (
    <Layout>
      {/* Hero Section */}
      <AdminContentWrapper 
        sectionId="hero" 
        className="relative bg-background py-12 overflow-hidden"
        style={{ backgroundColor: heroContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8 lg:space-y-10">
                {/* Small purple label */}
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">
                    {heroContent?.description || 'Advanced Financial Tools'}
                  </span>
                </div>
                
                {/* Main headline */}
                <h1 
                  className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight"
                  style={{ color: heroContent?.title_color || '#000000' }}
                >
                  {heroContent?.title || 'Powerful Features for Smart Finance'}
                </h1>
                
                {/* Subtitle */}
                <p 
                  className="font-body text-lg md:text-xl lg:text-2xl text-gray-600"
                  style={{ color: heroContent?.subtitle_color || '#666666' }}
                >
                  {heroContent?.subtitle || 'Everything you need to take control of your financial future'}
                </p>
                
                {/* CTA Button */}
                {heroContent?.button_text && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="rounded-full px-8 py-3 text-lg"
                    style={{
                      backgroundColor: heroContent.button_color || 'hsl(var(--primary))',
                      color: heroContent.button_text_color || 'hsl(var(--primary-foreground))'
                    }}
                  >
                    {heroContent.button_text}
                  </Button>
                )}
              </div>
              
              {/* Right side - Feature Dashboard Mockup */}
              <div className="relative">
                <div className="bg-gray-100 rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
                  {/* Window controls */}
                  <div className="flex space-x-2 mb-6">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="space-y-4 mb-8">
                    {/* Budget Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-white">
                          <div className="font-semibold">Smart Budget</div>
                          <div className="text-sm opacity-90">$2,400 / $3,000</div>
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Analytics Card */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-white">
                          <div className="font-semibold">Analytics</div>
                          <div className="text-sm opacity-90">+12% this month</div>
                        </div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">$9,823</div>
                      <div className="text-xs text-gray-600">Total Balance</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">+$2,832</div>
                      <div className="text-xs text-gray-600">This Month</div>
                    </div>
                  </div>
                  
                  {/* Security Status */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Security Active</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>



      {/* Smart Budgeting Section */}
      <AdminContentWrapper 
        sectionId="smart-budgeting" 
        className="py-12 bg-background"
        style={{ backgroundColor: smartBudgetingContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
                <span className="text-blue-600">Smart</span> Budgeting Made Simple
              </h2>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-8"
                    style={{ color: smartBudgetingContent?.title_color || '#1F2937' }}
                  >
                    {smartBudgetingContent?.title || 'AI-Powered Budget Planning'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-10 text-gray-600"
                    style={{ color: smartBudgetingContent?.description_color || '#666666' }}
                  >
                    {smartBudgetingContent?.description || 'Set realistic budgets and track your spending with our AI-powered insights that help you stay on track and achieve your financial goals.'}
                  </p>
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Automatic categorization</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Smart spending alerts</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Goal-based budgeting</span>
                    </div>
                  </div>
                  {smartBudgetingContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3 text-lg"
                      style={{
                        backgroundColor: smartBudgetingContent.button_color || 'hsl(var(--primary))',
                        color: smartBudgetingContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {smartBudgetingContent.button_text}
                    </Button>
                  )}
                </div>
                <div className="relative">
                  {smartBudgetingContent?.image_url ? (
                    <img 
                      src={smartBudgetingContent.image_url} 
                      alt="Smart budgeting dashboard" 
                      className="w-full h-auto rounded-3xl shadow-2xl"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 h-96 flex items-center justify-center">
                      <Target className="w-40 h-40 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Expense Tracking Section */}
      <AdminContentWrapper 
        sectionId="expense-tracking" 
        className="py-12 bg-background"
        style={{ backgroundColor: expenseTrackingContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="relative order-2 lg:order-1">
                  {expenseTrackingContent?.image_url ? (
                    <img 
                      src={expenseTrackingContent.image_url} 
                      alt="Expense tracking dashboard" 
                      className="w-full h-auto rounded-3xl shadow-2xl"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-12 h-96 flex items-center justify-center">
                      <DollarSign className="w-40 h-40 text-green-500" />
                    </div>
                  )}
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-8"
                    style={{ color: expenseTrackingContent?.title_color || '#1F2937' }}
                  >
                    {expenseTrackingContent?.title || 'Real-Time Expense Tracking'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-10 text-gray-600"
                    style={{ color: expenseTrackingContent?.description_color || '#666666' }}
                  >
                    {expenseTrackingContent?.description || 'Monitor every transaction with detailed categorization and analytics for better financial visibility and control.'}
                  </p>
                  <div className="space-y-6 mb-10">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Real-time transaction sync</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Multi-currency support</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-body text-foreground text-lg">Receipt scanning</span>
                    </div>
                  </div>
                  {expenseTrackingContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3 text-lg"
                      style={{
                        backgroundColor: expenseTrackingContent.button_color || 'hsl(var(--primary))',
                        color: expenseTrackingContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {expenseTrackingContent.button_text}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Analytics Section */}
      <AdminContentWrapper 
        sectionId="analytics" 
        className="py-12 bg-background"
        style={{ backgroundColor: analyticsContent?.background_color || '#FFFFFF' }}
        contentType="features"
      >
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
                <span className="text-blue-600">Advanced</span> Analytics & Insights
              </h2>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-8">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-8"
                    style={{ color: analyticsContent?.title_color || '#1F2937' }}
                  >
                    {analyticsContent?.title || 'Comprehensive Financial Analytics'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-10 text-gray-600"
                    style={{ color: analyticsContent?.description_color || '#666666' }}
                  >
                    {analyticsContent?.description || 'Get comprehensive reports and visualizations that help you understand your financial behavior and make informed decisions.'}
                  </p>
                  <div className="grid grid-cols-1 gap-6 mb-10">
                    <div className="flex items-center space-x-4">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                      <span className="font-body text-foreground text-lg">Trend Analysis</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <PieChart className="w-6 h-6 text-purple-500" />
                      <span className="font-body text-foreground text-lg">Category Breakdown</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <BarChart3 className="w-6 h-6 text-purple-500" />
                      <span className="font-body text-foreground text-lg">Monthly Reports</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Zap className="w-6 h-6 text-purple-500" />
                      <span className="font-body text-foreground text-lg">Real-time Data</span>
                    </div>
                  </div>
                  {analyticsContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3 text-lg"
                      style={{
                        backgroundColor: analyticsContent.button_color || 'hsl(var(--primary))',
                        color: analyticsContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {analyticsContent.button_text}
                    </Button>
                  )}
                </div>
                <div className="relative">
                  {analyticsContent?.image_url ? (
                    <img 
                      src={analyticsContent.image_url} 
                      alt="Financial analytics dashboard" 
                      className="w-full h-auto rounded-3xl shadow-2xl"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 h-96 flex items-center justify-center">
                      <BarChart3 className="w-40 h-40 text-purple-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Security & Integrations Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
              <span className="text-blue-600">Security</span> & Integrations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Security Card */}
            <AdminContentWrapper 
              sectionId="security" 
              className="rounded-3xl p-10 bg-white shadow-2xl"
              style={{ backgroundColor: securityContent?.background_color || '#FFFFFF' }}
              contentType="features"
            >
              <Card className="border-0 bg-transparent h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-8">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-6"
                    style={{ color: securityContent?.title_color || '#1F2937' }}
                  >
                    {securityContent?.title || 'Bank-Grade Security'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-8 flex-grow text-gray-600"
                    style={{ color: securityContent?.description_color || '#666666' }}
                  >
                    {securityContent?.description || 'Your data is protected with military-grade encryption and advanced security measures.'}
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-4">
                      <Lock className="w-6 h-6 text-red-500" />
                      <span className="font-body text-foreground text-lg">256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Shield className="w-6 h-6 text-red-500" />
                      <span className="font-body text-foreground text-lg">Multi-factor authentication</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Zap className="w-6 h-6 text-red-500" />
                      <span className="font-body text-foreground text-lg">Real-time fraud detection</span>
                    </div>
                  </div>
                  {securityContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3 text-lg w-full"
                      style={{
                        backgroundColor: securityContent.button_color || 'hsl(var(--primary))',
                        color: securityContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {securityContent.button_text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </AdminContentWrapper>

            {/* Integrations Card */}
            <AdminContentWrapper 
              sectionId="integrations" 
              className="rounded-3xl p-10 bg-white shadow-2xl"
              style={{ backgroundColor: integrationsContent?.background_color || '#FFFFFF' }}
              contentType="features"
            >
              <Card className="border-0 bg-transparent h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-8">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h3 
                    className="font-heading font-bold text-3xl mb-6"
                    style={{ color: integrationsContent?.title_color || '#1F2937' }}
                  >
                    {integrationsContent?.title || 'Seamless Integrations'}
                  </h3>
                  <p 
                    className="font-body text-lg mb-8 flex-grow text-gray-600"
                    style={{ color: integrationsContent?.description_color || '#666666' }}
                  >
                    {integrationsContent?.description || 'Connect with your favorite financial tools and services seamlessly.'}
                  </p>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-14 h-14 bg-card border border-border rounded-xl flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  {integrationsContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3 text-lg w-full"
                      style={{
                        backgroundColor: integrationsContent.button_color || 'hsl(var(--primary))',
                        color: integrationsContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {integrationsContent.button_text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </AdminContentWrapper>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-8">
            Take Your Finances Anywhere
          </h2>
          <p className="font-body text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Access all your financial data on the go with our powerful mobile app. Available for iOS and Android.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="rounded-full px-8 py-3 text-lg bg-white text-purple-900 hover:bg-white/90"
            >
              Download for iOS
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 py-3 text-lg border-white text-white hover:bg-white/10"
            >
              Download for Android
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Information */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="font-bold text-xl text-gray-900">CentraBudget</span>
              </div>
              <p className="text-gray-600 text-sm mb-6 max-w-xs">
                Welcome to CentraBudget, where financial management meets simplicity and efficiency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <span className="text-white text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Home</a></li>
                <li><a href="/affiliate" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Affiliate Program</a></li>
                <li><a href="/careers" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Careers</a></li>
              </ul>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Overview</a></li>
                <li><a href="/features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Features</a></li>
                <li><a href="/integrations" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Integrations</a></li>

              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Blog</a></li>
                <li><a href="/podcast" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Podcast</a></li>
                <li><a href="/webinars" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Webinars</a></li>
                <li><a href="/press" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Press</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="/demo" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Request a Demo</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contact Us</a></li>
                <li><a href="/bug-report" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Report a Bug</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2024 All Rights Reserved
              </div>
              <div className="flex space-x-6">
                <a href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Terms & Conditions</a>
                <a href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}