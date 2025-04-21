
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-24 pb-24 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
          Get{" "}
          <AnimatedTextCycle
            words={[
              "brutallyhonest",
              "insightful",
              "actionable",
              "expert",
              "unbiased",
              "tailored"
            ]}
            interval={2600}
            className="text-indigo-600"
          />{" "}
          resume feedback for PM roles
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          Upload your resume and job description. Get detailed, actionable feedback that helps you stand out in the competitive PM job market.
        </p>
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
            onClick={() => navigate("/review")}
          >
            Try Resume Review
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
