import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useResponsive } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile, isTablet } = useResponsive();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const isHomePage = () => location.pathname === "/";

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (href: string) => {
    if (href === "/") {
      // For home page, scroll to top
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate("/");
      }
    } else if (href === "#contact") {
      // For contact, scroll to contact section
      if (isHomePage()) {
        smoothScrollTo('contact-section');
      } else {
        navigate('/');
        setTimeout(() => {
          smoothScrollTo('contact-section');
        }, 100);
      }
    } else {
      // For other pages, navigate (ScrollToTop component will handle scrolling)
      navigate(href);
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: t('common.home'), href: "/" },
    { name: t('common.features'), href: "/features" },
    { name: t('common.pricing'), href: "/pricing" },
    { name: t('common.contact'), href: "#contact" },
  ];

  return (
    <header className={`bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50 relative overflow-hidden transition-all duration-300 ${
      isScrolled ? 'shadow-2xl' : 'shadow-xl'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-purple-200 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-4 h-4 md:w-5 md:h-5 lg:w-7 lg:h-7 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <div className="group flex-shrink-0">
            <Logo size="lg" className="group-hover:scale-105 transition-transform duration-300 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <nav className="flex items-center space-x-6 xl:space-x-8 ml-8">
              {navigation.map((item) => {
                const isContact = item.href === "#contact";
                const active = !isContact && isActive(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`relative px-3 py-2 text-sm sm:text-base font-medium transition-all duration-300 rounded-lg hover:bg-gray-100/80 active:bg-gray-200/80 ${
                      active 
                        ? 'text-primary bg-primary/10' 
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    {item.name}
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tablet Navigation - Fallback for medium screens */}
          <div className="hidden md:flex lg:hidden flex-1 justify-center">
            <nav className="flex items-center space-x-4">
              {navigation.slice(0, 2).map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-100/80 active:bg-gray-200/80"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('common.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('common.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => handleNavigation("/signup")} className="px-3 py-2 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 hover:bg-gray-100/80 active:bg-gray-200/80">
                {t('common.getStarted')}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/80 active:bg-gray-200/80 transition-colors duration-200 touch-target"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl z-40">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => {
              const isContact = item.href === "#contact";
              const active = !isContact && isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 touch-target ${
                    active 
                      ? 'text-primary bg-primary/10 border border-primary/20' 
                      : 'text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/80'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            
            {/* Mobile CTA Button */}
            <div className="pt-4 border-t border-gray-200/50">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('common.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      {t('common.settings')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('common.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => handleNavigation("/signup")} className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-base hover:bg-primary/90 active:bg-primary/80 transition-colors duration-200 touch-target shadow-lg">
                  {t('common.getStarted')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

// Helper function to check if a route is active
function isActive(href: string): boolean {
  if (href === "/") {
    return window.location.pathname === "/";
  }
  return window.location.pathname.startsWith(href);
}

export default Header;