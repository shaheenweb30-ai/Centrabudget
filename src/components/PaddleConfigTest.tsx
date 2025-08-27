import React from 'react';
import { PADDLE_CONFIG } from '@/lib/paddle-config';

const PaddleConfigTest = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Paddle Configuration Test
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Environment</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Current Environment: <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
              {PADDLE_CONFIG.environment}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product IDs</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Pro Monthly:</span>
              <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded ml-2">
                {PADDLE_CONFIG.products.pro.monthly}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Pro Yearly:</span>
              <span className="font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded ml-2">
                {PADDLE_CONFIG.products.pro.yearly}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Environment Variables Status</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">VITE_PADDLE_ENV:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_PADDLE_ENV ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_PADDLE_ENV || 'NOT_SET'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">VITE_PADDLE_PRO_MONTHLY_ID:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID || 'NOT_SET'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">VITE_PADDLE_PRO_YEARLY_ID:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                import.meta.env.VITE_PADDLE_PRO_YEARLY_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {import.meta.env.VITE_PADDLE_PRO_YEARLY_ID || 'NOT_SET'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Test URLs</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-700 dark:text-blue-300">Monthly Checkout:</span>
              <code className="block mt-1 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                /checkout?plan=pro&billing=monthly
              </code>
            </div>
            <div>
              <span className="font-medium text-blue-700 dark:text-blue-300">Yearly Checkout:</span>
              <code className="block mt-1 bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                /checkout?plan=pro&billing=yearly
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaddleConfigTest;
