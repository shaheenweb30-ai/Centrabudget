import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Crown, 
  Building, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Eye,
  EyeOff,
  Settings,
  Info
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface PackageDescription {
  id: string;
  plan_id: string;
  description: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

const AdminPackageDescriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [descriptions, setDescriptions] = useState<PackageDescription[]>([]);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: '',
    is_enabled: true
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'Free Plan';
      case 'pro':
        return 'Pro Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return planId;
    }
  };

  const fetchDescriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('package_descriptions')
        .select('*')
        .order('plan_id');

      if (error) {
        console.error('Error fetching package descriptions:', error);
        toast({
          title: "Fetch Error",
          description: "Failed to fetch package descriptions.",
          variant: "destructive"
        });
        return;
      }

      setDescriptions(data || []);
    } catch (err) {
      console.error('Error fetching package descriptions:', err);
      toast({
        title: "Fetch Error",
        description: "Failed to fetch package descriptions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: PackageDescription) => {
    setEditingPlan(plan.plan_id);
    setEditForm({
      description: plan.description,
      is_enabled: plan.is_enabled
    });
  };

  const handleSave = async (planId: string) => {
    if (!editForm.description.trim()) {
      toast({
        title: "Invalid Description",
        description: "Description cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('package_descriptions')
        .update({
          description: editForm.description.trim(),
          is_enabled: editForm.is_enabled,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('plan_id', planId);

      if (error) {
        console.error('Error updating package description:', error);
        throw error;
      }

      setEditingPlan(null);
      await fetchDescriptions();
      toast({
        title: "Description Updated",
        description: "Package description has been successfully updated.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update package description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPlan(null);
  };

  const handleToggleEnabled = async (planId: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('package_descriptions')
        .update({
          is_enabled: !currentEnabled,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        })
        .eq('plan_id', planId);

      if (error) {
        console.error('Error toggling package description:', error);
        throw error;
      }

      await fetchDescriptions();
      toast({
        title: "Status Updated",
        description: `Package description ${!currentEnabled ? 'enabled' : 'disabled'} successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update package description status. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchDescriptions();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading package descriptions...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Package Description Management</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Configure package descriptions and toggle their visibility on the pricing page. 
            You can edit the description text and enable/disable each package description.
          </p>
        </div>

        <div className="grid gap-6">
          {descriptions.map((plan) => (
            <Card key={plan.plan_id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${getPlanColor(plan.plan_id)}`}>
                      {getPlanIcon(plan.plan_id)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{getPlanName(plan.plan_id)}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={plan.is_enabled ? "default" : "secondary"}>
                          {plan.is_enabled ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hidden
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Last updated: {new Date(plan.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`toggle-${plan.plan_id}`} className="text-sm font-medium">
                        {plan.is_enabled ? 'Enabled' : 'Disabled'}
                      </Label>
                      <Switch
                        id={`toggle-${plan.plan_id}`}
                        checked={plan.is_enabled}
                        onCheckedChange={() => handleToggleEnabled(plan.plan_id, plan.is_enabled)}
                      />
                    </div>
                    
                    {editingPlan === plan.plan_id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(plan.plan_id)}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {saving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {editingPlan === plan.plan_id ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`description-${plan.plan_id}`} className="text-sm font-medium">
                        Package Description
                      </Label>
                      <Textarea
                        id={`description-${plan.plan_id}`}
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter package description..."
                        className="mt-2 min-h-[100px]"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {editForm.description.length}/500 characters
                        </span>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`edit-toggle-${plan.plan_id}`}
                            checked={editForm.is_enabled}
                            onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_enabled: checked }))}
                          />
                          <Label htmlFor={`edit-toggle-${plan.plan_id}`} className="text-sm">
                            Enable Description
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Current Description</Label>
                      <p className="mt-2 text-gray-600 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      {plan.is_enabled ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active on Pricing Page
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Hidden from Pricing Page
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How it works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Edit</strong> button allows you to modify the description text and toggle visibility</li>
                <li>• <strong>Toggle switch</strong> quickly enables/disables descriptions without editing</li>
                <li>• Disabled descriptions will not appear on the public pricing page</li>
                <li>• Changes are applied immediately and visible to all users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPackageDescriptions;
