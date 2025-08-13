import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Clock, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally send the message
    console.log("Contact form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-6">
            We'd love to hear from you
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/80">
            Have questions? Need help? Just want to say hello? Get in touch!
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="border-2 border-gray-100 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
                    <MessageCircle className="w-4 h-4" />
                    Get in Touch
                  </div>
                  <h2 className="font-bold text-3xl text-gray-900 mb-4">
                    Send us a
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      message
                    </span>
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="font-semibold text-gray-900">
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="email" className="font-semibold text-gray-900">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message" className="font-semibold text-gray-900">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="min-h-40 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg resize-none transition-all duration-300"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
                  <MessageCircle className="w-4 h-4" />
                  We're Here to Help
                </div>
                <h2 className="font-bold text-4xl text-gray-900 mb-6">
                  Have
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    questions?
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  We're here to help! Whether you have questions about features, need technical support, or just want to share feedback, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          Email Support
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Drop us a line anytime at:
                        </p>
                        <a
                          href="mailto:hello@finsuite.com"
                          className="font-semibold text-blue-600 hover:text-blue-700 text-lg transition-colors"
                        >
                          hello@finsuite.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          Response Time
                        </h3>
                        <p className="text-gray-600">
                          We typically reply within 24 hours during business days. For urgent issues, we often respond much faster!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          What to expect
                        </h3>
                        <p className="text-gray-600">
                          Our support team is friendly, knowledgeable, and genuinely cares about helping you succeed with your budgeting goals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl p-6">
                <div className="text-center">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                    Need help getting started?
                  </h3>
                  <p className="font-body text-muted-foreground mb-4">
                    Check out our quick start guide and tutorials to get the most out of FinSuite.
                  </p>
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                    View Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Common Questions
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Quick answers to questions you might have.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  How do I reset my password?
                </h3>
                <p className="font-body text-muted-foreground">
                  Use the "Forgot Password" link on the login page, and we'll send you reset instructions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Can I import data from other apps?
                </h3>
                <p className="font-body text-muted-foreground">
                  Currently, FinSuite focuses on manual entry for maximum accuracy and awareness of your spending.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Is my financial data secure?
                </h3>
                <p className="font-body text-muted-foreground">
                  Yes! We use bank-level encryption and never store sensitive financial account information.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  Do you offer business accounts?
                </h3>
                <p className="font-body text-muted-foreground">
                  FinSuite is designed for personal budgeting. We're exploring business features for the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;