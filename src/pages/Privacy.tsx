import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Users, 
  Eye, 
  Lock, 
  RefreshCw, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Baby,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Introduction Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Your Privacy Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  This Privacy Policy explains how CentraBudget collects, uses, and protects your information when you use our website and services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Database className="w-6 h-6 text-green-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We collect information to provide and improve our services while maintaining your privacy.
                </p>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Account data (name, email)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Usage data (app interactions, device info)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Content you provide (budgets, categories, transactions)</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                  How We Use Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Your information helps us provide better services and maintain security.
                </p>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Provide and improve the service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Secure accounts and prevent abuse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Communicate updates and support</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  Data Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We do not sell your personal data. We may share limited data with processors (e.g., hosting, analytics) under strict contracts.
                </p>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-green-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We use industry-standard safeguards. No method of transmission or storage is 100% secure; we continuously improve our protections.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You have control over your personal information.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Access, correct, or delete your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Export your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Withdraw consent for non-essential processing</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We retain data as long as necessary to provide the service and comply with legal obligations. You can request deletion at any time.
                </p>
              </CardContent>
            </Card>

            {/* International Transfers Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-600" />
                  International Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Data may be processed in regions where we or our processors operate, with appropriate safeguards.
                </p>
              </CardContent>
            </Card>

            {/* Children Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Baby className="w-6 h-6 text-pink-600" />
                  Children
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our services are not directed to children under 13, and we do not knowingly collect such data.
                </p>
              </CardContent>
            </Card>

            {/* Changes Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                  Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may update this policy. We will notify you of material changes by posting the new policy here.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Questions about privacy? Contact us at <span className="font-semibold text-blue-600 dark:text-blue-400">privacy@centrabudget.com</span>.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/help">
                <Mail className="w-4 h-4 mr-2" />
                Get Help
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 px-8 py-3 rounded-full font-semibold"
            >
              <Link to="/contact">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;


