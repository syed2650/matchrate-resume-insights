
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { ArrowRight, Target } from "lucide-react";

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
            className="border-2 border-warm-accent text-warm-accent hover:bg-warm-accent hover:text-white px-9 py-7 text-lg rounded-xl font-semibold transition-all duration-200 hover:scale-[1.03]"
            onClick={() => navigate("/free-ats-check")}
          >
            <Target className="mr-2 h-5 w-5" />
            Check Your ATS Score (Free) 🎯
          </Button>
        </div>
        
        {/* Step-by-step guide instead of video placeholder */}
        <div className="w-full max-w-5xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-center mb-8">How Matchrate Works in 3 Simple Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover-scale transition-all duration-300">
              <div className="p-1 bg-gradient-to-r from-warm-accent/80 to-blue-500/80">
                <div className="bg-white p-2 rounded-t-lg">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/41e02388-22a6-400b-9409-977ae2d23cc8.png" 
                  alt="Upload your resume" 
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <span className="bg-warm-accent text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">STEP 1</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">Upload Your Resume</h3>
                <p className="text-slate-600 text-sm">Upload your resume and paste the job description you want to apply for. Our AI analyzer will match them together.</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover-scale transition-all duration-300">
              <div className="p-1 bg-gradient-to-r from-warm-accent/80 to-blue-500/80">
                <div className="bg-white p-2 rounded-t-lg">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/daaf6c67-e6aa-4d91-bb27-57e463c4f421.png" 
                  alt="AI analyzes your resume" 
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <span className="bg-warm-accent text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">STEP 2</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">Get Instant Analysis</h3>
                <p className="text-slate-600 text-sm">Our AI provides comprehensive feedback including match score, missing keywords, and section-by-section analysis.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover-scale transition-all duration-300">
              <div className="p-1 bg-gradient-to-r from-warm-accent/80 to-blue-500/80">
                <div className="bg-white p-2 rounded-t-lg">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/076ae941-c3a2-462d-a9a1-c74272f1cbdf.png" 
                  alt="Improve your resume" 
                  className="w-full h-48 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <span className="bg-warm-accent text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">STEP 3</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">Improve & Get Hired</h3>
                <p className="text-slate-600 text-sm">Apply the suggestions to transform your resume. Premium users get AI-powered bullet point rewrites and downloadable reports.</p>
              </div>
            </div>
          </div>
          
          {/* Advanced features preview */}
          <div className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden border border-slate-100">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">PREMIUM FEATURE</span>
                <h3 className="text-xl font-bold mb-3">Full Resume Rewrites & Expert Feedback</h3>
                <p className="text-slate-600 mb-4">Premium users get complete AI-powered bullet point rewrites that follow the STAR format, plus expert-level feedback on structure and content.</p>
                <Button 
                  className="cta-gradient text-white"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Premium Features
                </Button>
              </div>
              <div>
                <img 
                  src="/lovable-uploads/3b5ac8ab-9069-4498-a35d-38c4d70f0869.png" 
                  alt="Premium features screenshot" 
                  className="w-full h-auto rounded-lg shadow-md border border-slate-200"
                />
              </div>
            </div>
          </div>
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
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 0-2 2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
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
