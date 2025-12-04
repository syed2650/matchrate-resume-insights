import { AlertCircle, Target, MessageSquare, Lightbulb, Palette, UserCheck, FileSearch, ListChecks } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    title: "Understand What's Holding Your Resume Back",
    description: "Identify weak sections, flagged issues & low-impact bullets instantly.",
    icon: <AlertCircle className="w-7 h-7 text-white" />,
    bgColor: "bg-rose-500/90"
  },
  {
    title: "Laser-Focused Keyword Matching",
    description: "Get ATS & JD keyword matching with missing skills highlighted automatically.",
    icon: <Target className="w-7 h-7 text-white" />,
    bgColor: "bg-indigo-500/90"
  },
  {
    title: "Transform Your Bullet Points",
    description: "Rewrite bullets using STAR format, measurable impact & strong action verbs.",
    icon: <MessageSquare className="w-7 h-7 text-white" />,
    bgColor: "bg-violet-500/90"
  },
  {
    title: "Expert-Level Insights",
    description: "Learn exactly what recruiters see — including formatting errors, parsing issues, weak phrases & redundancies.",
    icon: <Lightbulb className="w-7 h-7 text-white" />,
    bgColor: "bg-warm-accent/90"
  }
];

const additionalFeatures = [
  {
    title: "Colour-Coded Resume Feedback",
    description: "Easily see strengths, weaknesses & improvement areas.",
    icon: <Palette className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "Role-Specific Optimization",
    description: "Tailor your resume to any job description — instantly.",
    icon: <UserCheck className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "ATS Compatibility Check",
    description: "Detect formatting issues, missing keywords & parsing problems.",
    icon: <FileSearch className="w-6 h-6 text-warm-accent" />,
  },
  {
    title: "Missing Skills Insights",
    description: "Automatically extract missing tools, skills & competencies from the JD.",
    icon: <ListChecks className="w-6 h-6 text-warm-accent" />,
  }
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const featureElements = document.querySelectorAll('.feature-animated');
    featureElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      featureElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="features" className="py-20 md:py-28 bg-transparent" ref={featuresRef}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-left mb-16 fade-in feature-animated">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">Why Choose Matchrate</p>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text leading-tight mb-6">
            Stop Guessing <span className="text-gradient">Why You're Not</span><br className="hidden md:block" /> Getting Interviews
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            MatchRate gives you clear, actionable, AI-powered feedback built for modern job applications.
          </p>
        </div>
        
        {/* Main features - larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card group fade-in feature-animated"
              style={{ animationDelay: `${index * 100}ms` }}
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
        <div className="glassmorphism rounded-2xl p-8 md:p-12 fade-in feature-animated">
          <h3 className="text-2xl font-bold text-left mb-10">Additional Powerful Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="glassmorphism rounded-xl p-6 hover-lift"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
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
