import { ReactNode, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "react-i18next";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPlan } from "@/hooks/useUserPlan";
import { useUpgrade } from "@/hooks/useUpgrade";
import { SubscriptionPlanPopup } from "./SubscriptionPlanPopup";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Brain,
  CreditCard,
  FileText,
  Home,
  Settings,
  User,
  HelpCircle,
  Package,
  Users,
  LogOut,
  TrendingUp,
  MessageSquare,
  Mail,
  Target,
  Menu,
  X,
  Crown,
  DollarSign,
} from "lucide-react";
import { useResponsive } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading: authLoading } = useAuth();
  const { shouldApplyDarkTheme } = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole(user);
  const { currentPlan, isLoading: planLoading } = useUserPlan();
  const { isMobile } = useResponsive();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showUpgradePopup, hideUpgradePopup, handlePlanSelection, showPlanPopup } = useUpgrade();


  // Show loading state while auth or plan is initializing
  if (authLoading || planLoading) {
    return <div>Loading...</div>;
  }

  const isActive = (path: string) => {
    // Exact match for main routes
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/transactions' && location.pathname === '/transactions') return true;
    if (path === '/categories-budget' && location.pathname === '/categories-budget') return true;
    if (path === '/ai-financial-coach' && location.pathname === '/ai-financial-coach') return true;
    if (path === '/reports' && location.pathname === '/reports') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path === '/settings' && location.pathname === '/settings') return true;
    if (path === '/subscription' && location.pathname === '/subscription') return true;

    if (path === '/help' && location.pathname === '/help') return true;
    
    // Admin routes - check if current path starts with admin and matches the specific admin section
    if (path.startsWith('/admin/')) {
      return location.pathname.startsWith(path);
    }
    
    // Default exact match
    return location.pathname === path;
  };

  // Apply dark theme class to the dashboard layout
  const dashboardClassName = shouldApplyDarkTheme() ? 'dark' : '';

  // Add a subtle indicator when sidebar is collapsed
  const sidebarCollapsedClass = "group/sidebar-wrapper";

  // Function to handle sidebar state change
  const handleSidebarStateChange = (open: boolean) => {
    // You can add additional logic here if needed
    console.log('Sidebar state changed:', open ? 'expanded' : 'collapsed');
  };

  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
  ];

  const financialNavigation = [
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Categories & Budget", href: "/categories-budget", icon: Target },
    { name: "AI Financial Coach", href: "/ai-financial-coach", icon: Brain },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const accountNavigation = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Subscription", href: "/subscription", icon: CreditCard },
  ];

  // Add upgrade option for free plan users only
  const upgradeNavigation = user && currentPlan && currentPlan === 'free' ? [
    { name: "Upgrade to Pro", href: "/pricing", icon: Crown, highlight: true }
  ] : [];

  const supportNavigation = [
    { name: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  const administrationNavigation = [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Form Submissions", href: "/settings?tab=admin", icon: MessageSquare },
    { name: "Newsletter Subscribers", href: "/settings?tab=newsletter", icon: Mail },
    { name: "Pricing Management", href: "/admin/pricing", icon: DollarSign },
    { name: "Package Descriptions", href: "/admin/package-descriptions", icon: Package },
    { name: "Plan Features", href: "/admin/plan-features", icon: Settings },
  ];


  return (
    <div className={dashboardClassName}>
      <SidebarProvider onOpenChange={handleSidebarStateChange}>
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-border bg-transparent">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2 sidebar-logo-container">
                <Logo size="sm" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <SidebarTrigger 
                className="h-8 w-8 p-0" 
                title="Toggle Sidebar (⌘+B)"
              />
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 sidebar-content">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className={`text-xs sm:text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                mainNavigation.some(item => isActive(item.href)) 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground'
              }`}>
                Main
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Financial Management */}
            <SidebarGroup>
              <SidebarGroupLabel className={`text-xs sm:text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                financialNavigation.some(item => isActive(item.href)) 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground'
              }`}>
                Financial
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {financialNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account Management */}
            <SidebarGroup>
              <SidebarGroupLabel className={`text-xs sm:text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                accountNavigation.some(item => isActive(item.href)) 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground'
              }`}>
                Account
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>

                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Upgrade to Pro - Only show for free plan users */}
            {upgradeNavigation.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs sm:text-sm font-medium px-2 py-1 text-amber-600 font-semibold">
                  Upgrade
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={showUpgradePopup}
                        className="text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border-0"
                      >
                        <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="inline">Upgrade to Pro</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Support */}
            <SidebarGroup>
              <SidebarGroupLabel className={`text-xs sm:text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                supportNavigation.some(item => isActive(item.href)) 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground'
              }`}>
                Support
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supportNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Administration - Admin Only */}
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className={`text-xs sm:text-sm font-medium px-2 py-1 transition-colors duration-200 ${
                  administrationNavigation.some(item => isActive(item.href)) 
                    ? 'text-primary font-semibold' 
                    : 'text-muted-foreground'
                }`}>
                  Administration
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {                    administrationNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                            <Link to={item.href}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="inline">{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}


          </SidebarContent>
          <SidebarFooter className="border-t border-border px-2 py-2">
            <div className="flex items-center gap-2">
              <UserProfileDropdown />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          {/* Mobile Navigation Header */}
          {isMobile && (
            <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors duration-200"
                    aria-label="Toggle mobile navigation"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Menu className="w-5 h-5 text-gray-700" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-gray-700">Dashboard</span>
                </div>
                <UserProfileDropdown />
              </div>
              
              {/* Mobile Navigation Menu */}
              {isMobileMenuOpen && (
                <div className="border-t border-gray-200/50 bg-white/98 backdrop-blur-xl">
                  <div className="px-4 py-3 space-y-2">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">Main</div>
                      {mainNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'text-primary bg-primary/10 border border-primary/20'
                              : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Financial Management */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">Financial</div>
                      {financialNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'text-primary bg-primary/10 border border-primary/20'
                              : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Account Management */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">Account</div>
                      {accountNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'text-primary bg-primary/10 border border-primary/20'
                              : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}

                        </Link>
                      ))}
                    </div>
                    
                    {/* Upgrade to Pro - Only show for free plan users */}
                    {upgradeNavigation.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-amber-600 uppercase tracking-wider px-2 py-1 font-semibold">Upgrade</div>
                        <button
                          onClick={() => {
                            showUpgradePopup();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 w-full text-left"
                        >
                          <Crown className="h-4 w-4" />
                          Upgrade to Pro
                        </button>
                      </div>
                    )}
                    
                    {/* Support */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">Support</div>
                      {supportNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? 'text-primary bg-primary/10 border border-primary/20'
                              : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    {/* Administration - Admin Only */}
                    {isAdmin && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">Administration</div>
                        {administrationNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                              isActive(item.href)
                                ? 'text-primary bg-primary/10 border border-primary/20'
                                : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    

                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Subscription Plan Selection Popup */}
      <SubscriptionPlanPopup
        isOpen={showPlanPopup}
        onClose={hideUpgradePopup}
        onSelectPlan={handlePlanSelection}
        isLoading={false}
      />
    </div>
  );
};

export default DashboardLayout;