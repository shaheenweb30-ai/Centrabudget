import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Calendar, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Package,
  Crown,
  Building
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { usePricing } from "@/contexts/PricingContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminPricing = () => {
  const { plans, pricingConfig, isLoading, updatePricing, refreshPricing } = usePricing();
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    monthlyPrice: 0,
    yearlyPrice: 0
  });
  const [saving, setSaving] = useState(false);

  const handleEdit = (plan: any) => {
    setEditingPlan(plan.id);
    setEditForm({
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice
    });
  };

  const handleSave = async (planId: string) => {
    if (editForm.monthlyPrice < 0 || editForm.yearlyPrice < 0) {
      toast({
        title: "Invalid Prices",
        description: "Prices cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updatePricing(planId, editForm.monthlyPrice, editForm.yearlyPrice);
      setEditingPlan(null);
      toast({
        title: "Pricing Updated",
        description: "Plan pricing has been successfully updated.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update pricing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPlan(null);
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Package className="w-6 h-6 text-slate-600" />;
      case 'pro':
        return <Crown className="w-6 h-6 text-amber-500" />;
      case 'enterprise':
        return <Building className="w-6 h-6 text-blue-600" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
      case 'pro':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'enterprise':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Loading Pricing</h3>
              <p className="text-slate-600 dark:text-slate-400">Please wait while we load the pricing configuration...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Pricing Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Control subscription pricing for all plans
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={refreshPricing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  console.log('Current user:', user);
                  console.log('User metadata:', user?.user_metadata);
                  console.log('Is admin:', user?.user_metadata?.role === 'admin');
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                Debug User
              </Button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {getPlanIcon(plan.id)}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {plan.name}
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {plan.subtitle}
                        </p>
                      </div>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    {plan.isCustomPricing ? (
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {plan.customPricingText || 'Contact Us'}
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                          ${plan.monthlyPrice}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">
                          per month
                        </div>
                        {plan.yearlyPrice && plan.yearlyPrice > 0 && (
                          <div className="mt-2 text-sm">
                            <div className="text-slate-600 dark:text-slate-400">
                              ${plan.yearlyPrice} per year
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-medium">
                              Save ${((plan.monthlyPrice! * 12) - plan.yearlyPrice).toFixed(2)} annually
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Features Preview */}
                    <div>
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Key Features</h4>
                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            +{plan.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Controls */}
                    <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Pricing Control</h4>
                      
                      {plan.isCustomPricing ? (
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Custom pricing - contact sales team
                          </p>
                        </div>
                      ) : editingPlan === plan.id ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`monthly-${plan.id}`} className="text-sm">Monthly Price ($)</Label>
                            <Input
                              id={`monthly-${plan.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.monthlyPrice}
                              onChange={(e) => setEditForm(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`yearly-${plan.id}`} className="text-sm">Yearly Price ($)</Label>
                            <Input
                              id={`yearly-${plan.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.yearlyPrice}
                              onChange={(e) => setEditForm(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) || 0 }))}
                              className="h-9"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSave(plan.id)}
                              disabled={saving}
                              size="sm"
                              className="flex-1"
                            >
                              {saving ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              Save
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Monthly:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              ${plan.monthlyPrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Yearly:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              ${plan.yearlyPrice}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleEdit(plan)}
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Edit Pricing
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing History */}
          {pricingConfig.length > 0 && (
            <Card className="rounded-xl border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Pricing Update History
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Track recent pricing changes
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-600">
                        <th className="text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300">Plan</th>
                        <th className="text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Price</th>
                        <th className="text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300">Yearly Price</th>
                        <th className="text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-300">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                                             {pricingConfig.slice(0, 10).map((config) => (
                         <tr key={config.id} className="border-b border-slate-100 dark:border-slate-700">
                           <td className="py-2">
                             <Badge className={getPlanColor(config.plan_id)}>
                               {config.plan_id.charAt(0).toUpperCase() + config.plan_id.slice(1)}
                             </Badge>
                           </td>
                           <td className="py-2 text-sm text-slate-600 dark:text-slate-400">
                             ${config.monthly_price}
                           </td>
                           <td className="py-2 text-sm text-slate-600 dark:text-slate-400">
                             ${config.yearly_price}
                           </td>
                           <td className="py-2 text-sm text-slate-500 dark:text-slate-400">
                             {new Date(config.updated_at).toLocaleDateString()}
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className="rounded-xl border-0 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Pricing Management Guidelines
                  </h4>
                  <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <div>• Monthly prices should be competitive with market rates</div>
                    <div>• Yearly prices should offer 10-20% savings to encourage annual subscriptions</div>
                    <div>• Free plan pricing cannot be modified (always $0)</div>
                    <div>• Changes take effect immediately across all pages</div>
                    <div>• Consider user feedback and market research when adjusting prices</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPricing;
