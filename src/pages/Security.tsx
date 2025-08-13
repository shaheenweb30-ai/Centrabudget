import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Key, 
  RefreshCw, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  CheckCircle,
  Clock,
  Server,
  Globe,
  Users,
  Settings,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const Security = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-4">
              Security
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
                  Your Security is Our Priority
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  At CentraBudget, we implement industry-leading security measures to protect your financial data and personal information. Our multi-layered approach ensures your data remains secure at every level.
                </p>
              </CardContent>
            </Card>

            {/* Data Encryption Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-green-600" />
                  Data Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  All data is encrypted using enterprise-grade encryption standards to ensure maximum protection.
                </p>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>AES-256 encryption for data at rest</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>TLS 1.3 encryption for data in transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>End-to-end encryption for sensitive operations</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Authentication & Access Control Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Key className="w-6 h-6 text-purple-600" />
                  Authentication & Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Multi-factor authentication and strict access controls protect your account from unauthorized access.
                </p>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <ul className="space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Multi-factor authentication (MFA) support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Role-based access control (RBAC)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Session management and timeout controls</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Security Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Server className="w-6 h-6 text-blue-600" />
                  Infrastructure Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our infrastructure is built on secure, enterprise-grade cloud platforms with continuous monitoring and threat detection.
                </p>
              </CardContent>
            </Card>

            {/* Data Privacy Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-green-600" />
                  Data Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We follow strict data privacy principles and never sell or share your personal information with third parties without your explicit consent.
                </p>
              </CardContent>
            </Card>

            {/* Compliance & Auditing Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Compliance & Auditing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Regular security audits and compliance checks ensure we maintain the highest security standards.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <ul className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Regular security assessments and penetration testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>GDPR and CCPA compliance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Continuous monitoring and incident response</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Incident Response Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  Our security team is available 24/7 to respond to any security incidents and ensure rapid resolution with minimal impact.
                </p>
              </CardContent>
            </Card>

            {/* Security Updates Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                  Security Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  We continuously update our security measures and promptly apply patches to address any vulnerabilities.
                </p>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Security Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  For security-related questions or to report a security concern, contact us at <span className="font-semibold text-blue-600 dark:text-blue-400">security@centrabudget.com</span>.
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

export default Security;
