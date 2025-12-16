const DashboardPreview = () => {
  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-warm-section to-white"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">Tool Output</p>
          <h2 className="text-3xl md:text-4xl font-bold text-warm-text mb-6 leading-tight">
            See Your Resume <span className="text-gradient">Like Recruiters Do</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our new clean UI shows improvements, ATS issues, JD match score & roast card results.
          </p>
        </div>
        
        {/* Screenshots Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Improvements Screenshot */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80 h-[400px] flex flex-col">
              <div className="bg-blue-50 border-b border-slate-100 p-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm font-medium text-slate-700">Resume Improvements</span>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <img 
                  src="/lovable-uploads/resume-improvements-screenshot.png" 
                  alt="Resume Improvements screenshot showing summary improvement, bullet rewrites, and action verb suggestions" 
                  className="w-full h-full object-cover object-top rounded-lg border border-slate-100"
                />
              </div>
            </div>
            
            {/* ATS Analysis Screenshot */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80 h-[400px] flex flex-col">
              <div className="bg-green-50 border-b border-slate-100 p-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-slate-700">ATS Analysis</span>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <img 
                  src="/lovable-uploads/ats-analysis-screenshot.png" 
                  alt="ATS Analysis screenshot showing score, formatting issues, and missing keywords" 
                  className="w-full h-full object-cover object-top rounded-lg border border-slate-100"
                />
              </div>
            </div>
            
            {/* JD Match Screenshot */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80 h-[400px] flex flex-col">
              <div className="bg-purple-50 border-b border-slate-100 p-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-sm font-medium text-slate-700">JD Match</span>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <img 
                  src="/lovable-uploads/jd-match-screenshot.png" 
                  alt="JD Match screenshot showing match score, missing skills, and optimized bullets" 
                  className="w-full h-full object-cover object-top rounded-lg border border-slate-100"
                />
              </div>
            </div>
            
            {/* Roast Card Screenshot */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80 h-[400px] flex flex-col">
              <div className="bg-orange-50 border-b border-slate-100 p-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                <span className="text-sm font-medium text-slate-700">Roast Card</span>
              </div>
              <div className="p-4 flex-1 overflow-hidden">
                <img 
                  src="/lovable-uploads/roast-card-screenshot.png" 
                  alt="Roast Card screenshot showing funny roast and real review with scores" 
                  className="w-full h-full object-cover object-top rounded-lg border border-slate-100"
                />
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-warm-accent/5 rounded-full z-[-1]"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full z-[-1]"></div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
