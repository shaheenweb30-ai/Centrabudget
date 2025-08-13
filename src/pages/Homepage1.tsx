import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  Globe, 
  DollarSign, 
  BarChart3, 
  Play,
  CheckCircle,
  TrendingUp,
  Zap,
  Eye,
  Lock,
  Users,
  Star,
  ArrowRight,
  MessageCircle,
  FileText,
  Download,
  Upload,
  Wallet,
  Target,
  Lightbulb,
  RefreshCw,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Filter,
  Mail,
  HelpCircle,
  Building2
} from "lucide-react";
import Layout from "@/components/Layout";

export default function Homepage1() {
  const { toast } = useToast();
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Function to handle button clicks - redirect signed-in users to dashboard
  const handleButtonClick = (targetPath: string) => {
    if (user && !loading) {
      // User is signed in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User is not signed in, go to the original target path
      navigate(targetPath);
    }
  };



  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started:', formData);
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      console.log('Validation failed: Missing required fields');
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('Validation failed: Invalid email');
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    console.log('Validation passed, starting submission...');
    setIsSubmitting(true);

    try {
      // Save form submission to database
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

      if (error) {
        console.error('Error saving form submission:', error);
        throw error;
      }
      
      console.log('Database save successful, showing success message...');
      
      // Show success feedback
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
      
      console.log('Setting isSubmitted to true...');
      setIsSubmitted(true);
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        console.log('Resetting isSubmitted to false...');
        setIsSubmitted(false);
      }, 5000);
      
      // Additional console log for debugging
      console.log('Form submitted successfully:', formData);
      
    } catch (error) {
      console.error('Form submission failed:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log('Setting isSubmitting to false...');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>

      
      {/* Personalized Welcome Section for Authenticated Users */}
      {user && (
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-20 w-24 h-24 bg-white/15 rounded-full animate-bounce"></div>
          </div>
          
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
            <div className="text-center space-y-8">
              {/* Welcome Message */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {user.email?.split('@')[0]}!
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-medium leading-relaxed">
                  Ready to continue managing your finances? Here's what you can do next.
                </p>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <Link to="/dashboard">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-5 text-xl font-medium rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 border-0 min-w-[200px]">
                      <div className="flex items-center justify-center space-x-3">
                        <span>Dashboard</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </Button>
                  </div>
                </Link>
                
                <Link to="/transactions">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white px-10 py-5 text-xl font-medium rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 border-0 min-w-[200px]">
                      <div className="flex items-center justify-center space-x-3">
                        <span>Transactions</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </Button>
                  </div>
                </Link>
                
                <Link to="/settings">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Button className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-10 py-5 text-xl font-medium rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-500 border-0 min-w-[200px]">
                      <div className="flex items-center justify-center space-x-3">
                        <span>Settings</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-40 h-40 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-indigo-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-green-200 rounded-full opacity-10 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  AI-Powered Financial Control
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Smarter budgeting, powered by{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    real-time AI
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                  Track every expense, spot trends instantly, and get actionable tips—so you stay on budget, every month.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                    onClick={() => handleButtonClick('/signup')}
                  >
                    <span className="mr-2">🚀</span>
                    Start free — no card
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                    onClick={() => handleButtonClick('/pricing')}
                  >
                    <span className="mr-2">💰</span>
                    View Pricing
                  </Button>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Get set up in under 2 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Bank-level security</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - App Interface Mockup */}
            <div className="relative group">
              {/* Enhanced floating elements around the app */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full opacity-80 animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-60 animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -left-10 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-70 animate-ping shadow-lg"></div>
              <div className="absolute top-1/4 -right-12 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full opacity-50 animate-bounce shadow-lg"></div>
              <div className="absolute bottom-1/4 -left-8 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-80 animate-pulse shadow-lg"></div>
              
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-w-sm mx-auto border border-gray-200/50 group-hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 relative overflow-hidden">
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* App Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">C</span>
                    </div>
                    <div>
                       <div className="font-bold text-gray-900 text-base">CentraBudget</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        AI Budget Tracker
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                  </div>
                </div>

                {/* Wallet Card */}
                <div className="group/card bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-4 mb-4 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                          <Wallet className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-semibold">Total Balance</span>
                      </div>
                      <Eye className="w-3 h-3 opacity-70 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="text-xl font-bold mb-1">$2,847.32</div>
                    <div className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      +$234.50 this month
                    </div>
                  </div>
                </div>

                {/* Budgets Card */}
                <div className="group/card bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl p-4 mb-4 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                          <Target className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-semibold">Monthly Budget</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold mb-2">$3,200 / $4,000</div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                      <div className="bg-white h-2 rounded-full shadow-sm transition-all duration-500" style={{width: '80%'}}></div>
                    </div>
                    <div className="text-xs opacity-90 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                      80% used
                    </div>
                  </div>
                </div>

                {/* Insights Card */}
                <div className="group/card bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 rounded-xl p-4 mb-4 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-semibold">AI Insights</span>
                      </div>
                    </div>
                    <div className="text-xs opacity-90 mb-1">3 new insights today</div>
                    <div className="text-xs opacity-75 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                      Tap to view
                    </div>
                  </div>
                </div>

                {/* Feature Cards Stack */}
                <div className="space-y-3 mb-4 relative z-10">
                  {/* Netflix Card */}
                  <div className="group/card bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between transform rotate-1 hover:rotate-0 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 4h12v2H6V4zm0 4h12v2H6V8zm0 4h12v2H6v-2zm0 4h12v2H6v-2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-gray-900">Netflix</div>
                        <div className="text-xs text-gray-500">$15.99/month</div>
                      </div>
                    </div>
                    <div className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Active
                    </div>
                  </div>

                  {/* Spotify Card */}
                  <div className="group/card bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-gray-900">Spotify</div>
                        <div className="text-xs text-gray-500">$9.99/month</div>
                      </div>
                    </div>
                    <div className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Active
                    </div>
                  </div>

                  {/* Groceries Card */}
                  <div className="group/card bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between transform rotate-0.5 hover:rotate-0 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs">G</span>
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-gray-900">Groceries</div>
                        <div className="text-xs text-gray-500">$47.23 today</div>
                      </div>
                    </div>
                    <div className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-medium shadow-sm">
                      Recent
                    </div>
                  </div>
                </div>

                {/* AI Tip Bubble */}
                <div className="group bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-xl p-3 relative animate-pulse hover:animate-none transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl relative z-10">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-800 mb-0.5">AI Tip</div>
                      <div className="text-xs text-purple-700 leading-relaxed">Cut food delivery by 12% by batching orders</div>
                    </div>
                  </div>
                  {/* Enhanced animated dot */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-20 h-20 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-15 animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Trusted by Thousands
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Loved by{' '}
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  freelancers, founders, and small teams
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                 Join thousands of professionals who trust CentraBudget to manage their finances
              </p>
            </div>

            {/* Social Proof Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Freelancers Card */}
              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">Freelancers</h3>
                  <p className="text-gray-600 text-sm mb-4">Track project expenses and client payments with ease</p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Founders Card */}
              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">Founders</h3>
                  <p className="text-gray-600 text-sm mb-4">Scale your business with smart financial insights</p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Teams Card */}
              <div className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">Small Teams</h3>
                  <p className="text-gray-600 text-sm mb-4">Collaborate on budgets and track team expenses</p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Display */}
            <div className="mt-12">
              <div className="inline-flex items-center space-x-6 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">4.9/5</span>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <span className="text-gray-600 font-medium">from 2,847+ early users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              The Problem & Solution
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              You shouldn't need{' '}
              <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                spreadsheets
              </span>{' '}
              to feel in control
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Traditional financial tracking is broken. Here's what's wrong and how we fix it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1: The blind spots */}
            <Card className="group bg-white border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-300">The blind spots</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Recurring expenses, sneaky fees, and hidden charges that drain your budget without you even noticing.
                </p>
                <div className="mt-6 flex items-center text-red-500 font-medium">
                  <span className="mr-2">→</span>
                  <span>Hidden costs exposed</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: The time sink */}
            <Card className="group bg-white border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-700 transition-colors duration-300">The time sink</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Manual tracking that never stays up to date, spreadsheets that get forgotten, and insights that come too late.
                </p>
                <div className="mt-6 flex items-center text-yellow-700 font-medium">
                  <span className="mr-2">→</span>
                  <span>Automated tracking</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: The fix */}
            <Card className="group bg-white border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors duration-300">The fix</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Real-time tracking + AI insights that spot patterns, flag overspend, and give you actionable tips to stay on track.
                </p>
                <div className="mt-6 flex items-center text-green-700 font-medium">
                  <span className="mr-2">→</span>
                  <span>Smart insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
              <span className="text-gray-600 font-medium">Ready to take control?</span>
              <button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                onClick={() => handleButtonClick('/signup')}
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Empower Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50/30 to-indigo-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-15 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Financial Dashboard Mockup */}
            <div className="relative group">
              {/* Floating elements around the dashboard */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-blue-400 rounded-full opacity-70 animate-ping"></div>
              
              <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto border border-gray-100 group-hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">This Month's Overview</h3>
                    <div className="text-2xl font-bold text-gray-900">$3,247.50</div>
                    <div className="text-sm text-gray-500">of $4,000 budget</div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Groceries</span>
                        <span>$847/1200</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Dining Out</span>
                        <span>$423/500</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Entertainment</span>
                        <span>$156/300</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '52%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* Trend Line Chart */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Spending Trend</span>
                      <span className="text-green-600 font-medium">+12%</span>
                    </div>
                    <div className="flex items-end space-x-1 h-16">
                      <div className="w-3 bg-gray-300 rounded-t h-4"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-6"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-3"></div>
                      <div className="w-3 bg-blue-500 rounded-t h-12 relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          $4,239
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                      <div className="w-3 bg-gray-300 rounded-t h-7"></div>
                      <div className="w-3 bg-gray-300 rounded-t h-5"></div>
                    </div>
                  </div>

                  {/* AI Alert */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-yellow-800">AI Alert</div>
                        <div className="text-xs text-yellow-700">Dining out budget at 85% - consider reducing this week</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                    AI-Powered Insights
                  </div>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Empower your financial future—{' '}
                  <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                    without the guesswork
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  See where your money goes, in the moment. Our AI analyses patterns and flags overspend before it happens—then gives bite-sized actions to keep you on track.
                </p>
              </div>
              
              {/* Enhanced Feature Cards */}
              <div className="space-y-4">
                <div className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold">100+ Countries supported</span>
                      <p className="text-sm text-gray-600">Global financial management</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold">100+ Currencies with live FX</span>
                      <p className="text-sm text-gray-600">Real-time exchange rates</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900 font-semibold">Real-time analytics</span>
                      <p className="text-sm text-gray-600">Instant insights and trends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-15 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-200 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Simple 3-Step Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              How it{' '}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get started in minutes, not hours. Our AI does the heavy lifting so you can focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {/* Step 1 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    Create your categories
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Or start from smart templates. Our AI suggests categories based on your spending patterns.
                  </p>
                  <div className="mt-6 flex items-center justify-center text-blue-500 font-medium">
                    <span className="mr-2">→</span>
                    <span>Smart suggestions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Set budgets
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Monthly, weekly, or custom periods. Auto-refresh and adjust based on your goals.
                  </p>
                  <div className="mt-6 flex items-center justify-center text-green-700 font-medium">
                    <span className="mr-2">→</span>
                    <span>AI-powered insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Get insights
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Instant tips, alerts, and progress nudges. AI-powered recommendations that actually save you money.
                  </p>
                  <div className="mt-6 flex items-center justify-center text-purple-600 font-medium">
                    <span className="mr-2">→</span>
                    <span>AI-powered tips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
              <span className="text-gray-600 font-medium">Ready to get started?</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleButtonClick('/signup')}
                >
                  <span className="mr-2">⚡</span>
                  Start free — be done in 2 minutes
                  <span className="ml-2">→</span>
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
                  onClick={() => handleButtonClick('/pricing')}
                >
                  <span className="mr-2">💰</span>
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-white via-yellow-50/20 to-orange-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-200 rounded-full opacity-25 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-red-200 rounded-full opacity-15 animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6 border border-yellow-200">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Customer Success Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Loved by{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                freelancers and small teams
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
               See what our users are saying about their experience with CentraBudget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Testimonial 1 */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-semibold text-lg">S</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Sarah Chen</div>
                    <div className="text-sm text-gray-500">Freelance Designer</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                   "CentraBudget has completely transformed how I track my business expenses. The AI insights are incredibly accurate and have helped me save over $200/month."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">$200/month saved</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-semibold text-lg">M</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Marcus Rodriguez</div>
                    <div className="text-sm text-gray-500">Startup Founder</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  "The recurring detection feature is a game-changer. It automatically found expenses I'd forgotten about, saving me $45/month."
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-green-700 font-medium">$45/month saved</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-semibold text-lg">E</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Emma Thompson</div>
                    <div className="text-sm text-gray-500">Small Business Owner</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                  "Setup took literally 2 minutes. The multi-currency support is perfect for my international clients. Highly recommend!"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-purple-600 font-medium">2 min setup</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2,847+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">$12.5K</div>
                <div className="text-sm text-gray-600">Total Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact-section" className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-20 h-20 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-400 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-green-400 rounded-full opacity-25 animate-ping"></div>
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-indigo-400 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Get In Touch
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Have questions?{' '}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                We're here to help
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Reach out to our team for support, feature requests, or just to say hello. We typically respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="group">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg mb-4">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Send Message
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Get in
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      touch
                    </span>
                  </h3>
                  
                  {/* Success Message */}
                  {isSubmitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800">Message Sent Successfully!</h4>
                          <p className="text-sm text-green-700">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Billing Question">Billing Question</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none"
                        placeholder="Tell us how we can help you..."
                        required
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <span className="mr-2">✅</span>
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <span className="mr-2">📧</span>
                          Send Message
                          <span className="ml-2">→</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg mb-4">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Contact Info
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      We're here to
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        help
                      </span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email Support</h4>
                          <p className="text-gray-600 text-sm">support@centrabudget.com</p>
                          <p className="text-xs text-gray-500">We respond within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                          <p className="text-gray-600 text-sm">Available 9AM-6PM EST</p>
                          <p className="text-xs text-gray-500">Instant responses</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Help Center</h4>
                          <p className="text-gray-600 text-sm">help.centrabudget.com</p>
                          <p className="text-xs text-gray-500">Guides and tutorials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-xl font-bold text-purple-600 mb-1">24h</div>
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
                  <div className="text-xl font-bold text-blue-600 mb-1">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* More sections will be added here */}
    </Layout>
  );
}
