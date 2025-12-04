import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, FileSearch, Target, Flame } from "lucide-react";

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
          Is Your Resume Strong Enough to <br className="hidden md:block" />
          <span className="text-gradient">Get Interviews?</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mb-8 font-medium">
          Upload your resume — get instant AI-powered improvements, ATS fixes, JD match scoring & a viral roast.
          <br />No signup needed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full md:w-auto">
          <Button 
            size="lg"
            className="cta-gradient hover:scale-[1.03] transition-all duration-200 text-white px-9 py-7 text-lg rounded-xl shadow-cta font-semibold"
            onClick={() => navigate("/review")}
          >
            Analyze My Resume Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-9 py-7 text-lg rounded-xl font-semibold transition-all duration-200 hover:scale-[1.03]"
            onClick={() => navigate("/lovable")}
          >
            <Flame className="mr-2 h-5 w-5" />
            Try Resume Roast
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 mb-16">
          PDF, DOCX, or Text — instant parsing included.
        </p>

        {/* Choose Your AI Tools Section */}
        <div className="w-full max-w-5xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your AI Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Resume Improvements */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover-scale transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Resume Improvements</h3>
              <p className="text-sm text-slate-600 mb-4">
                Get a polished summary, bullet rewrites, impact boosts, redundancy fixes & action verbs.
              </p>
              <p className="text-xs text-slate-500 italic">→ Perfect for improving clarity & impact.</p>
            </div>
            
            {/* ATS Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover-scale transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileSearch className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">ATS Analysis</h3>
              <p className="text-sm text-slate-600 mb-4">
                Spot formatting issues, missing keywords, parsing errors & get an ATS-safe summary.
              </p>
              <p className="text-xs text-slate-500 italic">→ Improve your chances of passing real ATS scanners.</p>
            </div>
            
            {/* JD Match */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover-scale transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">JD Match</h3>
              <p className="text-sm text-slate-600 mb-4">
                Upload a job description and get a match score, missing skills, optimized bullets & role fit.
              </p>
              <p className="text-xs text-slate-500 italic">→ Perfect for targeted applications.</p>
            </div>
            
            {/* Roast Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover-scale transition-all duration-300 border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Roast Card</h3>
              <p className="text-sm text-slate-600 mb-4">
                Get a fun, viral-friendly AI roast of your resume.
              </p>
              <p className="text-xs text-slate-500 italic">→ Great for sharing on LinkedIn, X & Instagram.</p>
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="w-full max-w-5xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How MatchRate Works in 3 Simple Steps</h2>
          
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
                <p className="text-slate-600 text-sm">Upload your PDF, DOCX, or text resume. No signup required — our AI parses it instantly.</p>
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
                <h3 className="text-lg font-bold mb-2">Get Instant AI Analysis</h3>
                <p className="text-slate-600 text-sm">Choose your tool: Resume Improvements, ATS Fixes, JD Match, or Roast Card. Outputs are fast, actionable & colour-coded.</p>
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
                <h3 className="text-lg font-bold mb-2">Improve & Get More Interviews</h3>
                <p className="text-slate-600 text-sm">Use optimized bullets, ATS fixes, summary rewrites & insights to upgrade your resume immediately. Download results as PDF anytime.</p>
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
                      <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                      <span className="font-medium">Claude</span>
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
