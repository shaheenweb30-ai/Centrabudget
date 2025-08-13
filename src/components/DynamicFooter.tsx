import { useFooterLinks } from "@/hooks/useFooterLinks";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function DynamicFooter() {
  const { links, loading } = useFooterLinks();

  if (loading) {
    return (
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">Loading footer...</div>
        </div>
      </footer>
    );
  }

  const companyLinks = links?.company || [];
  const productLinks = links?.product || [];
  const resourcesLinks = links?.resources || [];
  const supportLinks = links?.support || [];

  return (
    <footer className="bg-white border-t border-gray-200">
      <AdminContentWrapper 
        sectionId="footer" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        contentType="footer"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-xl text-gray-900">CentraBudget</span>
            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-xs">
              Welcome to CentraBudget, where financial management meets simplicity and efficiency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Instagram className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Twitter className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2024 All Rights Reserved
            </div>
            <div className="flex space-x-6">
              <a href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Terms & Conditions</a>
              <a href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors text-sm">Privacy Policy</a>
            </div>
          </div>
        </div>
      </AdminContentWrapper>
    </footer>
  );
}
