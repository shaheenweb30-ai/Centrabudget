import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Users, 
  Heart, 
  Zap, 
  Globe, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Send,
  Building2,
  Lightbulb,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";
import Layout from "@/components/Layout";

const Careers = () => {
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    position: "",
    experience: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", applicationForm);
    // Reset form
    setApplicationForm({ name: "", email: "", position: "", experience: "", message: "" });
  };

  const openPositions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote / Lebanon",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our team to build beautiful, responsive user interfaces using React, TypeScript, and modern web technologies.",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote / Lebanon",
      type: "Full-time",
      experience: "3+ years",
      description: "Drive product strategy and execution for our AI-powered budgeting platform, working closely with engineering and design teams.",
      skills: ["Product Strategy", "User Research", "Agile", "Analytics"]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / Lebanon",
      type: "Full-time",
      experience: "4+ years",
      description: "Create intuitive and beautiful user experiences that make personal finance management delightful and accessible.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "Engineering",
      location: "Remote / Lebanon",
      type: "Full-time",
      experience: "3+ years",
      description: "Develop AI models and algorithms to provide intelligent financial insights and personalized recommendations.",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"]
    }
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Remote First",
      description: "Work from anywhere in the world with flexible hours"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and books"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Growth",
      description: "Rapid career advancement in a growing company"
    }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Customer First",
      description: "Everything we do is driven by our users' needs"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We embrace new ideas and creative solutions"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration",
      description: "Great products are built by great teams"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Excellence",
      description: "We strive for quality in everything we do"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-300/30 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <Briefcase className="w-4 h-4" />
            Join Our Team
          </div>
          <h1 className="font-heading font-bold text-5xl md:text-6xl mb-8 leading-tight">
            Build the future of
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              {" "}personal finance
            </span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Help millions of people take control of their money with AI-powered insights and beautiful design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              View Open Positions
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white border-2 border-white/30 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-200"
              onClick={() => document.getElementById('company-culture')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Heart className="w-5 h-5 mr-2" />
              Learn About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section id="company-culture" className="py-20 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Mission & Vision */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
              <Building2 className="w-4 h-4" />
              Our Mission
            </div>
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
              Empowering financial freedom through
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {" "}technology
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe everyone deserves access to powerful financial tools that make managing money simple, 
              insightful, and even enjoyable. Our AI-powered platform helps people make better financial decisions 
              and achieve their goals.
            </p>
          </div>

          {/* Company Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4 text-blue-600">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="text-center mb-12">
            <h3 className="font-bold text-3xl text-gray-900 mb-8">Why Work With Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl mb-4 text-green-600">
                    {benefit.icon}
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
              <Briefcase className="w-4 h-4" />
              Open Positions
            </div>
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
              Join our growing team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're looking for passionate individuals who want to make a difference in people's financial lives.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {openPositions.map((position) => (
              <Card key={position.id} className="border-2 border-gray-100 shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-2">{position.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{position.department}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {position.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {position.experience}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3"
                    onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No matching position */}
          <div className="text-center">
            <Card className="border-2 border-gray-100 shadow-lg rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl mb-4 text-purple-600">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl text-gray-900 mb-3">Don't see a perfect fit?</h3>
                <p className="text-gray-600 mb-6">
                  We're always looking for talented individuals. Send us your resume and let's discuss how you can contribute to our mission.
                </p>
                <Button 
                  variant="outline" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl px-6 py-3"
                  onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send General Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="application-form" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-24 h-24 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-6">
              <Send className="w-4 h-4" />
              Apply Now
            </div>
            <h2 className="font-bold text-4xl text-gray-900 mb-4">
              Ready to join our team?
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you within 48 hours.
            </p>
          </div>

          <Card className="border-2 border-gray-100 shadow-2xl rounded-3xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="font-semibold text-gray-900">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={applicationForm.name}
                      onChange={handleInputChange}
                      className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="font-semibold text-gray-900">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={applicationForm.email}
                      onChange={handleInputChange}
                      className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="position" className="font-semibold text-gray-900">
                      Position You're Applying For *
                    </Label>
                    <Input
                      id="position"
                      name="position"
                      type="text"
                      required
                      value={applicationForm.position}
                      onChange={handleInputChange}
                      className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                      placeholder="e.g., Senior Frontend Developer"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="experience" className="font-semibold text-gray-900">
                      Years of Experience *
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="text"
                      required
                      value={applicationForm.experience}
                      onChange={handleInputChange}
                      className="h-14 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300"
                      placeholder="e.g., 5+ years"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="message" className="font-semibold text-gray-900">
                    Why would you like to join CentraBudget? *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={applicationForm.message}
                    onChange={handleInputChange}
                    className="min-h-32 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl text-lg transition-all duration-300 resize-none"
                    placeholder="Tell us about your motivation, relevant experience, and what you can bring to our team..."
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>We'll review your application and get back to you within 48 hours.</p>
                  <p className="mt-1">Questions? Email us at <a href="mailto:careers@centrabudget.com" className="text-blue-600 hover:text-blue-700 underline">careers@centrabudget.com</a></p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Ready to Make a Difference?
          </div>
          <h2 className="font-bold text-4xl lg:text-5xl mb-6">
            Join us in revolutionizing personal finance
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be part of a team that's building tools that help millions of people achieve financial freedom.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-semibold"
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              View All Positions
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white hover:bg-white/10 hover:text-white border-2 border-white/30 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-200"
              onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Send className="w-5 h-5 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
