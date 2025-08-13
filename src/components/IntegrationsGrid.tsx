import { FileText, FileSpreadsheet, Mail, Building, Webhook, Code } from "lucide-react";

const INTEGRATIONS = [
  {
    name: 'CSV Import',
    icon: FileSpreadsheet,
    tag: 'Available',
    tagColor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  {
    name: 'PDF Statement',
    icon: FileText,
    tag: 'Beta',
    tagColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  },
  {
    name: 'Email Receipts',
    icon: Mail,
    tag: 'Coming soon',
    tagColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  },
  {
    name: 'Bank Sync',
    icon: Building,
    tag: 'Optional',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  },
  {
    name: 'Webhooks',
    icon: Webhook,
    tag: 'Pro',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  },
  {
    name: 'API',
    icon: Code,
    tag: 'Pro',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  }
];

export function IntegrationsGrid() {
  return (
    <section id="currency" className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Integrations
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
            Works with your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              workflow
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start manual, import CSVs, or add connections later. Flexible options for every user.
          </p>
        </div>
        
        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {INTEGRATIONS.map((integration, index) => {
            const IconComponent = integration.icon;
            return (
              <div
                key={integration.name}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 text-center relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                
                {/* Name */}
                <h3 className="font-semibold text-gray-900 mb-3 text-sm relative z-10">
                  {integration.name}
                </h3>
                
                {/* Tag */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${integration.tagColor} relative z-10`}>
                  {integration.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
