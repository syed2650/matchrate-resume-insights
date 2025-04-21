
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to improve your PM resume?<br />Start your review today.</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get honest, detailed feedback that helps you stand out in the competitive PM job market. No fluff, just actionable insights.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => navigate("/review")}
          >
            Get started
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 flex items-center gap-2"
          >
            Learn more <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
