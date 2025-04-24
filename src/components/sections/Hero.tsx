
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full hero-gradient pt-24 md:pt-32 pb-16 md:pb-28">
      <div className="container max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        <h1 className="mb-7 text-4xl md:text-5xl font-bold text-warm-text leading-tight tracking-tight max-w-2xl">
          Is Your Resume Good Enough to Get You Interviews?
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-8 font-medium">
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
        <p className="text-md text-slate-500 max-w-2xl mb-11">
          Understand exactly why your resume isn't landing interviews — and how to fix it.
        </p>
        <Button 
          size="lg"
          className="bg-warm-accent hover:bg-warm-accent/90 transition-all duration-200 hover:scale-[1.03] text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold"
          onClick={() => navigate("/review")}
        >
          Try Resume Feedback Free
        </Button>
        
        {/* UI Preview mockup */}
        <div className="mt-16 w-full max-w-4xl mx-auto relative animate-float">
          <div className="bg-white rounded-xl shadow-premium overflow-hidden border border-slate-200/80">
            <div className="w-full h-[350px] bg-white/80 flex items-center justify-center">
              <div className="text-slate-400 text-sm">Resume feedback preview</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-warm-section rounded-full opacity-50 z-[-1]"></div>
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-warm-accent/10 rounded-full opacity-50 z-[-1]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
