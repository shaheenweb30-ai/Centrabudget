import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Users, 
  CreditCard, 
  RefreshCw, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Clock,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-4">
              Terms of Service
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
                  Our Commitment to You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Welcome to CentraBudget. By accessing or using our services, you agree to be bound by these
                  Terms of Service. If you do not agree to these terms, please do not use the service.
                </p>
              </CardContent>
            </Card>

            {/* Use of Service Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-600" />
                  Use of the Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  You agree to use the service only for lawful purposes and in accordance with these terms. You are
                  responsible for maintaining the confidentiality of your account credentials.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Use the service for lawful purposes only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Maintain account security and confidentiality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Comply with all applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  We may offer paid subscriptions. Subscription access may be revoked if
                  abuse is detected.
                </p>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Access granted based on subscription tier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Automatic renewal unless cancelled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Abuse detection may result in access revocation</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Refunds Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                  Refunds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Payment processing will be available soon. Refunds will be available within 14 days of purchase or renewal. 
                  To request a refund, contact <span className="font-semibold text-blue-600 dark:text-blue-400">support@centrabudget.com</span> with your transaction details.
                </p>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Refund Information
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                    Our full <Link to="/refund-policy" className="underline font-semibold hover:text-green-800 dark:hover:text-green-200">Refund Policy</Link> is available at centrabudget.com/refund-policy.
                  </p>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>14-day refund window for new purchases and renewals</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Your use of the service is also governed by our Privacy Policy. Please review it to understand how
                  we collect, use, and safeguard your information.
                </p>
              </CardContent>
            </Card>

            {/* Termination Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We reserve the right to suspend or terminate access to the service at our discretion, including for
                  violations of these terms.
                </p>
              </CardContent>
            </Card>

            {/* Changes Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We may update these terms from time to time. Continued use of the service after changes constitutes
                  acceptance of the revised terms.
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
                  For questions about these Terms, please contact us via the Help page or the Contact page.
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

export default Terms;


