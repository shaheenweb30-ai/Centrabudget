import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  BookOpen,
  Tag,
  ArrowRight,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Copy,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";

// Blog data - in a real app, this would come from an API or CMS
const blogData = [
  {
    id: 1,
    title: "10 Essential Budgeting Tips for Beginners in 2025",
    excerpt: "Master the basics of budgeting with these proven strategies that will help you take control of your finances and build wealth.",
    content: `
      <p>Budgeting is the foundation of financial success. In this comprehensive guide, we'll walk you through 10 essential budgeting tips that every beginner should know. From tracking your expenses to setting realistic goals, these strategies will help you create a sustainable budget that works for your lifestyle.</p>
      
      <h2>1. Track Every Penny</h2>
      <p>The first step to successful budgeting is understanding where your money goes. Use budgeting apps like CentraBudget to track every expense, no matter how small. This awareness is crucial for identifying spending patterns and areas where you can cut back.</p>
      
      <h2>2. Set SMART Financial Goals</h2>
      <p>Your budget should align with specific, measurable, achievable, relevant, and time-bound (SMART) financial goals. Whether it's saving for a down payment, paying off debt, or building an emergency fund, clear goals will keep you motivated.</p>
      
      <h2>3. Follow the 50/30/20 Rule</h2>
      <p>Allocate 50% of your income to needs (housing, utilities, food), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. This simple framework provides structure while maintaining flexibility.</p>
      
      <h2>4. Build an Emergency Fund First</h2>
      <p>Before focusing on other financial goals, build an emergency fund covering 3-6 months of expenses. This safety net prevents you from going into debt when unexpected expenses arise.</p>
      
      <h2>5. Use the Envelope System</h2>
      <p>For categories where you tend to overspend, use the envelope system. Allocate cash to specific spending categories and only spend what's in each envelope. This physical limitation helps control impulse spending.</p>
      
      <h2>6. Automate Your Savings</h2>
      <p>Set up automatic transfers to your savings account on payday. This "pay yourself first" approach ensures you save before you have a chance to spend the money elsewhere.</p>
      
      <h2>7. Review and Adjust Monthly</h2>
      <p>Your budget isn't set in stone. Review your spending each month and adjust categories based on your actual expenses and changing priorities. Flexibility is key to long-term success.</p>
      
      <h2>8. Use Cash for Discretionary Spending</h2>
      <p>Research shows people spend less when using cash instead of cards. Use cash for categories like entertainment and dining out to naturally limit your spending.</p>
      
      <h2>9. Plan for Irregular Expenses</h2>
      <p>Don't forget about annual or irregular expenses like insurance premiums, car maintenance, or holiday gifts. Divide these costs by 12 and save monthly to avoid financial stress.</p>
      
      <h2>10. Celebrate Small Wins</h2>
      <p>Budgeting is a marathon, not a sprint. Celebrate when you meet your savings goals or stick to your budget for a month. Positive reinforcement helps build lasting habits.</p>
      
      <h2>Getting Started with CentraBudget</h2>
      <p>CentraBudget makes implementing these budgeting tips easier than ever. Our AI-powered platform helps you categorize expenses, set realistic goals, and track your progress automatically. Start your journey to financial freedom today.</p>
    `,
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
    content: `
      <p>The 50/30/20 budget rule is a simple yet powerful framework for managing your money. This method allocates 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. We'll show you how to customize this approach for your unique financial situation.</p>
      
      <h2>Understanding the 50/30/20 Rule</h2>
      <p>The 50/30/20 rule was popularized by Senator Elizabeth Warren in her book "All Your Worth: The Ultimate Lifetime Money Plan." It's designed to be simple enough for anyone to follow while providing a solid foundation for financial health.</p>
      
      <h2>50% - Needs (Essential Expenses)</h2>
      <p>This category includes expenses you cannot live without:</p>
      <ul>
        <li>Housing (rent/mortgage, utilities)</li>
        <li>Food (groceries, not dining out)</li>
        <li>Transportation (car payment, gas, public transit)</li>
        <li>Insurance (health, auto, home)</li>
        <li>Minimum debt payments</li>
        <li>Basic clothing and healthcare</li>
      </ul>
      
      <h2>30% - Wants (Lifestyle Choices)</h2>
      <p>These are expenses that enhance your life but aren't essential:</p>
      <ul>
        <li>Dining out and entertainment</li>
        <li>Hobbies and recreation</li>
        <li>Shopping for non-essentials</li>
        <li>Streaming services and subscriptions</li>
        <li>Vacations and travel</li>
        <li>Gym memberships</li>
      </ul>
      
      <h2>20% - Savings and Debt Repayment</h2>
      <p>This category builds your financial future:</p>
      <ul>
        <li>Emergency fund contributions</li>
        <li>Retirement savings (401k, IRA)</li>
        <li>Additional debt payments beyond minimums</li>
        <li>Investment contributions</li>
        <li>Other financial goals</li>
      </ul>
      
      <h2>Customizing the 50/30/20 Rule</h2>
      <p>While the 50/30/20 rule is a great starting point, you may need to adjust based on your circumstances:</p>
      
      <h3>High-Income Earners</h3>
      <p>If you earn significantly above average, you might use 40/30/30 or even 30/30/40, allocating more to savings and investments.</p>
      
      <h3>High-Cost Areas</h3>
      <p>In expensive cities, housing might consume 60% of your income. Consider 60/25/15 or finding ways to reduce housing costs.</p>
      
      <h3>Debt Repayment Focus</h3>
      <p>If you have high-interest debt, you might use 50/20/30, reducing wants to accelerate debt payoff.</p>
      
      <h2>Implementing the 50/30/20 Budget</h2>
      <p>Follow these steps to get started:</p>
      <ol>
        <li>Calculate your after-tax monthly income</li>
        <li>Categorize all your expenses for the past 3 months</li>
        <li>Identify which expenses fall into each category</li>
        <li>Adjust your spending to match the percentages</li>
        <li>Set up automatic transfers for savings</li>
        <li>Track your progress monthly</li>
      </ol>
      
      <h2>Common Pitfalls to Avoid</h2>
      <p>Be aware of these common mistakes:</p>
      <ul>
        <li>Classifying wants as needs</li>
        <li>Forgetting irregular expenses</li>
        <li>Not adjusting for seasonal changes</li>
        <li>Being too rigid with percentages</li>
        <li>Ignoring your financial goals</li>
      </ul>
      
      <h2>Tools to Help You Succeed</h2>
      <p>CentraBudget's intelligent categorization and tracking features make implementing the 50/30/20 rule effortless. Our platform automatically sorts your expenses and provides insights to help you stay on track.</p>
    `,
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
    content: `
      <p>Investing early is one of the best decisions you can make for your financial future. This guide covers everything from choosing the right investment accounts to understanding risk tolerance and building a diversified portfolio that grows with you.</p>
      
      <h2>Why Start Investing Early?</h2>
      <p>The power of compound interest makes early investing incredibly valuable. Starting at age 25 instead of 35 can mean hundreds of thousands of dollars more in retirement, even with the same monthly contributions.</p>
      
      <h2>Understanding Your Investment Timeline</h2>
      <p>As a young professional, you have time on your side. This means you can:</p>
      <ul>
        <li>Take on more risk for potentially higher returns</li>
        <li>Recover from market downturns</li>
        <li>Benefit from compound growth over decades</li>
        <li>Make mistakes and learn without severe consequences</li>
      </ul>
      
      <h2>Building Your Investment Foundation</h2>
      <p>Before diving into investments, ensure you have:</p>
      <ol>
        <li>Emergency fund (3-6 months of expenses)</li>
        <li>High-interest debt paid off</li>
        <li>Basic insurance coverage</li>
        <li>Clear financial goals</li>
      </ol>
      
      <h2>Investment Account Types</h2>
      <h3>Employer-Sponsored Plans</h3>
      <p>Start with your 401(k) or 403(b) plan, especially if your employer offers matching contributions. This is essentially free money and should be your first priority.</p>
      
      <h3>Individual Retirement Accounts (IRAs)</h3>
      <p>Consider a Roth IRA for tax-free growth and withdrawals in retirement. Traditional IRAs offer immediate tax deductions but require paying taxes on withdrawals.</p>
      
      <h3>Taxable Investment Accounts</h3>
      <p>For goals beyond retirement, taxable accounts offer flexibility and no contribution limits.</p>
      
      <h2>Asset Allocation for Young Investors</h2>
      <p>Your age and risk tolerance should guide your asset allocation:</p>
      
      <h3>Ages 20-30: 80-90% Stocks, 10-20% Bonds</h3>
      <p>Focus on growth with a higher stock allocation. Consider international stocks for diversification.</p>
      
      <h3>Ages 30-40: 70-80% Stocks, 20-30% Bonds</h3>
      <p>Begin adding more bonds as you approach major life milestones like buying a home or starting a family.</p>
      
      <h2>Investment Strategies to Consider</h2>
      <h3>Dollar-Cost Averaging</h3>
      <p>Invest a fixed amount regularly, regardless of market conditions. This reduces the impact of market volatility and can lower your average cost per share.</p>
      
      <h3>Index Fund Investing</h3>
      <p>Low-cost index funds that track market benchmarks offer diversification and typically outperform actively managed funds over time.</p>
      
      <h3>Target-Date Funds</h3>
      <p>These funds automatically adjust your asset allocation as you age, making them perfect for hands-off investors.</p>
      
      <h2>Common Investment Mistakes to Avoid</h2>
      <ul>
        <li>Trying to time the market</li>
        <li>Investing without a plan</li>
        <li>Paying high fees</li>
        <li>Not diversifying enough</li>
        <li>Letting emotions drive decisions</li>
        <li>Ignoring tax implications</li>
      </ul>
      
      <h2>Getting Started with CentraBudget</h2>
      <p>CentraBudget helps you track your investment progress alongside your daily budgeting. Our platform provides insights into your overall financial health, helping you make informed decisions about where to allocate your money.</p>
    `,
    author: "Dr. Emily Rodriguez",
    authorTitle: "Investment Advisor & PhD in Finance",
    publishDate: "2025-01-10",
    readTime: "12 min read",
    category: "investing",
    tags: ["investing", "young professionals", "portfolio", "wealth building"],
    slug: "investment-strategies-young-professionals",
    featured: true,
    image: "/blog/investment-strategies.jpg"
  }
  // Add more articles as needed
];

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const article = blogData.find(post => post.slug === slug);
  
  useEffect(() => {
    if (!article) {
      navigate('/blog');
    }
  }, [article, navigate]);

  if (!article) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  const relatedArticles = blogData
    .filter(post => post.id !== article.id && post.category === article.category)
    .slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        {/* Back to Blog Button */}
        <div className="pt-6 pb-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/blog')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>

        {/* Article Header */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(article.publishDate)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  • {article.readTime}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                {article.excerpt}
              </p>
              
              {/* Author Info */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {article.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{article.author}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{article.authorTitle}</p>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('email')}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Mail className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8 lg:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:dark:text-gray-100 prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-strong:text-gray-900 prose-strong:dark:text-gray-100 prose-ul:text-gray-700 prose-ul:dark:text-gray-300 prose-ol:text-gray-700 prose-ol:dark:text-gray-300 prose-li:text-gray-700 prose-li:dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-gray-600 dark:text-gray-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 lg:py-24 bg-white/50 dark:bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Related Articles
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Continue your financial education with these related topics
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map(relatedArticle => (
                  <Card key={relatedArticle.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {relatedArticle.category.charAt(0).toUpperCase() + relatedArticle.category.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(relatedArticle.publishDate)}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                        {relatedArticle.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          className="group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200"
                        >
                          <Link to={`/blog/${relatedArticle.slug}`}>
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

export default BlogPost;
