import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, TrendingUp, Plus, Sparkles, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

type ShowcaseTab = 'overview' | 'categories' | 'budget';

const SHOWCASE_TABS = [
  {
    id: 'overview' as ShowcaseTab,
    label: 'Overview Dashboard',
    icon: BarChart3,
    content: {
      title: 'Total Spending',
      amount: '$1,247.80',
      period: 'This month',
      chart: 'overview-chart',
      categories: [
        { name: 'Dining Out', amount: '$156.80', percentage: 12.6, color: 'bg-red-500' },
        { name: 'Groceries', amount: '$89.45', percentage: 7.2, color: 'bg-green-500' },
        { name: 'Transport', amount: '$67.20', percentage: 5.4, color: 'bg-blue-500' }
      ]
    }
  },
  {
    id: 'categories' as ShowcaseTab,
    label: 'Category Drill-down',
    icon: PieChart,
    content: {
      title: 'Dining Out',
      amount: '$156.80',
      period: 'This month',
      chart: 'category-chart',
      subcategories: [
        { name: 'Restaurants', amount: '$89.45', percentage: 57.1 },
        { name: 'Coffee Shops', amount: '$34.20', percentage: 21.8 },
        { name: 'Takeaway', amount: '$33.15', percentage: 21.1 }
      ]
    }
  },
  {
    id: 'budget' as ShowcaseTab,
    label: 'Budget Progress',
    icon: TrendingUp,
    content: {
      title: 'Monthly Budget',
      amount: '$2,000',
      period: '$752.20 remaining',
      chart: 'budget-chart',
      progress: 62.4,
      status: 'On track'
    }
  }
];

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const activeContent = SHOWCASE_TABS.find(tab => tab.id === activeTab)?.content;

  const handleTabChange = (tabId: ShowcaseTab) => {
    setIsLoading(true);
    setActiveTab(tabId);
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <section id="tracking" className="py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <BarChart3 className="w-4 h-4" />
            Interactive Dashboard
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            See your money
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              clearly
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Instant totals, category splits, and trend lines—without fiddly filters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-3" role="tablist" aria-label="Dashboard views">
              {SHOWCASE_TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    className={`w-full flex items-center gap-4 p-6 rounded-2xl text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105'
                        : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
                    }`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                    <span className="font-semibold text-lg">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Right: Content Preview */}
          <div className="lg:col-span-2">
            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200/50 min-h-[500px] relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard...</p>
                  </div>
                </div>
              ) : activeContent ? (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-3xl text-gray-900 mb-2">
                        {activeContent.title}
                      </h3>
                      <p className="text-gray-600 text-lg">{activeContent.period}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-4xl text-gray-900 mb-2">
                        {activeContent.amount}
                      </div>
                      {activeContent.status && (
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          {activeContent.status}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center border border-blue-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-700 font-semibold mb-2 text-lg">Interactive Chart</p>
                    <p className="text-gray-600">
                      Real-time data visualization with hover effects
                    </p>
                  </div>
                  
                  {/* Data Details */}
                  {activeContent.categories && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-xl text-gray-900">Top Categories</h4>
                      {activeContent.categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full ${category.color} shadow-sm`}></div>
                            <span className="font-semibold text-gray-900">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{category.amount}</div>
                            <div className="text-sm text-gray-600 font-medium">{category.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Edit Button */}
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" size="lg" className="gap-3 rounded-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-3">
                      <Plus className="w-5 h-5" />
                      Quick edit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <BarChart3 className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 text-xl">No transactions yet</h3>
                      <p className="text-gray-600 mb-6">
                        Import a statement or add your first expense to see your dashboard in action.
                      </p>
                      <Link to="/signup">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <Sparkles className="w-5 h-5 mr-2" />
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
