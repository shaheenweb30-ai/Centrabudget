import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { PADDLE_CONFIG } from '@/lib/paddle-config';

export const PaddleDebug: React.FC = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    return null; // Only show in development
  }

  const monthlyId = import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID;
  const yearlyId = import.meta.env.VITE_PADDLE_PRO_YEARLY_ID;
  const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
  const environment = import.meta.env.VITE_PADDLE_ENV;

  const getStatusIcon = (value: string | undefined, expected: string) => {
    if (!value) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (value.includes('placeholder')) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (value.startsWith('pri_') || value.startsWith('ppri_')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Info className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusColor = (value: string | undefined, expected: string) => {
    if (!value) return 'bg-red-100 text-red-800';
    if (value.includes('placeholder')) return 'bg-red-100 text-red-800';
    if (value.startsWith('pri_') || value.startsWith('ppri_')) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Paddle Configuration Debug (Dev Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Environment:</span>
              <Badge variant="outline">{environment || 'NOT_SET'}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Client Token:</span>
              <Badge variant="outline">{clientToken ? 'SET' : 'NOT_SET'}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Monthly ID:</span>
              {getStatusIcon(monthlyId, 'pri_')}
              <Badge className={getStatusColor(monthlyId, 'pri_')}>
                {monthlyId || 'NOT_SET'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Yearly ID:</span>
              {getStatusIcon(yearlyId, 'pri_')}
              <Badge className={getStatusColor(yearlyId, 'pri_')}>
                {yearlyId || 'NOT_SET'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
          <strong>Note:</strong> This debug info is only visible in development mode. 
          Check the browser console for detailed Paddle initialization logs.
        </div>
      </CardContent>
    </Card>
  );
};
