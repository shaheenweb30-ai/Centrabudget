import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-foreground">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">This Privacy Policy explains how CentraBudget collects, uses, and protects your information when you use our website and services.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Account data (name, email)</li>
                <li>Usage data (app interactions, device info)</li>
                <li>Content you provide (budgets, categories, transactions)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide and improve the service</li>
                <li>Secure accounts and prevent abuse</li>
                <li>Communicate updates and support</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
              <p className="text-muted-foreground">We do not sell your personal data. We may share limited data with processors (e.g., hosting, analytics) under strict contracts.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Security</h2>
              <p className="text-muted-foreground">We use industry-standard safeguards. No method of transmission or storage is 100% secure; we continuously improve our protections.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access, correct, or delete your data</li>
                <li>Export your data</li>
                <li>Withdraw consent for non-essential processing</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground">We retain data as long as necessary to provide the service and comply with legal obligations. You can request deletion at any time.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. International Transfers</h2>
              <p className="text-muted-foreground">Data may be processed in regions where we or our processors operate, with appropriate safeguards.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Children</h2>
              <p className="text-muted-foreground">Our services are not directed to children under 13, and we do not knowingly collect such data.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">10. Changes</h2>
              <p className="text-muted-foreground">We may update this policy. We will notify you of material changes by posting the new policy here.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
              <p className="text-muted-foreground">Questions? Contact us at privacy@centrabudget.com.</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}


