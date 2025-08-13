import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none">
              <h3>1. Introduction</h3>
              <p>
                Welcome to CentraBudget. By accessing or using our services, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use the service.
              </p>

              <h3>2. Use of the Service</h3>
              <p>
                You agree to use the service only for lawful purposes and in accordance with these terms. You are
                responsible for maintaining the confidentiality of your account credentials.
              </p>

                          <h3>3. Subscriptions</h3>
            <p>
              We may offer paid subscriptions. Subscription access may be revoked if
                abuse is detected.
              </p>

              <h3>4. Privacy</h3>
              <p>
                Your use of the service is also governed by our Privacy Policy. Please review it to understand how
                we collect, use, and safeguard your information.
              </p>

              <h3>5. Termination</h3>
              <p>
                We reserve the right to suspend or terminate access to the service at our discretion, including for
                violations of these terms.
              </p>

              <h3>6. Changes</h3>
              <p>
                We may update these terms from time to time. Continued use of the service after changes constitutes
                acceptance of the revised terms.
              </p>

              <h3>7. Contact</h3>
              <p>
                For questions about these Terms, please contact us via the Help page or the Contact page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;


