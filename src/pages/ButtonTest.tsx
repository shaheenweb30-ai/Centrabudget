import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ButtonTest = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Button Visibility Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test 1: Default Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Default Button</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Default Button
            </Button>
          </div>

          {/* Test 2: Debug Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Debug Button (Red)</h2>
            <Button variant="debug">
              <Plus className="w-4 h-4 mr-2" />
              Debug Button
            </Button>
          </div>

          {/* Test 3: Outline Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Outline Button</h2>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Outline Button
            </Button>
          </div>

          {/* Test 4: Custom Styled Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Custom Styled Button</h2>
            <Button 
              className="bg-red-500 text-white hover:bg-red-600 border-2 border-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Custom Button
            </Button>
          </div>

          {/* Test 5: Large Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Large Button</h2>
            <Button size="lg" variant="debug">
              <Plus className="w-4 h-4 mr-2" />
              Large Button
            </Button>
          </div>

          {/* Test 6: Inline Styles Button */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Inline Styles Button</h2>
            <button 
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '9999px',
                border: '2px solid #dc2626',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Inline Styles
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Dashboard Style Button (Original Issue)</h2>
          <Button 
            onClick={() => console.log('Button clicked')}
            className="mt-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold px-6 py-3"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Transaction (Original Style)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonTest;
