import React from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Clock, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 mb-4">
              Refund Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Last updated: 13 August 2025
            </p>
          </div>

          {/* Main Content */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-600" />
                Our Commitment to You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                We want you to be happy with Centrabudget. If you're not satisfied, you can request a refund within 14 days of purchase.
              </p>
            </CardContent>
          </Card>

          {/* Eligibility Section */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Applies to first-time purchases and renewals within 14 days of the charge.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>We may ask for the email used at checkout and your transaction ID.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Abusive or excessive refund requests may be declined.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What's Not Refundable Section */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                What's Not Refundable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Charges older than 14 days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Accounts found to be in breach of our Terms of Service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Any government-imposed taxes/fees collected at checkout (where applicable).</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* How to Request Section */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-600" />
                How to Request a Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 dark:text-slate-300">
                Email <span className="font-semibold text-blue-600 dark:text-blue-400">support@centrabudget.com</span> with subject "Refund request", and include:
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Your purchase email and transaction ID</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Brief reason for the request</span>
                  </li>
                </ul>
              </div>

              <p className="text-slate-700 dark:text-slate-300">
                We'll review and respond within <span className="font-semibold">3–5 business days</span>. If approved, we will process the refund to your original payment method. Timing may vary by bank/card issuer.
              </p>
            </CardContent>
          </Card>

          {/* Subscriptions Section */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-600" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cancelling stops future renewals.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>If you cancel within 14 days of a charge, you can request a refund for that charge.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Card className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-amber-800 dark:text-amber-200 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Legal Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 dark:text-amber-200">
                This policy does not reduce any rights you may have under applicable consumer laws.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <a href="mailto:support@centrabudget.com?subject=Refund request">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 px-8 py-3 rounded-full font-semibold"
            >
              <Link to="/terms">
                View Terms of Service
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
