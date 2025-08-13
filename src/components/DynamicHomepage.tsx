import { useOptimizedHomepageContent } from "@/hooks/useOptimizedHomepageContent";
import { useDynamicTranslations } from "@/hooks/useDynamicTranslations";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { PageManager } from "@/components/admin/PageManager";
import { PricingCards } from "@/components/PricingCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Users, CreditCard, DollarSign, BarChart3, PieChart, Globe, Shield, MessageCircle, Send, Mail, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

import { useTranslation } from "react-i18next";
import { useResponsive } from "@/hooks/use-mobile";

export function DynamicHomepage() {
  const { t } = useTranslation();
  const { isMobile, isTablet, isSmallMobile } = useResponsive();
  const {
    content,
    loading,
    error,
    getContentBySection
  } = useOptimizedHomepageContent();
  
  const {
    getContentWithFallback
  } = useDynamicTranslations();
  
  if (loading) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">{t('common.loading')}</div>
        </div>
      </Layout>;
  }
  
  if (error) {
    return <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              CentraBudget
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t('home.hero.subtitle')}
            </p>
            <div className="text-sm text-muted-foreground">
              Data loading error - showing default content
            </div>
          </div>
        </div>
      </Layout>;
  }
  const heroContent = getContentBySection('hero');
  const empowerContent = getContentBySection('empower');
  const trackExpensesContent = getContentBySection('track-expenses');
  const integrationsContent = getContentBySection('integrations');
  const finalCtaContent = getContentBySection('final-cta');
  const mainCtaContent = getContentBySection('main-cta');
  const liveChatContent = getContentBySection('live-chat');
  const watchDemoContent = getContentBySection('watch-demo');
  const smartBudgetingContent = getContentBySection('smart-budgeting');
  const expenseTrackingContent = getContentBySection('expense-tracking');
  const analyticsContent = getContentBySection('analytics');
  const securityContent = getContentBySection('security');

  const handleButtonClick = (path: string) => {
    // Navigate to the specified path
    window.location.href = path;
  };

  return <Layout>
      {/* Hero Section */}
      <AdminContentWrapper sectionId="hero" className="relative bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 py-16 sm:py-20 md:py-24 lg:py-32 xl:py-36 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>
        
        <section className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
              <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">
                {/* Enhanced Badge */}
                <AdminContentWrapper sectionId="hero-label" className="inline-flex items-center px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {heroContent?.description || 'Finance Solutions for You'}
                  </span>
                </AdminContentWrapper>
                
                {/* Enhanced Main Headline */}
                <div className="space-y-4">
                  <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
                    <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      {heroContent?.title || 'Maximize 💰 Your Financial Potential'}
                    </span>
                  </h1>
                  
                  {/* Enhanced Subtitle */}
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {heroContent?.subtitle || 'All-in-one Financial Analytics Dashboard'}
                  </p>
                  
                  {/* Enhanced Description */}
                  <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Take control of your financial future with our comprehensive suite of tools designed for success.
                  </p>
                </div>
                
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border-0"
                    onClick={() => handleButtonClick('/signup')}
                  >
                    <span className="mr-2">🚀</span>
                    Get Started Free
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleButtonClick('/features')}
                  >
                    <span className="mr-2">✨</span>
                    Explore Features
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span>Trusted by 10,000+ users</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span>99.9% Uptime</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Right Side - Visual Element */}
              <div className="relative lg:order-2">
                <div className="relative">
                  {/* Main Card */}
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-3xl"></div>
                    <div className="relative z-10">
                      {/* Mock Dashboard Preview */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full"></div>
                          <div className="h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded-full w-3/4"></div>
                          <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full w-1/2"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg mb-2"></div>
                            <div className="h-2 bg-blue-300 rounded w-3/4"></div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg mb-2"></div>
                            <div className="h-2 bg-purple-300 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg transform rotate-12 animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl shadow-lg transform -rotate-12 animate-pulse"></div>
                  
                  {/* Connection Lines */}
                  <div className="absolute top-1/2 left-0 w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-300 transform -translate-x-full"></div>
                  <div className="absolute top-1/2 right-0 w-16 h-0.5 bg-gradient-to-r from-purple-300 to-transparent transform translate-x-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Trust Indicators Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-2xl md:text-3xl">
              <span className="text-blue-600">Trusted by</span> users across the platform
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Chrome Store */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>
              <div className="text-base font-semibold text-gray-900">Chrome Store</div>
            </div>

            {/* Producthunt */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="text-3xl font-bold text-gray-900">4.9</div>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              </div>
              <div className="text-base font-semibold text-gray-900">Producthunt</div>
            </div>

            {/* Trustpilot */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
              <div className="text-base font-semibold text-gray-900">Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Empower Section */}
      <section className="py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
              <span className="text-blue-600">Empower</span> Your Financial Future with us
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Financial Dashboard UI Mockup */}
              <div className="relative">
                <div className="bg-gray-100 rounded-3xl p-6 shadow-2xl max-w-md mx-auto">
                  {/* Balance Display */}
                  <div className="bg-primary rounded-xl p-4 mb-4">
                    <div className="text-white">
                      <div className="font-semibold mb-2">Total Expenses</div>
                      <div className="text-2xl font-bold">$9,823.28</div>
                      <div className="text-sm opacity-90">You've spent an extra $2,493 this month.</div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Send</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-7-7m7 7l7-7" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Receive</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div className="text-xs text-gray-600">Convert</div>
                    </div>
                  </div>
                  
                  {/* Bar Chart */}
                  <div className="relative">
                    <div className="flex items-end space-x-2 h-20">
                      <div className="w-4 bg-gray-300 rounded-t h-6"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-8"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-4"></div>
                      <div className="w-4 bg-gradient-to-t from-green-400 to-purple-500 rounded-t h-16 relative">
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-400 border-dashed"></div>
                      </div>
                      <div className="w-4 bg-gray-300 rounded-t h-10"></div>
                      <div className="w-4 bg-gray-300 rounded-t h-6"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0</span>
                      <span>25K</span>
                      <span>50K</span>
                      <span>75K</span>
                      <span>100K</span>
                      <span>125K</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Content */}
              <div>
                <h3 className="font-heading font-bold text-3xl mb-8">
                  Comprehensive Financial <span className="text-blue-600">Analytics</span> Dashboard
                </h3>
                <p className="font-body text-lg mb-10">
                  Gain real-time visibility into your financial performance with intuitive dashboards.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">100+ Countries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">100+ Currencies</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Real-time Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <span className="font-body text-foreground">Bank-level Security</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Keep tracking balance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Send money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Receive money easily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-body text-foreground">Convert currency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Track Expenses Section */}
      <AdminContentWrapper sectionId="track-expenses" className="py-6 bg-background">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="space-y-6 lg:space-y-8">
                  <h3 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-8">
                    {trackExpensesContent?.title || 'Track Your all the Expense Easily'}
                  </h3>
                  <p className="font-body text-lg text-muted-foreground">
                    {trackExpensesContent?.description || 'Effortlessly monitor and manage all your expenses with our intuitive tracking system.'}
                  </p>
                  {trackExpensesContent?.button_text && (
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="rounded-full px-8 py-3"
                      style={{
                        backgroundColor: trackExpensesContent.button_color || 'hsl(var(--primary))',
                        color: trackExpensesContent.button_text_color || 'hsl(var(--primary-foreground))'
                      }}
                    >
                      {trackExpensesContent.button_text}
                    </Button>
                  )}
                </div>
                <div className="relative">
                  {trackExpensesContent?.image_url && <img src={trackExpensesContent.image_url} alt="Expense tracking dashboard with pie chart and subscription management" className="w-full h-auto rounded-3xl shadow-2xl" />}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminContentWrapper>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>

      {/* Three Card CTA Section */}
      <AdminContentWrapper sectionId="main-cta" className="py-6 bg-white">
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Main CTA Card - spans full width on mobile, takes up space on desktop */}
              <div className="lg:col-span-2 mb-8 lg:mb-12">
                <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                  {/* Background mockups */}
                  <div className="absolute left-8 top-8 bottom-8 w-80 opacity-20">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-24">
                          <div className="text-xs opacity-80">Spotify</div>
                          <div className="text-sm">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-6 flex-1">
                          <div className="text-lg font-bold">$1,928.92</div>
                          <div className="text-xs opacity-80">Total Expense</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/30 rounded-2xl p-4 h-32">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-black rounded-full"></div>
                            <div className="text-xs">iCloud</div>
                          </div>
                          <div className="text-lg font-bold">$50</div>
                          <div className="text-xs opacity-80">/month</div>
                        </div>
                        <div className="bg-white/30 rounded-2xl p-4 flex-1">
                          <div className="text-sm font-semibold mb-3">Add Friends</div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 ml-auto max-w-xl">
                    <h2 className="font-heading font-bold text-4xl lg:text-5xl mb-6" style={{
                    color: mainCtaContent?.title_color || '#FFFFFF'
                  }}>
                      {mainCtaContent?.title || 'Ready to Run your Business Better with us'}
                    </h2>
                    <p className="font-body text-lg mb-10" style={{
                    color: mainCtaContent?.description_color || '#E0E7FF'
                  }}>
                      {mainCtaContent?.description || 'Welcome to FinSuite, where financial management meets simplicity and efficiency.'}
                    </p>
                    {mainCtaContent?.button_text && <Button variant="default" size="lg" className="rounded-full px-8 py-3"                     style={{
                    backgroundColor: mainCtaContent.button_color || 'hsl(var(--primary))',
                    color: mainCtaContent.button_text_color || 'hsl(var(--primary-foreground))'
                  }}>
                        {mainCtaContent.button_text}
                      </Button>}
                  </div>
                </div>
              </div>
              
              {/* Live Chat Card */}
              <AdminContentWrapper sectionId="live-chat" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white h-80 flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-6 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                        <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {liveChatContent?.title || 'Live Chat'}
                    </h3>
                    <p className="font-body text-purple-100 mb-6">
                      {liveChatContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {liveChatContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: liveChatContent.button_text_color || '#FFFFFF',
                  color: liveChatContent.button_text_color || '#FFFFFF'
                }}>
                      {liveChatContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
              
              {/* Watch Demo Card */}
              <AdminContentWrapper sectionId="watch-demo" className="lg:col-span-1">
                <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-3xl p-8 text-white h-80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">€</span>
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">£</span>
                    </div>
                  </div>
                  <div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-3xl mb-4">
                      {watchDemoContent?.title || 'Watch a Demo'}
                    </h3>
                    <p className="font-body text-green-800 mb-6">
                      {watchDemoContent?.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>
                  {watchDemoContent?.button_text && <Button variant="outline" size="lg" className="rounded-full w-fit" style={{
                  borderColor: watchDemoContent.button_text_color || '#FFFFFF',
                  color: watchDemoContent.button_text_color || '#FFFFFF'
                }}>
                      {watchDemoContent.button_text}
                    </Button>}
                </div>
              </AdminContentWrapper>
            </div>
          </div>
        </section>
      </AdminContentWrapper>
      
      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
              <DollarSign className="w-4 h-4" />
              Simple & Transparent
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and upgrade when you need more. All plans include our core features with no hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <PricingCards 
            showComparison={false}
            showFAQ={false}
            showCTA={true}
            className="mb-12"
          />
          
          {/* Additional CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              All plans include a 30-day money-back guarantee
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleButtonClick('/pricing')}
            >
              View Full Pricing Details
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6">
              We'd love to hear from you
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about CentraBudget? Need help getting started? Just want to say hello? 
              We're here to help you take control of your finances.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-2 border-gray-100 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <h3 className="font-bold text-3xl text-gray-900 mb-4">
                    Send us a
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      message
                    </span>
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="font-semibold text-gray-900">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        className="h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg transition-all duration-300"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="email" className="font-semibold text-gray-900">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message" className="font-semibold text-gray-900">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        className="min-h-40 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-lg resize-none transition-all duration-300"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-4xl text-gray-900 mb-6">
                  Have
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    questions?
                  </span>
                </h3>
                <p className="text-xl text-gray-600 mb-8">
                  We're here to help! Whether you have questions about features, need technical support, 
                  or just want to share feedback, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl text-gray-900 mb-2">
                          Email Support
                        </h4>
                        <p className="text-gray-600 mb-2">
                          Drop us a line anytime at:
                        </p>
                        <a
                          href="mailto:hello@centrabudget.com"
                          className="font-semibold text-blue-600 hover:text-blue-700 text-lg transition-colors"
                        >
                          hello@centrabudget.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl text-gray-900 mb-2">
                          Response Time
                        </h4>
                        <p className="text-gray-600">
                          We typically reply within 24 hours during business days. For urgent issues, we often respond much faster!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl text-gray-900 mb-2">
                          What to expect
                        </h4>
                        <p className="text-gray-600">
                          Our support team is friendly, knowledgeable, and genuinely cares about helping you succeed with your financial goals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="text-center">
                  <h4 className="font-heading font-bold text-2xl text-gray-900 mb-2">
                    Need help getting started?
                  </h4>
                  <p className="font-body text-gray-600 mb-4">
                    Check out our quick start guide and tutorials to get the most out of CentraBudget.
                  </p>
                  <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    View Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      


      {/* Page Manager for Admins */}
      <PageManager />
    </Layout>;
}