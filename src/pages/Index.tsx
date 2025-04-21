import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Upload & Instant Analysis",
      description: "Simply upload your resume and job description. Our AI instantly analyzes the match and provides detailed, actionable feedback.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "Section-by-Section Review",
      description: "Get comprehensive feedback on each section of your resume, identifying strengths and areas for improvement tailored to PM roles.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "Keyword Analysis",
      description: "Identify missing keywords and skills that matter most for the specific PM role you're targeting, improving your resume's relevance score.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "Professional Insights",
      description: "Receive clear, honest feedback on your resume's impact, including a final verdict on whether it would pass initial screening.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    }
  ];

  const testimonials = [
    {
      text: "The section-by-section analysis helped me understand exactly what was missing from my PM resume. After implementing the suggestions, I got more interview calls within weeks.",
      author: "Sarah Chen",
      handle: "@sarahchen_pm"
    },
    {
      text: "The keyword analysis feature is a game-changer. It helped me align my experience perfectly with the job requirements. Honest, actionable feedback that actually helps.",
      author: "Michael Ross",
      handle: "@mross_product"
    },
    {
      text: "As someone transitioning into product management, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a PM context.",
      author: "Priya Sharma",
      handle: "@priyapm"
    }
  ];

  const pricingPlans = [
    {
      name: "Personal",
      price: "29",
      description: "Perfect for job seekers actively applying to PM roles.",
      features: [
        "Resume analysis with AI feedback",
        "Keyword matching & suggestions",
        "Section-by-section review",
        "Export to PDF",
        "Basic score history",
        "Email support"
      ]
    },
    {
      name: "Premium",
      price: "99",
      description: "For serious candidates targeting top tech companies.",
      features: [
        "Everything in Personal, plus:",
        "Expert human review",
        "Premium formatting suggestions",
        "Unlimited revisions",
        "Priority support",
        "Interview preparation tips"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="py-6 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="font-bold text-2xl text-gray-900">Matchrate.ai</div>
          <nav>
            <ul className="hidden md:flex space-x-8">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li>
                <Button 
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  onClick={() => navigate("/review")}
                >
                  Try it now
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="pt-24 pb-24 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
            Get{" "}
            <AnimatedTextCycle
              words={[
                "brutally honest",
                "insightful",
                "actionable",
                "expert",
                "unbiased",
                "tailored"
              ]}
              interval={2600}
              className="text-indigo-600"
            />{" "}
            resume feedback for PM roles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Upload your resume and job description. Get detailed, actionable feedback to improve your chances.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate("/review")}
            >
              Try Resume Review
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 px-8 py-6 text-lg rounded-lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-medium text-sm mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Transform Your PM Resume</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Get detailed, actionable feedback tailored specifically for Product Management roles in tech companies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                {feature.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-medium text-sm mb-2">Success Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by aspiring<br />Product Managers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white shadow-sm">
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.handle}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to improve your PM resume?<br />Start your review today.</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get honest, detailed feedback that helps you stand out in the competitive PM job market. No fluff, just actionable insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => navigate("/review")}
            >
              Get started
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 flex items-center gap-2"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Matchrate.ai</h3>
              <p className="text-gray-600">
                AI-powered resume feedback tailored to product management roles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Matchrate.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
