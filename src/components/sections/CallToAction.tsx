
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UsageLimitModal from "@/pages/review/components/UsageLimitModal";
import { canUseFeedback } from "@/pages/review/utils";

const CallToAction = () => {
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [canUse, setCanUse] = useState<boolean | null>(null);
  
  // Check usage limits when component mounts
  useEffect(() => {
    const checkUsageLimits = async () => {
      const allowed = await canUseFeedback();
      setCanUse(allowed);
    };
    
    checkUsageLimits();
  }, []);

  const handleTryClick = async () => {
    // Check again when button is clicked (in case limits changed)
    const allowed = await canUseFeedback();
    if (allowed) {
      navigate("/review");
    } else {
      setShowLimitModal(true);
    }
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
          Get clear, actionable feedback that helps you understand why your resume isn't landing interviews — and exactly how to fix it.
        </p>
        <Button 
          size="lg"
          className="bg-warm-accent hover:bg-warm-accent/90 transition-all duration-200 hover:scale-105 text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold flex items-center gap-2"
          onClick={handleTryClick}
        >
          Try Resume Feedback Free
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </section>
  );
};

export default CallToAction;
