
import { FileText, Target, MessageSquare, CheckCircle, UserX, BarChart, Star, Lightbulb } from "lucide-react";

const features = [
  {
    title: "Understand Why You're Being Rejected",
    description: "Discover the exact reasons your resume isn't making it past ATS systems and hiring managers, with precise feedback tailored for PM roles.",
    icon: <UserX className="w-7 h-7 text-white" />,
    bgColor: "bg-rose-500/90"
  },
  {
    title: "Get Laser-Focused Keyword Matching",
    description: "Identify critical PM keywords missing from your resume and ensure your achievements align perfectly with what hiring managers are looking for.",
    icon: <Target className="w-7 h-7 text-white" />,
    bgColor: "bg-indigo-500/90"
  },
  {
    title: "Transform Your Bullet Points",
    description: "Convert weak, vague statements into powerful STAR format achievements that showcase your product thinking and quantifiable impacts.",
    icon: <MessageSquare className="w-7 h-7 text-white" />,
    bgColor: "bg-violet-500/90"
  },
  {
    title: "Receive Expert-Level PM Insights",
    description: "Get feedback based on actual PM hiring practices from FAANG and top startups, helping you showcase leadership abilities that stand out.",
    icon: <Lightbulb className="w-7 h-7 text-white" />,
    bgColor: "bg-warm-accent/90"
  }
];

const additionalFeatures = [
  {
    title: "Relevance Score",
    description: "See exactly how well your resume matches the job requirements with our proprietary scoring algorithm.",
    icon: <BarChart className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "Section-by-Section Analysis",
    description: "Get detailed feedback on every component of your resume, from summary to skills to work experience.",
    icon: <FileText className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "Interview Readiness Rating",
    description: "Know immediately if your resume is ready to submit or needs critical improvements first.",
    icon: <CheckCircle className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "Role-Specific Optimization",
    description: "Tailor your resume for different company types from startups to enterprise with our sector selection.",
    icon: <Star className="w-6 h-6 text-warm-accent" />,
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-transparent">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">Why Choose Matchrate</p>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text leading-tight mb-6">
            Stop Guessing <span className="text-gradient">Why You're Not</span><br className="hidden md:block" /> Getting Interviews
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Our AI-powered tool provides detailed, actionable feedback specifically designed 
            for Product Management roles, helping you land more interviews.
          </p>
        </div>
        
        {/* Main features - larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group"
            >
              <div className="flex gap-6 items-start">
                <div className={`icon-circle ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-warm-text mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Secondary features - smaller cards */}
        <div className="bg-warm-section rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-10">Additional Powerful Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-premium-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-warm-accent/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
