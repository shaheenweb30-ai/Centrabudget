import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Shield, BarChart3, Globe } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  showSidePanel?: boolean;
}

const sidePanelFeatures = [
  {
    icon: BarChart3,
    title: "Real-time analytics",
    description: "Track your spending patterns with live insights"
  },
  {
    icon: Globe,
    title: "100+ currencies",
    description: "Manage finances in your preferred currency"
  },
  {
    icon: Shield,
    title: "Bank-level security",
    description: "Your data is protected with enterprise-grade encryption"
  }
];

export const AuthLayout = ({ children, showSidePanel = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 p-6 z-10">
        <div className="inline-flex items-center gap-2 text-foreground">
          <Logo size="sm" />
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Form Section */}
        <div className="relative flex-1 flex items-center justify-center p-6 overflow-hidden">
          {/* Mobile/Tablet decorative background (side panel hidden) */}
          <div className="lg:hidden absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:46px_46px]" />
            <div className="absolute top-0 right-8 w-24 h-24 bg-blue-300/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-8 w-28 h-28 bg-purple-300/10 rounded-full blur-2xl" />
          </div>
          <div className="w-full max-w-md relative z-10">
            {children}
          </div>
        </div>

        {/* Side Panel (Desktop Only) */}
        {showSidePanel && (
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 relative overflow-hidden">
          {/* Enhanced Background */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:42px_42px]" />
            {/* Radial highlights */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.14),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.10),transparent_60%)]" />
            {/* Soft glow orbs */}
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-purple-300/10 blur-3xl" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-blue-300/10 blur-2xl animate-pulse" />
          </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
              {/* AI Tip Chip */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 self-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">AI Tip</span>
              </div>

              {/* App Mockup */}
              <div className="mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-16 h-3 bg-white/20 rounded" />
                      <div className="w-8 h-3 bg-white/20 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-white/20 rounded" />
                      <div className="w-3/4 h-4 bg-white/20 rounded" />
                      <div className="w-1/2 h-4 bg-white/20 rounded" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="w-8 h-8 bg-green-400/30 rounded-lg" />
                      <div className="w-8 h-8 bg-blue-400/30 rounded-lg" />
                      <div className="w-8 h-8 bg-purple-400/30 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                {sidePanelFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-white/80 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Brand Strapline */}
      {showSidePanel && (
        <div className="lg:hidden absolute bottom-6 left-6 right-6 text-center">
          <p className="text-sm text-muted-foreground">
            Smarter budgeting, powered by real-time AI
          </p>
        </div>
      )}
    </div>
  );
};
