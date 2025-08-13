import { Button } from "@/components/ui/button";
import { Users, Building2, Home, CheckCircle, Check, Sparkles, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const USE_CASES = [
  {
    id: 'freelancers',
    title: 'Freelancers',
    icon: Users,
    description: 'Track income vs. expenses, quarterly tax estimate, recurring detection.',
    benefits: [
      'Track income vs. expenses',
      'Quarterly tax estimate',
      'Recurring detection'
    ],
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'small-teams',
    title: 'Small Teams',
    icon: Building2,
    description: 'Shared categories, approval hints, export to CSV/PDF.',
    benefits: [
      'Shared categories',
      'Approval hints',
      'Export to CSV/PDF'
    ],
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'households',
    title: 'Households',
    icon: Home,
    description: 'Multi-user budgets, category caps, friendly nudges.',
    benefits: [
      'Multi-user budgets',
      'Category caps',
      'Friendly nudges'
    ],
    color: 'text-purple-600 dark:text-purple-400'
  }
];

export function UseCases() {
  return (
    <section id="budgets" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Sparkles className="w-4 h-4" />
            Flexible Budgeting
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Built for the way you
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              budget
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a freelancer, small team, or household—we've got the perfect budgeting approach for you.
          </p>
        </div>
        
        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {USE_CASES.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <div
                key={useCase.id}
                className="group bg-white rounded-3xl p-10 border-2 border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10 shadow-lg`}>
                  <IconComponent className={`w-10 h-10 ${useCase.color}`} />
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-2xl text-gray-900 mb-6 relative z-10">
                  {useCase.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                  {useCase.description}
                </p>
                
                {/* Benefits List */}
                <ul className="space-y-4 relative z-10">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Ready to find your perfect budget approach?</span>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <ArrowRight className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Secure & Private</h4>
            <p className="text-gray-600 text-sm">Your financial data stays protected with bank-level security</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Smart Insights</h4>
            <p className="text-gray-600 text-sm">AI-powered recommendations to optimize your spending</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-gray-600 text-sm">Real-time updates and instant budget calculations</p>
          </div>
        </div>
      </div>
    </section>
  );
}
