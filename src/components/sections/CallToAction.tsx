
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to land your dream PM role?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get brutally honest, PM-focused feedback that helps you stand out in the competitive tech industry. No fluff, just actionable insights.
        </p>
        <Button 
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
          onClick={() => navigate("/review")}
        >
          Start Your Review
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
