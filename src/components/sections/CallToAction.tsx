
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-white border-y border-gray-100">
      <div className="container max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4 tracking-tight">
          Ready to land your dream PM role?
        </h2>
        <p className="text-lg text-[#475569] mb-8 max-w-2xl mx-auto">
          Get brutally honest, PM-focused feedback that helps you stand out in the competitive tech industry. No fluff, just actionable insights.
        </p>
        <Button 
          size="lg"
          className="bg-[#3B82F6] hover:bg-blue-600 transition text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold flex items-center gap-2"
          onClick={() => navigate("/review")}
        >
          Start Your Review
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
