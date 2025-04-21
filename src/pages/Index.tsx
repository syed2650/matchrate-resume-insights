
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="font-bold text-xl text-blue-600">Matchrate.ai</div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="text-slate-700 hover:text-blue-600">Home</a></li>
              <li><a href="#features" className="text-slate-700 hover:text-blue-600">Features</a></li>
              <li><a href="#testimonials" className="text-slate-700 hover:text-blue-600">Testimonials</a></li>
              <li><a href="#pricing" className="text-slate-700 hover:text-blue-600">Pricing</a></li>
              <li>
                <Button 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate("/review")}
                >
                  Try it now
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get brutally honest resume feedback tailored to PM roles in tech
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Upload your resume and job description. Get detailed, actionable feedback to improve your chances.
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/review")}
          >
            Try Resume Review
          </Button>

          {/* Process Steps */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Upload",
                description: "Share your resume and target job description",
              },
              {
                title: "Analyze",
                description: "Our AI reviews your materials thoroughly",
              },
              {
                title: "Get Feedback",
                description: "Receive detailed, actionable insights",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="text-blue-600 font-bold mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Powerful Resume Analysis Features</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform provides in-depth analysis to help you stand out from the competition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Keyword Analysis",
                description: "Identifies missing keywords from the job description that should be in your resume"
              },
              {
                title: "Section-by-Section Feedback",
                description: "Get targeted feedback for each section of your resume to maximize impact"
              },
              {
                title: "Bullet Point Enhancement",
                description: "Transform weak bullet points into powerful, metrics-driven statements"
              },
              {
                title: "ATS Compatibility Check",
                description: "Ensure your resume passes through Applicant Tracking Systems successfully"
              },
              {
                title: "Tone & Clarity Suggestions",
                description: "Improve the overall clarity and professional tone of your resume"
              },
              {
                title: "Hiring Manager Perspective",
                description: "Get an honest assessment of whether your resume would lead to an interview"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">What Our Users Say</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Success stories from job seekers who improved their resumes with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The keyword analysis helped me understand exactly what hiring managers were looking for. I got 3 interviews after updating my resume!",
                author: "Jessica K., Product Manager"
              },
              {
                quote: "The bullet point improvements transformed my experience section. What used to be a list of tasks is now a powerful showcase of achievements.",
                author: "Michael T., Senior PM"
              },
              {
                quote: "After two years of job searching, I finally got feedback that actually helped. Landed my dream role at a tech company within a month.",
                author: "Aisha R., Associate PM"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-8 rounded-lg">
                <p className="italic text-slate-700 mb-6">"{testimonial.quote}"</p>
                <p className="font-semibold text-slate-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Choose the plan that works for your job search needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "Free",
                features: [
                  "1 resume analysis per day",
                  "Keyword matching",
                  "Basic feedback",
                  "PDF export"
                ],
                cta: "Get Started",
                highlighted: false
              },
              {
                name: "Professional",
                price: "$19/month",
                features: [
                  "Unlimited resume analysis",
                  "Advanced feedback",
                  "Bullet point improvements",
                  "Interview probability score",
                  "Multiple resume versions"
                ],
                cta: "Go Professional",
                highlighted: true
              },
              {
                name: "Premium",
                price: "$49/month",
                features: [
                  "All Professional features",
                  "Human expert review",
                  "1-on-1 consultation call",
                  "Priority support",
                  "Interview guarantee"
                ],
                cta: "Go Premium",
                highlighted: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`${
                  plan.highlighted ? 'border-blue-600 ring-2 ring-blue-600 shadow-lg' : 'border-slate-200 shadow-sm'
                } bg-white p-8 rounded-lg border relative`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-slate-900 mb-6">{plan.price}</p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                  onClick={() => navigate("/review")}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to supercharge your job search?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Stop sending the same resume to every job application. Get tailored feedback that helps you stand out.
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg"
            onClick={() => navigate("/review")}
          >
            Try Resume Review Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Matchrate.ai</h3>
              <p className="text-slate-400">
                AI-powered resume feedback tailored to product management roles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Matchrate.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
