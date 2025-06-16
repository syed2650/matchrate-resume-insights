
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { canUseFeedback } from "@/pages/review/utils";
import { useState } from "react";
import UsageLimitModal from "@/pages/review/components/UsageLimitModal";

const CallToAction = () => {
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleTryClick = () => {
    // For the comprehensive resume feedback, we'll allow unlimited use
    navigate("/resume-feedback");
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  return (
    <section className="py-20 md:py-28 hero-gradient border-y border-slate-100">
      <div className="container max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-warm-text mb-4 tracking-tight">
          Ready to improve your resume?
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Get comprehensive AI-powered feedback that helps you understand exactly what's holding your resume back — and how to fix it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            size="lg"
            className="bg-warm-accent hover:bg-warm-accent/90 transition-all duration-200 hover:scale-105 text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold flex items-center gap-2"
            onClick={handleTryClick}
          >
            Get Resume Feedback Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-warm-accent text-warm-accent hover:bg-warm-accent hover:text-white px-9 py-4 text-lg rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/review')}
          >
            Try Job-Specific Matching
          </Button>
        </div>
        <p className="text-sm text-slate-500">
          Or get advanced job-specific matching with our premium tool
        </p>
      </div>

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </section>
  );
};

export default CallToAction;
