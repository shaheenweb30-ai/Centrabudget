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
  Plus,
  Trash2,
  GripVertical,
  X
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { usePlanFeatures } from "@/contexts/PlanFeaturesContext";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  id: string;
  plan_id: string;
  feature_text: string;
  display_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

const AdminPlanFeatures = () => {
  const { user } = useAuth();
  const { 
    features, 
    isLoading, 
    getFeaturesByPlanId, 
    updateFeature, 
    addFeature, 
    deleteFeature, 
    toggleFeature,
    reorderFeatures,
    refreshFeatures 
  } = usePlanFeatures();
  const { toast } = useToast();
  
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [addingFeature, setAddingFeature] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    feature_text: '',
    display_order: 0
  });
  const [addForm, setAddForm] = useState({
    feature_text: '',
    display_order: 0
  });
  const [saving, setSaving] = useState(false);

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

  const handleEdit = (feature: PlanFeature) => {
    setEditingFeature(feature.id);
    setEditForm({
      feature_text: feature.feature_text,
      display_order: feature.display_order
    });
  };

  const handleSave = async (featureId: string) => {
    if (!editForm.feature_text.trim()) {
      toast({
        title: "Invalid Feature",
        description: "Feature text cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updateFeature(featureId, {
        feature_text: editForm.feature_text.trim(),
        display_order: editForm.display_order
      });
      setEditingFeature(null);
      toast({
        title: "Feature Updated",
        description: "Plan feature has been successfully updated.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update plan feature. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingFeature(null);
    setAddingFeature(null);
  };

  const handleAddFeature = async (planId: string) => {
    if (!addForm.feature_text.trim()) {
      toast({
        title: "Invalid Feature",
        description: "Feature text cannot be empty.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await addFeature(planId, addForm.feature_text.trim(), addForm.display_order);
      setAddingFeature(null);
      setAddForm({ feature_text: '', display_order: 0 });
      toast({
        title: "Feature Added",
        description: "New plan feature has been successfully added.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add plan feature. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteFeature(featureId);
      toast({
        title: "Feature Deleted",
        description: "Plan feature has been successfully deleted.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete plan feature. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeature = async (featureId: string, currentEnabled: boolean) => {
    try {
      await toggleFeature(featureId, !currentEnabled);
      toast({
        title: "Status Updated",
        description: `Feature ${!currentEnabled ? 'enabled' : 'disabled'} successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update feature status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, featureId: string) => {
    e.dataTransfer.setData('text/plain', featureId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetPlanId: string) => {
    e.preventDefault();
    const draggedFeatureId = e.dataTransfer.getData('text/plain');
    
    // Get all features for the target plan
    const planFeatures = getFeaturesByPlanId(targetPlanId);
    const featureIds = planFeatures.map(f => f.id);
    
    // Add the dragged feature to the end
    if (!featureIds.includes(draggedFeatureId)) {
      featureIds.push(draggedFeatureId);
    }
    
    try {
      await reorderFeatures(targetPlanId, featureIds);
      toast({
        title: "Features Reordered",
        description: "Feature order has been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Reorder Failed",
        description: "Failed to reorder features. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading plan features...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const plans = ['free', 'pro', 'enterprise'];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Plan Features Management</h1>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Configure and manage features for each pricing plan. You can add, edit, delete, and reorder features, 
            as well as toggle their visibility on the pricing page.
          </p>
        </div>

        <div className="grid gap-8">
          {plans.map((planId) => {
            const planFeatures = getFeaturesByPlanId(planId);
            const allPlanFeatures = features.filter(f => f.plan_id === planId).sort((a, b) => a.display_order - b.display_order);
            
            return (
              <Card key={planId} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${getPlanColor(planId)}`}>
                        {getPlanIcon(planId)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{getPlanName(planId)}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            {planFeatures.length} active features
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Total: {allPlanFeatures.length} features
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => setAddingFeature(planId)}
                      disabled={addingFeature === planId}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Add Feature Form */}
                  {addingFeature === planId && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Plus className="w-5 h-5 text-green-600" />
                        <h3 className="font-medium text-green-900">Add New Feature</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`add-feature-${planId}`} className="text-sm font-medium">
                            Feature Text
                          </Label>
                          <Textarea
                            id={`add-feature-${planId}`}
                            value={addForm.feature_text}
                            onChange={(e) => setAddForm(prev => ({ ...prev, feature_text: e.target.value }))}
                            placeholder="Enter feature description..."
                            className="mt-2 min-h-[80px]"
                            maxLength={200}
                          />
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {addForm.feature_text.length}/200 characters
                            </span>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`add-order-${planId}`} className="text-sm">
                                Display Order:
                              </Label>
                              <Input
                                id={`add-order-${planId}`}
                                type="number"
                                value={addForm.display_order}
                                onChange={(e) => setAddForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                className="w-20"
                                min="1"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddFeature(planId)}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {saving ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Add Feature
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
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-3">
                    {allPlanFeatures.map((feature, index) => (
                      <div
                        key={feature.id}
                        className={`group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                          feature.is_enabled 
                            ? 'bg-white border-gray-200 hover:border-gray-300' 
                            : 'bg-gray-50 border-gray-100'
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, feature.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, planId)}
                      >
                        {/* Drag Handle */}
                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Feature Content */}
                        <div className="flex-1">
                          {editingFeature === feature.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editForm.feature_text}
                                onChange={(e) => setEditForm(prev => ({ ...prev, feature_text: e.target.value }))}
                                className="min-h-[60px]"
                                maxLength={200}
                              />
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {editForm.feature_text.length}/200 characters
                                </span>
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`edit-order-${feature.id}`} className="text-sm">
                                    Order:
                                  </Label>
                                  <Input
                                    id={`edit-order-${feature.id}`}
                                    type="number"
                                    value={editForm.display_order}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                    className="w-20"
                                    min="1"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                feature.is_enabled 
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                  : 'bg-gray-300'
                              }`}>
                                {feature.is_enabled && (
                                  <CheckCircle className="w-2.5 h-2.5 text-white" />
                                )}
                              </div>
                              <span className={`text-sm leading-relaxed ${
                                feature.is_enabled ? 'text-gray-700' : 'text-gray-500 line-through'
                              }`}>
                                {feature.feature_text}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                #{feature.display_order}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingFeature === feature.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSave(feature.id)}
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 h-8 px-2"
                              >
                                {saving ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={saving}
                                className="h-8 px-2"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Switch
                                checked={feature.is_enabled}
                                onCheckedChange={() => handleToggleFeature(feature.id, feature.is_enabled)}
                                className="scale-75"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(feature)}
                                className="h-8 px-2"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteFeature(feature.id)}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Drop Zone */}
                  <div
                    className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, planId)}
                  >
                    <p className="text-sm">Drop features here to reorder or move between plans</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">How to manage plan features</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Drag & Drop</strong>: Reorder features by dragging the grip handle</li>
                <li>• <strong>Toggle Switch</strong>: Enable/disable features quickly</li>
                <li>• <strong>Edit Button</strong>: Modify feature text and display order</li>
                <li>• <strong>Add Feature</strong>: Create new features for each plan</li>
                <li>• <strong>Delete</strong>: Remove unwanted features (cannot be undone)</li>
                <li>• <strong>Display Order</strong>: Control the sequence features appear in</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPlanFeatures;
