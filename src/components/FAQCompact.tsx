import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ_ITEMS = [
  {
    question: "Do I need to connect a bank?",
    answer: "No. Manual entry and CSV imports work great. Connections are optional."
  },
  {
    question: "How do AI insights work?",
    answer: "We analyse spend patterns and budgets to surface timely, contextual tips."
  },
  {
    question: "Is my data private?",
    answer: "Yes. We apply strict encryption and never sell personal data."
  },
  {
    question: "Do you support multiple currencies?",
    answer: "Yes—100+ currencies with live FX when needed."
  },
  {
    question: "Can I export my data?",
    answer: "Any time. CSV/PDF exports are available."
  },
  {
    
    answer: "Yes. Start free—no card required."
  }
];

export function FAQCompact() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <HelpCircle className="w-4 h-4" />
            Common Questions
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about CentraBudget. Can't find what you're looking for?
          </p>
        </div>
        
        {/* FAQ Accordion */}
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, index) => {
            const isExpanded = expandedItems.has(index);
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <button
                  className="w-full p-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isExpanded}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Click to {isExpanded ? 'hide' : 'show'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-8 pb-8 border-t border-gray-100"
                  >
                    <div className="pt-6">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Contact CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-gray-600 font-medium">Still have questions?</span>
            <Link to="/contact">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
