import React, { useState } from 'react';
import Footer from './Footer';

const FooterPreview = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Footer Preview Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCookieBanner(!showCookieBanner)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showCookieBanner ? 'Hide' : 'Show'} Cookie Banner
            </button>
            <div className="text-sm text-gray-600">
              Toggle cookie banner to test different states
            </div>
          </div>
        </div>
      </div>

      {/* Footer Demo */}
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default FooterPreview;
