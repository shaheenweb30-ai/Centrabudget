import { useEffect } from "react";
import Layout from "@/components/Layout";
import { FeaturesHero } from "@/components/FeaturesHero";
import { FeaturePillars } from "@/components/FeaturePillars";
import { ComparisonTable } from "@/components/ComparisonTable";
import { SecurityStrip } from "@/components/SecurityStrip";
import { FAQCompact } from "@/components/FAQCompact";
import { FinalCTA } from "@/components/FinalCTA";

export default function Features() {
  useEffect(() => {
    // Update page title and meta description
    document.title = "Features | CentraBudget — AI budgeting that does the hard work";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore CentraBudget features: real-time tracking, smart budgets, multi-currency, and AI insights that save you money. Start free—no card.');
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <FeaturesHero />
        <FeaturePillars />
        <ComparisonTable />
        <SecurityStrip />
        <FAQCompact />
        <FinalCTA />
      </div>
    </Layout>
  );
}