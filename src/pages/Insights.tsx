import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogActions } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Crown,
  Zap,
  Lock,
  Unlock,
  BarChart3,
  CheckCircle,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const ClearScore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPremium, setIsPremium] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpgradeClick = () => {
    toast({
      title: "Upgrade to Premium",
      description: "Unlock detailed breakdowns and advanced insights!",
    });
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
                  <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Financial Insights</h1>
          <p className="text-muted-foreground text-lg">Track your financial health with ClearScore™</p>
        </div>

          {/* ClearScore™ Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Score Display */}
                <div className="flex items-center space-x-6">
                  {/* Circular Progress */}
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="220 283"
                        strokeLinecap="round"
                        className="text-blue-600 transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">78</div>
                        <div className="text-sm text-muted-foreground">/ 100</div>
                      </div>
                    </div>
                  </div>

                  {/* Score Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-foreground">Your ClearScore™</h2>
                    </div>
                    <p className="text-muted-foreground max-w-md">
                      You're on track! Staying under budget helps improve your financial health.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-50 text-blue-600 border-blue-200 border">
                        Good
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Gold Level
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center lg:text-right">
                  {!isPremium ? (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleUpgradeClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock Breakdown →
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        See what's helping or hurting your score
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        variant="outline"
                        className="px-6 py-3 rounded-lg"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {showBreakdown ? 'Hide' : 'Show'} Breakdown
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Premium insights updated daily
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Tips to Improve Your ClearScore™
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Track Daily</h4>
                    <p className="text-sm text-muted-foreground">Log transactions consistently to build better habits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Set Realistic Budgets</h4>
                    <p className="text-sm text-muted-foreground">Create achievable spending limits for each category</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Build Emergency Fund</h4>
                    <p className="text-sm text-muted-foreground">Save 3-6 months of expenses for financial security</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent variant="info" size="md">
            <DialogHeader>
              <DialogTitle variant="info">Upgrade to Premium</DialogTitle>
              <DialogDescription>
                Unlock detailed ClearScore™ insights and advanced features
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Detailed score breakdown</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>30-day score history graph</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Personalized improvement tips</span>
                </div>
              </div>
            </DialogBody>
            <DialogActions>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Maybe Later
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setIsModalOpen(false);
          
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ClearScore;
