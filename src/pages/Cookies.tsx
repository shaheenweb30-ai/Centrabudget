import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Cookie, 
  Eye, 
  Settings, 
  RefreshCw, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Users,
  Settings as SettingsIcon,
  Zap,
  Lock,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Cookies = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-4">
              Cookie Policy
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
                  <Cookie className="w-6 h-6 text-blue-600" />
                  Understanding Our Cookie Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  This Cookie Policy explains how CentraBudget uses cookies and similar technologies to enhance your experience, improve our services, and provide personalized content.
                </p>
              </CardContent>
            </Card>

            {/* What Are Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Database className="w-6 h-6 text-green-600" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Cookies are small text files stored on your device that help us remember your preferences and improve your experience.
                </p>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Small text files stored on your device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Help remember your preferences and settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Improve website functionality and performance</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Types of Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-purple-600" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We use different types of cookies for various purposes to provide you with the best experience.
                </p>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Essential Cookies:</strong> Required for basic website functionality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Performance Cookies:</strong> Help us understand how visitors use our site</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Functional Cookies:</strong> Remember your preferences and settings</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Essential Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                  Essential Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and user authentication.
                </p>
              </CardContent>
            </Card>

            {/* Performance Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  Performance Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </CardContent>
            </Card>

            {/* Functional Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-600" />
                  Functional Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  These cookies enable enhanced functionality and personalization, such as remembering your language preferences and login status.
                </p>
              </CardContent>
            </Card>

            {/* Cookie Management Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You have control over which cookies are stored on your device and can manage your preferences.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Browser settings to control cookie acceptance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Cookie consent banner on our website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ability to opt-out of non-essential cookies</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Cookies Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-orange-600" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Some cookies may be set by third-party services we use, such as analytics providers. These are subject to their respective privacy policies.
                </p>
              </CardContent>
            </Card>

            {/* Cookie Duration Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  How Long Cookies Last
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a specified period or until manually deleted.
                </p>
              </CardContent>
            </Card>

            {/* Updates Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                  Updates to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Questions About Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  If you have questions about our use of cookies, please contact us at <span className="font-semibold text-blue-600 dark:text-blue-400">privacy@centrabudget.com</span>.
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

export default Cookies;
