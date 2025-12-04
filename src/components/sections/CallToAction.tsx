import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UsageLimitModal from "@/pages/review/components/UsageLimitModal";

const CallToAction = () => {
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleTryClick = () => {
    navigate("/review");
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  return (
    <section className="py-20 md:py-28 hero-gradient border-y border-slate-100">
      <div className="container max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-warm-text mb-4 tracking-tight">
          Ready to Improve Your Resume?
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Get instant AI-powered resume feedback and discover exactly what's holding you back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            size="lg"
            className="bg-warm-accent hover:bg-warm-accent/90 transition-all duration-200 hover:scale-105 text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold flex items-center gap-2"
            onClick={handleTryClick}
          >
            Analyze My Resume Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-9 py-4 text-lg rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            onClick={() => navigate('/lovable')}
          >
            <Flame className="mr-2 w-5 h-5" />
            Try Resume Roast
          </Button>
        </div>
      </div>

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </section>
  );
};

export default CallToAction;
