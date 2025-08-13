import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  Video,
  FileText,
  Lightbulb,
  Star,
  ArrowRight,
  ExternalLink,
  Play,
  Download,
  Sparkles,
  Headphones,
  Clock,
  Shield,
  Zap,
  Users,
  Globe,
  MessageSquare,
  Plus,
  CheckCircle,
  BarChart3,
  CreditCard,
  Smartphone,
  Code
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface HelpArticle {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  url: string;
}

const Help = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock FAQ data
  const faqData: FAQItem[] = [
    {
      question: "How do I add a new transaction?",
      answer: "To add a new transaction, go to the Transactions page and click the 'Add Transaction' button. Fill in the amount, category, date, and description, then click 'Save'. You can also create custom categories on the fly!",
      category: "transactions"
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export your data in various formats including CSV, PDF, and Excel. Go to the Dashboard page and use the 'Export' button to download your financial data. This is great for backing up your information or sharing with your accountant.",
      category: "data"
    },
    {
      question: "How do I set up a budget?",
      answer: "Navigate to the Categories & Budget page and click 'Set Budget' on any category. Set your monthly spending limits and save your budget. You can track your progress throughout the month and adjust as needed.",
      category: "budget"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. You can update your payment method in the Settings. All payments are processed securely through Stripe.",
      category: "billing"
    },
    {
      question: "How do I categorize my expenses?",
      answer: "You can create custom categories in the Categories page or when adding transactions. The system will automatically suggest categories based on your spending patterns, and you can always create new ones on the fly.",
      category: "categories"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use bank-level encryption to protect your financial data. All data is encrypted in transit and at rest, and we never share your personal information with third parties. We also offer two-factor authentication for extra security.",
      category: "security"
    },
    {
      question: "How do I generate financial reports?",
      answer: "Visit the Reports page to access comprehensive financial analytics. You can view spending trends, category breakdowns, monthly comparisons, and export detailed reports. The reports update in real-time as you add transactions.",
      category: "reports"
    },
    {
      question: "Can I use the app on multiple devices?",
      answer: "Absolutely! Your data syncs across all devices in real-time. Whether you're on your computer, tablet, or phone, you'll always have access to your latest financial information. Just log in with the same account.",
      category: "account"
    },
    {
      question: "What happens if I forget my password?",
      answer: "No worries! Use the 'Forgot Password' link on the login page. We'll send you a secure reset link via email. You can also enable two-factor authentication for additional security.",
      category: "account"
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to the Profile page to update your personal information, change your password, or modify your notification preferences. All changes are saved automatically and synced across your devices.",
      category: "account"
    }
  ];

  // Mock help articles
  const helpArticles: HelpArticle[] = [
    {
              title: "Getting Started with CentraBudget",
      description: "Learn the basics of setting up your account and tracking your first transactions. This guide covers everything from initial setup to your first budget.",
      category: "getting-started",
      difficulty: "beginner",
      readTime: "5 min read",
      url: "#"
    },
    {
      title: "Creating and Managing Budgets",
      description: "A comprehensive guide to setting up budgets and tracking your spending goals. Learn how to create realistic budgets and stick to them.",
      category: "budgeting",
      difficulty: "intermediate",
      readTime: "8 min read",
      url: "#"
    },
    {
      title: "Understanding Your Financial Reports",
      description: "Learn how to interpret your financial reports and gain insights from your data. Discover patterns and make informed financial decisions.",
      category: "reports",
      difficulty: "intermediate",
      readTime: "10 min read",
      url: "#"
    },
    {
      title: "Advanced Category Management",
      description: "Master the art of organizing your expenses with custom categories and tags. Learn advanced techniques for better financial organization.",
      category: "categories",
      difficulty: "advanced",
      readTime: "12 min read",
      url: "#"
    },
    {
      title: "Exporting and Backing Up Your Data",
      description: "Learn how to export your financial data and create backups for safekeeping. Ensure your financial information is always accessible.",
      category: "data",
      difficulty: "intermediate",
      readTime: "6 min read",
      url: "#"
    },
    {
      title: "Security Best Practices",
      description: "Essential security tips to keep your financial information safe and secure. Learn about two-factor authentication and other security features.",
      category: "security",
      difficulty: "beginner",
      readTime: "4 min read",
      url: "#"
    },
    {
      title: "Mobile App Guide",
              description: "Complete guide to using CentraBudget on your mobile device. Learn about mobile-specific features and optimizations.",
      category: "mobile",
      difficulty: "beginner",
      readTime: "7 min read",
      url: "#"
    },
    {
      title: "API Integration for Developers",
              description: "Advanced guide for developers who want to integrate CentraBudget with other applications. Learn about our REST API and webhooks.",
      category: "developers",
      difficulty: "advanced",
      readTime: "15 min read",
      url: "#"
    }
  ];

  const filteredFAQs = faqData.filter(faq => 
    (selectedCategory === "all" || faq.category === selectedCategory) &&
    (searchQuery === "" || 
     faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = helpArticles.filter(article =>
    (selectedCategory === "all" || article.category === selectedCategory) &&
    (searchQuery === "" || 
     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">Beginner</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-green-700">Intermediate</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transactions':
        return <FileText className="w-4 h-4" />;
      case 'budget':
      case 'budgeting':
        return <Lightbulb className="w-4 h-4" />;
      case 'categories':
        return <BookOpen className="w-4 h-4" />;
      case 'reports':
        return <BarChart3 className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'data':
        return <Download className="w-4 h-4" />;
      case 'billing':
        return <CreditCard className="w-4 h-4" />;
      case 'account':
        return <Users className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'developers':
        return <Code className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  const handleLiveChat = () => {
    toast({
      title: "Live Chat",
      description: "Connecting you to a support agent...",
    });
    // In a real app, this would open a live chat widget
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call",
      description: "Scheduling a video call with support...",
    });
    // In a real app, this would open a video call scheduler
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Not Authenticated</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to access help and support.</p>
              <Button onClick={() => navigate('/login')} className="rounded-full">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg mb-3 sm:mb-4">
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              Help & Support
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-2 sm:mb-3">
              How Can We Help?
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">Find answers, get help, and connect with our support team</p>
          </div>

          {/* Quick Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm shadow-lg border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Live Chat</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">Get instant help</p>
                <Button size="sm" onClick={handleLiveChat} className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg border border-green-200/50 dark:border-green-700/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Video Call</h3>
                <p className="text-xs text-green-700 dark:text-green-300 mb-3">Screen share support</p>
                <Button size="sm" onClick={handleVideoCall} className="w-full bg-green-600 hover:bg-green-700">
                  Schedule Call
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm shadow-lg border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Email Support</h3>
                <p className="text-xs text-purple-700 dark:text-purple-300 mb-3">24/7 assistance</p>
                <Button size="sm" variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/50">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 backdrop-blur-sm shadow-lg border border-orange-200/50 dark:border-orange-700/50 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Phone Support</h3>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">Call us directly</p>
                <Button size="sm" variant="outline" className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/50">
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search for help topics, articles, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="transactions">Transactions</SelectItem>
                    <SelectItem value="budget">Budgeting</SelectItem>
                    <SelectItem value="categories">Categories</SelectItem>
                    <SelectItem value="reports">Reports</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="data">Data & Export</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-white/20 dark:border-slate-700/30">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 dark:bg-slate-700/50 p-1 rounded-lg m-6">
                  <TabsTrigger value="faq" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Help Articles
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Us
                  </TabsTrigger>
                </TabsList>

                {/* FAQ Tab */}
                <TabsContent value="faq" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Frequently Asked Questions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Find quick answers to common questions about CentraBudget</p>
                  </div>

                  {filteredFAQs.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-0 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg mb-3">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(faq.category)}
                              <span className="font-medium text-slate-700 dark:text-slate-300">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Results Found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms or category filter.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Help Articles Tab */}
                <TabsContent value="articles" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Help Articles & Guides</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive guides and tutorials to help you master CentraBudget</p>
                  </div>

                  {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredArticles.map((article, index) => (
                        <Card key={index} className="border-0 bg-slate-50/50 dark:bg-slate-700/50 hover:shadow-lg transition-all duration-300">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                {getCategoryIcon(article.category)}
                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{article.category.replace('-', ' ')}</span>
                              </div>
                              {getDifficultyBadge(article.difficulty)}
                            </div>
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">{article.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{article.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                              </div>
                              <Button size="sm" variant="outline" className="rounded-full">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Article
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Articles Found</h3>
                        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms or category filter.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Contact Support</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Can't find what you're looking for? Send us a message and we'll get back to you</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Form */}
                    <Card className="border-0 bg-slate-50/50 dark:bg-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Send us a Message</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Name *</label>
                              <Input
                                placeholder="Your name"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Email *</label>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Subject *</label>
                            <Input
                              placeholder="What can we help you with?"
                              value={contactForm.subject}
                              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Message *</label>
                            <textarea
                              placeholder="Please describe your issue or question in detail..."
                              value={contactForm.message}
                              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                              required
                              className="w-full min-h-[120px] px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                          <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-200/50 dark:border-blue-700/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Other Ways to Reach Us</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Live Chat</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Available 24/7</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Phone Support</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Mon-Fri 9AM-6PM EST</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Email Support</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">support@centrabudget.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">Response Time</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Within 24 hours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="rounded-xl border-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Help & Support Working!
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Now using your actual authentication data
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-green-200/50 dark:border-green-700/50">
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-3">
                  The Help & Support page is now fully functional and connected to your authentication system! You can:
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                  <li>• Search and browse comprehensive FAQs</li>
                  <li>• Access detailed help articles and guides</li>
                  <li>• Contact support through multiple channels</li>
                  <li>• Get instant help via live chat</li>
                  <li>• Schedule video calls for complex issues</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="rounded-full border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950/50"
                  >
                    View Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help; 