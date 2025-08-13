import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Target,
  Calculator,
  Shield,
  Lightbulb,
  BookOpen,
  Search,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Articles", count: 12 },
    { id: "budgeting", name: "Budgeting", count: 4 },
    { id: "investing", name: "Investing", count: 3 },
    { id: "debt", name: "Debt Management", count: 2 },
    { id: "savings", name: "Savings", count: 3 }
  ];

  const articles = [
    {
      id: 1,
      title: "10 Essential Budgeting Tips for Beginners in 2025",
      excerpt: "Master the basics of budgeting with these proven strategies that will help you take control of your finances and build wealth.",
      content: "Budgeting is the foundation of financial success. In this comprehensive guide, we'll walk you through 10 essential budgeting tips that every beginner should know. From tracking your expenses to setting realistic goals, these strategies will help you create a sustainable budget that works for your lifestyle.",
      author: "Sarah Johnson",
      authorTitle: "Certified Financial Planner",
      publishDate: "2025-01-15",
      readTime: "8 min read",
      category: "budgeting",
      tags: ["budgeting", "beginners", "personal finance", "financial planning"],
      slug: "10-essential-budgeting-tips-beginners-2025",
      featured: true,
      image: "/blog/budgeting-tips.jpg"
    },
    {
      id: 2,
      title: "How to Create a 50/30/20 Budget That Actually Works",
      excerpt: "Learn the popular 50/30/20 budgeting rule and discover how to implement it effectively for long-term financial success.",
      content: "The 50/30/20 budget rule is a simple yet powerful framework for managing your money. This method allocates 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. We'll show you how to customize this approach for your unique financial situation.",
      author: "Michael Chen",
      authorTitle: "Personal Finance Expert",
      publishDate: "2025-01-12",
      readTime: "6 min read",
      category: "budgeting",
      tags: ["50-30-20", "budgeting", "savings", "debt repayment"],
      slug: "50-30-20-budget-rule-guide",
      featured: false,
      image: "/blog/50-30-20-budget.jpg"
    },
    {
      id: 3,
      title: "Smart Investment Strategies for Young Professionals",
      excerpt: "Start building wealth early with these investment strategies designed specifically for young professionals and millennials.",
      content: "Investing early is one of the best decisions you can make for your financial future. This guide covers everything from choosing the right investment accounts to understanding risk tolerance and building a diversified portfolio that grows with you.",
      author: "Dr. Emily Rodriguez",
      authorTitle: "Investment Advisor & PhD in Finance",
      publishDate: "2025-01-10",
      readTime: "12 min read",
      category: "investing",
      tags: ["investing", "young professionals", "portfolio", "wealth building"],
      slug: "investment-strategies-young-professionals",
      featured: true,
      image: "/blog/investment-strategies.jpg"
    },
    {
      id: 4,
      title: "Debt Snowball vs. Debt Avalanche: Which Method is Right for You?",
      excerpt: "Compare two popular debt repayment strategies and learn which one will help you become debt-free faster.",
      content: "When you're dealing with multiple debts, choosing the right repayment strategy can make a huge difference in your journey to financial freedom. We'll break down both the debt snowball and debt avalanche methods, helping you decide which approach fits your personality and financial goals.",
      author: "David Thompson",
      authorTitle: "Debt Management Specialist",
      publishDate: "2025-01-08",
      readTime: "7 min read",
      category: "debt",
      tags: ["debt management", "debt snowball", "debt avalanche", "financial freedom"],
      slug: "debt-snowball-vs-debt-avalanche",
      featured: false,
      image: "/blog/debt-repayment.jpg"
    },
    {
      id: 5,
      title: "Emergency Fund: How Much Should You Save and Where to Keep It",
      excerpt: "Build financial security with a proper emergency fund. Learn the optimal amount to save and the best places to store your emergency money.",
      content: "An emergency fund is your financial safety net, protecting you from unexpected expenses and life events. This comprehensive guide will help you determine how much to save, where to keep your emergency fund, and how to build it systematically.",
      author: "Lisa Wang",
      authorTitle: "Financial Security Expert",
      publishDate: "2025-01-05",
      readTime: "9 min read",
      category: "savings",
      tags: ["emergency fund", "savings", "financial security", "money management"],
      slug: "emergency-fund-guide-how-much-save",
      featured: false,
      image: "/blog/emergency-fund.jpg"
    },
    {
      id: 6,
      title: "The Complete Guide to Credit Card Rewards and Cashback",
      excerpt: "Maximize your credit card benefits with our comprehensive guide to rewards programs, cashback strategies, and avoiding common pitfalls.",
      content: "Credit cards can be powerful financial tools when used wisely. Learn how to choose the right rewards card, maximize your cashback, and avoid the traps that can lead to debt. We'll also cover strategies for building credit while earning rewards.",
      author: "James Wilson",
      authorTitle: "Credit Card Expert",
      publishDate: "2025-01-03",
      readTime: "11 min read",
      category: "budgeting",
      tags: ["credit cards", "rewards", "cashback", "credit building"],
      slug: "credit-card-rewards-cashback-guide",
      featured: false,
      image: "/blog/credit-card-rewards.jpg"
    },
    {
      id: 7,
      title: "Retirement Planning in Your 20s and 30s: It's Never Too Early",
      excerpt: "Start planning for retirement now, even if it seems far away. Early planning can make a dramatic difference in your financial future.",
      content: "Retirement planning might seem premature in your 20s and 30s, but starting early is the key to building substantial wealth. This guide covers retirement accounts, employer matches, compound interest, and strategies to maximize your retirement savings.",
      author: "Rachel Green",
      authorTitle: "Retirement Planning Specialist",
      publishDate: "2025-01-01",
      readTime: "10 min read",
      category: "investing",
      tags: ["retirement", "401k", "IRA", "compound interest", "financial planning"],
      slug: "retirement-planning-20s-30s-guide",
      featured: false,
      image: "/blog/retirement-planning.jpg"
    },
    {
      id: 8,
      title: "How to Save Money on Groceries: 15 Proven Strategies",
      excerpt: "Cut your grocery bill in half with these practical money-saving tips that don't require extreme couponing or sacrificing quality.",
      content: "Groceries are one of the biggest monthly expenses for most families. Learn how to save money on groceries without sacrificing nutrition or quality. From meal planning to smart shopping strategies, these tips will help you keep more money in your pocket.",
      author: "Maria Garcia",
      authorTitle: "Frugal Living Expert",
      publishDate: "2024-12-30",
      readTime: "8 min read",
      category: "savings",
      tags: ["groceries", "saving money", "meal planning", "frugal living"],
      slug: "save-money-groceries-15-strategies",
      featured: false,
      image: "/blog/grocery-savings.jpg"
    },
    {
      id: 9,
      title: "Understanding Your Credit Score: What It Means and How to Improve It",
      excerpt: "Demystify your credit score and learn proven strategies to improve it, opening doors to better loan terms and financial opportunities.",
      content: "Your credit score is one of the most important numbers in your financial life. This comprehensive guide explains what affects your credit score, how to check it, and proven strategies to improve it. Better credit means better loan terms and more financial opportunities.",
      author: "Kevin Martinez",
      authorTitle: "Credit Score Expert",
      publishDate: "2024-12-28",
      readTime: "9 min read",
      category: "debt",
      tags: ["credit score", "credit building", "financial health", "loan terms"],
      slug: "understanding-credit-score-improve-guide",
      featured: false,
      image: "/blog/credit-score.jpg"
    },
    {
      id: 10,
      title: "Side Hustle Ideas: 25 Ways to Earn Extra Income in 2025",
      excerpt: "Discover legitimate side hustle opportunities that can help you pay off debt, build savings, or achieve financial goals faster.",
      content: "In today's economy, having multiple income streams is more important than ever. This guide presents 25 legitimate side hustle ideas, from freelancing to online businesses, that can help you increase your income and achieve your financial goals faster.",
      author: "Amanda Foster",
      authorTitle: "Side Hustle Coach",
      publishDate: "2024-12-25",
      readTime: "14 min read",
      category: "savings",
      tags: ["side hustle", "extra income", "freelancing", "financial goals"],
      slug: "side-hustle-ideas-25-ways-earn-extra-income-2025",
      featured: false,
      image: "/blog/side-hustle.jpg"
    },
    {
      id: 11,
      title: "Tax Planning Strategies for Small Business Owners",
      excerpt: "Maximize your tax savings and avoid common mistakes with these essential tax planning strategies for entrepreneurs and small business owners.",
      content: "Small business owners face unique tax challenges and opportunities. Learn about deductions, credits, and strategies that can significantly reduce your tax burden while keeping you compliant with tax laws.",
      author: "Robert Kim",
      authorTitle: "Tax Attorney & CPA",
      publishDate: "2024-12-22",
      readTime: "13 min read",
      category: "investing",
      tags: ["tax planning", "small business", "deductions", "tax savings"],
      slug: "tax-planning-strategies-small-business-owners",
      featured: false,
      image: "/blog/tax-planning.jpg"
    },
    {
      id: 12,
      title: "Financial Independence: How to Retire Early and Live on Your Terms",
      excerpt: "Learn the principles of financial independence and early retirement, including the 4% rule, passive income strategies, and lifestyle design.",
      content: "Financial independence isn't just about retiring early—it's about having the freedom to live life on your terms. This guide covers the FIRE movement, passive income strategies, and how to design a lifestyle that aligns with your values and financial goals.",
      author: "Jennifer Lee",
      authorTitle: "FIRE Movement Expert",
      publishDate: "2024-12-20",
      readTime: "15 min read",
      category: "investing",
      tags: ["financial independence", "early retirement", "FIRE", "passive income"],
      slug: "financial-independence-early-retirement-guide",
      featured: true,
      image: "/blog/financial-independence.jpg"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400/20 rounded-full animate-bounce"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
              <BookOpen className="w-4 h-4" />
              Personal Finance Blog
            </div>
            <h1 className="font-bold text-5xl md:text-6xl mb-8 leading-tight">
              Master Your Money with
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {" "}Expert Insights
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover proven strategies, expert tips, and actionable advice to help you build wealth, manage debt, and achieve financial freedom.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/60 transition-all duration-200"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-white/30 rounded-full bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-white/60 transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-slate-800 text-white">
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Featured Articles
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Start with these essential reads that will transform your financial mindset
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredArticles.map(article => (
                  <Card key={article.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(article.publishDate)}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200"
                        >
                          <Link to={`/blog/${article.slug}`}>
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Articles */}
        <section className="py-16 lg:py-24 bg-white/50 dark:bg-slate-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                All Articles
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explore our complete collection of personal finance articles and guides
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map(article => (
                <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(article.publishDate)}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200"
                      >
                        <Link to={`/blog/${article.slug}`}>
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {regularArticles.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Updated with Financial Insights
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest personal finance tips, investment strategies, and money-saving hacks delivered to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
              />
              <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Blog;
