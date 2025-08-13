import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Shield, 
  BarChart3, 
  Twitter, 
  Linkedin, 
  Youtube,
  CheckCircle,
  ExternalLink,
  Settings,
  X,
  Sparkles,
  Heart,
  Mail,
  ArrowRight,
  Zap,
  Users,
  Star
} from 'lucide-react';



// Footer Link Component
const FooterLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
  <a 
    href={href} 
    className={`text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-1 group ${className}`}
  >
    <span className="flex items-center gap-1">
      {children}
      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </span>
  </a>
);

// Footer Section Component
const FooterSection = ({ 
  title, 
  children, 
  isExpanded = false, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isExpanded?: boolean; 
  onToggle?: () => void;
}) => (
  <div className="border-b border-gray-200/50 lg:border-b-0 group">
    <div className="flex items-center justify-between py-3 sm:py-4 lg:py-0">
      <h3 className="font-bold text-sm sm:text-base lg:text-base text-gray-900 lg:mb-4 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      {onToggle && (
        <button
          onClick={onToggle}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
          aria-expanded={isExpanded}
          aria-label={`Toggle ${title} section`}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
    <div className={`lg:block ${isExpanded ? 'block' : 'hidden'}`}>
      <div className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 lg:pb-0">
        {children}
      </div>
    </div>
  </div>
);

// Cookie Banner Component
const CookieBanner = ({ onAccept, onReject, onManage }: {
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 p-3 sm:p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-sm sm:text-base text-gray-900">Cookie Preferences</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              We use essential cookies to run CentraBudget and optional analytics to improve it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button size="sm" onClick={onAccept} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Accept all
            </Button>
            <Button size="sm" variant="outline" onClick={onReject} className="rounded-full text-xs sm:text-sm">
              Reject optional
            </Button>
            <Button size="sm" variant="ghost" onClick={onManage} className="rounded-full text-xs sm:text-sm">
              Manage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Footer Component
const Footer = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  // Toggle mobile accordion sections
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Cookie banner handlers
  const handleAcceptCookies = () => {
    localStorage.setItem('cookiePreference', 'accepted');
    setShowCookieBanner(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookiePreference', 'rejected');
    setShowCookieBanner(false);
  };

  const handleManageCookies = () => {
    // TODO: Link to cookies page
    console.log('Navigate to cookies page');
  };

  // Handle newsletter subscription
  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Newsletter subscription started:', newsletterEmail);
    
    // Basic validation
    if (!newsletterEmail) {
      console.log('Validation failed: Missing email');
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      console.log('Validation failed: Invalid email');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    console.log('Validation passed, starting subscription...');
    setIsSubscribing(true);

    try {
      // Save newsletter subscription to database
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: newsletterEmail,
          status: 'active'
        });

      if (error) {
        console.error('Error saving newsletter subscription:', error);
        throw error;
      }
      
      console.log('Database save successful, showing success message...');
      
      // Show success feedback
      toast({
        title: "Successfully Subscribed!",
        description: "You'll receive our monthly newsletter with tips and updates.",
      });
      
      // Reset form
      setNewsletterEmail('');
      console.log('Setting isSubscribed to true...');
      setIsSubscribed(true);
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        console.log('Resetting isSubscribed to false...');
        setIsSubscribed(false);
      }, 5000);
      
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('Setting isSubscribing to false...');
      setIsSubscribing(false);
    }
  };

  // Check for cookie preference on mount
  useEffect(() => {
    const cookiePreference = localStorage.getItem('cookiePreference');
    if (!cookiePreference) {
      setShowCookieBanner(true);
    }
  }, []);

  return (
    <footer className="bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 border-t border-gray-200/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-20 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <FooterSection title="Brand">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 group">
                  <img src="/assets/centrabudget-mark.svg" alt="CentraBudget" className="w-6 h-6 sm:w-8 sm:h-8" />
                  <div>
                    <span className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">CentraBudget</span>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span className="text-xs text-gray-500">AI-Powered</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Smarter budgeting with real-time AI insights.
                </p>
                
                {/* Trust Badges - Compact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>GDPR-ready & SOC 2 compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>All systems operational</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2">
                  <a href="#" className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300" aria-label="Follow us on Twitter">
                    <Twitter className="w-3 h-3" />
                  </a>
                  <a href="#" className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300" aria-label="Follow us on LinkedIn">
                    <Linkedin className="w-3 h-3" />
                  </a>
                  <a href="#" className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300" aria-label="Follow us on YouTube">
                    <Youtube className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </FooterSection>
          </div>

          {/* Product & Resources Section */}
          <div>
            <FooterSection 
              title="Product & Resources" 
              isExpanded={expandedSections.product}
              onToggle={() => toggleSection('product')}
            >
              <FooterLink href="/features">Features</FooterLink>
  
              
              <FooterLink href="/getting-started">Getting started</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </FooterSection>
          </div>

          {/* Company & Legal Section */}
          <div>
            <FooterSection 
              title="Company & Legal" 
              isExpanded={expandedSections.company}
              onToggle={() => toggleSection('company')}
            >
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy policy</FooterLink>
              <FooterLink href="/terms">Terms of service</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
            </FooterSection>
          </div>

          {/* Newsletter Section */}
          <div>
            <FooterSection 
              title="Newsletter" 
              isExpanded={expandedSections.newsletter}
              onToggle={() => toggleSection('newsletter')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Get smarter with money</span>
                </div>
                <p className="text-xs text-gray-600">
                  Monthly tips, product updates, and templates. No spam.
                </p>
                
                {/* Success Message */}
                {isSubscribed && (
                  <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 text-xs">Successfully Subscribed!</h4>
                        <p className="text-xs text-green-700">You'll receive our monthly newsletter.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleNewsletterSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-xs sm:text-sm"
                      required
                    />
                    <Button 
                      type="submit"
                      size="sm" 
                      disabled={isSubscribing}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-3 py-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubscribing ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Subscribing...
                        </>
                      ) : isSubscribed ? (
                        <>
                          <span className="mr-1">✅</span>
                          Subscribed!
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </FooterSection>
          </div>
        </div>

        {/* Locale/Preferences Row */}
        <div className="border-t border-gray-200/50 pt-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                <Globe className="w-3 h-3 text-gray-600" />
                <label className="text-xs text-gray-600 font-medium">Language:</label>
                <select className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              {/* Region */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3 text-gray-600" />
                <label className="text-xs text-gray-600 font-medium">Region:</label>
                <span className="text-xs text-gray-700 font-medium">Auto-detected</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded-lg">
              <Shield className="w-3 h-3 inline mr-1" />
              
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200/50 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>© {currentYear} CentraBudget Ltd.</span>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                <span>Lebanon</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Users className="w-3 h-3 inline mr-1" />
              Company: 12345678
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <FooterLink href="/security" className="text-gray-500 hover:text-blue-600">Security</FooterLink>
              <FooterLink href="/compliance" className="text-gray-500 hover:text-blue-600">Compliance</FooterLink>
              <FooterLink href="/privacy" className="text-gray-500 hover:text-blue-600">Privacy</FooterLink>
              <FooterLink href="/cookies" className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Cookies
              </FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <CookieBanner
          onAccept={handleAcceptCookies}
          onReject={handleRejectCookies}
          onManage={handleManageCookies}
        />
      )}
    </footer>
  );
};

export default Footer;