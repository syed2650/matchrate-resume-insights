
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full hero-gradient pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-warm-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-warm-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container max-w-6xl mx-auto px-4 text-center md:text-left flex flex-col items-center md:items-start relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border border-white/30 shadow-sm text-sm font-medium text-gray-600 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-warm-accent"></span>
          </span>
          Powered by GPT-4o
        </div>

        <h1 className="mb-6 text-4xl md:text-6xl font-bold text-warm-text leading-tight tracking-tight max-w-4xl">
          Is Your Resume Good Enough to <br className="hidden md:block" />
          <span className="text-gradient">Get You Interviews?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-8 font-medium">
          Upload your resume & job description — get{" "}
          <span className="inline-block align-baseline">
            <AnimatedTextCycle
              words={[
                "clear",
                "actionable",
                "honest",
                "expert",
                "insightful",
                "tailored"
              ]}
              interval={2600}
              className="text-warm-accent"
            />
          </span>{" "}
          feedback instantly.
        </p>
        
        <p className="text-md text-slate-500 max-w-2xl mb-12">
          Understand exactly why your resume isn't landing interviews — and how to fix it.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full md:w-auto">
          <Button 
            size="lg"
            className="cta-gradient hover:scale-[1.03] transition-all duration-200 text-white px-9 py-7 text-lg rounded-xl shadow-cta font-semibold"
            onClick={() => navigate("/review")}
          >
            Try Resume Feedback Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="glassmorphism hover:bg-white/80 border border-gray-200 text-gray-700 px-9 py-7 text-lg rounded-xl font-semibold transition-all hover:border-gray-300"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See How It Works
          </Button>
        </div>
        
        {/* UI Preview mockup */}
        <div className="w-full max-w-5xl mx-auto relative animate-float">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-20 h-24 bottom-0 rounded-b-xl"></div>
          
          <div className="bg-white rounded-xl shadow-premium overflow-hidden border border-slate-200/80 glassmorphism">
            <div className="w-full flex flex-col">
              {/* Mockup Header */}
              <div className="bg-slate-50 border-b border-slate-100 p-3 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="mx-auto text-xs text-slate-400">resume-feedback.matchrate.ai</div>
              </div>
              
              {/* Mockup Content */}
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4">
                  <div className="h-6 w-32 bg-slate-200 rounded-md mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                        <div className="h-4 bg-slate-200 rounded-md w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Main content */}
                <div className="p-5 flex-1">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-2">
                      <div className="h-6 w-40 bg-slate-100 rounded-md"></div>
                      <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
                    </div>
                    <div className="h-8 w-24 bg-warm-accent/20 rounded-md"></div>
                  </div>
                  
                  {/* Analysis sections */}
                  <div className="space-y-6">
                    {[1, 2].map(section => (
                      <div key={section} className="border border-slate-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                          <div className="h-5 bg-slate-100 rounded-md w-32"></div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="h-3 bg-slate-50 rounded-md w-full"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-warm-accent/10 rounded-full opacity-50 z-[-1]"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full opacity-50 z-[-1]"></div>
        </div>
      </div>
      
      {/* Built With section */}
      <div className="py-12 border-t border-gray-100/80 bg-white/70 backdrop-blur-sm mt-24">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-center text-sm uppercase tracking-wider text-gray-500 font-medium mb-8">
            Built with industry-leading technology
          </p>
          <div className="overflow-hidden">
            <div className="marquee">
              <div className="marquee-content">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-12">
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                      <span className="font-medium">GPT-4o</span>
                    </div>
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M12 2l9 4.9V17L12 22l-9-4.9V7z"/></svg>
                      </div>
                      <span className="font-medium">Lovable</span>
                    </div>
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                      </div>
                      <span className="font-medium">Supabase</span>
                    </div>
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      </div>
                      <span className="font-medium">UploadThing</span>
                    </div>
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      </div>
                      <span className="font-medium">React</span>
                    </div>
                    <div className="tech-stack-item">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"></path></svg>
                      </div>
                      <span className="font-medium">Tailwind CSS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
