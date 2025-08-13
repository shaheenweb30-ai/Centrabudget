import { Check, X, ChevronDown, ChevronUp, Sparkles, Trophy, Zap, Shield, ArrowRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COMPARISON_ROWS = [
  {
    feature: 'Real-time totals',
    centraBudget: true,
    spreadsheets: false,
    description: 'Instant updates vs. manual calculations'
  },
  {
    feature: 'AI recommendations',
    centraBudget: true,
    spreadsheets: false,
    description: 'Smart insights vs. no automation'
  },
  {
    feature: 'Recurring detection',
    centraBudget: true,
    spreadsheets: 'Manual formulas',
    description: 'Automatic vs. complex setup'
  },
  {
    feature: 'Multi-currency with live FX',
    centraBudget: true,
    spreadsheets: 'Manual conversions',
    description: 'Real-time rates vs. manual updates'
  },
  {
    feature: 'Secure sharing',
    centraBudget: true,
    spreadsheets: 'Error-prone links',
    description: 'Role-based access vs. basic sharing'
  },
  {
    feature: 'Changelog & status page',
    centraBudget: true,
    spreadsheets: false,
    description: 'Transparent updates vs. no visibility'
  }
];

export function ComparisonTable() {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <Trophy className="w-4 h-4" />
            Superior Features
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Why CentraBudget beats
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              spreadsheets
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop struggling with manual calculations. Get real-time insights and AI-powered recommendations.
          </p>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-2xl">
            <div className="grid grid-cols-3 bg-gradient-to-r from-gray-50 to-gray-100 p-8">
              <div className="font-bold text-xl text-gray-900">Feature</div>
              <div className="font-bold text-xl text-gray-900 text-center">Spreadsheets</div>
              <div className="font-bold text-xl text-gray-900 text-center flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                 CentraBudget
              </div>
            </div>
            
            {COMPARISON_ROWS.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 p-8 border-t border-gray-100 hover:bg-gray-50/50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <div className="font-semibold text-lg text-gray-900">
                  {row.feature}
                  <span className="block text-sm text-gray-600 mt-1">{row.description}</span>
                </div>
                <div className="flex items-center justify-center">
                  {typeof row.spreadsheets === 'boolean' ? (
                    row.spreadsheets ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                    )
                  ) : (
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{row.spreadsheets}</span>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-6">
          {COMPARISON_ROWS.map((row, index) => {
            const isExpanded = expandedRows.has(index);
            return (
              <div key={index} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleRow(index)}
                  aria-expanded={isExpanded}
                >
                  <span className="font-semibold text-lg text-gray-900">{row.feature}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{row.description}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3">Spreadsheets</div>
                        {typeof row.spreadsheets === 'boolean' ? (
                          row.spreadsheets ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                              <X className="w-5 h-5 text-red-600" />
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{row.spreadsheets}</span>
                        )}
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-1">
                           <Sparkles className="w-4 h-4 text-blue-600" />
                           CentraBudget
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Export Note */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-full shadow-lg border border-gray-200">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">
              Prefer to export? CSV/PDF always available.
            </p>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Ready to upgrade from spreadsheets?</span>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
        
        
      </div>
    </section>
  );
}
