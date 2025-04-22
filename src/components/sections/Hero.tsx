
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white pt-20 md:pt-28 pb-12 md:pb-24 border-b border-gray-100">
      <div className="container max-w-3xl mx-auto px-4 text-center flex flex-col items-center">
        <h1 className="mb-7 text-4xl md:text-5xl font-bold text-[#1E293B] leading-tight tracking-tight">
          Get{" "}
          <span className="inline-block align-baseline">
            <AnimatedTextCycle
              words={[
                "brutally honest",
                "insightful",
                "actionable",
                "expert",
                "unbiased",
                "tailored"
              ]}
              interval={2600}
              className="text-[#3B82F6]"
            />
          </span>{" "}
          resume feedback for PM roles
        </h1>
        <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mb-11 font-medium">
          Upload your resume and job description. Get detailed, actionable feedback that helps you stand out in the competitive PM job market.
        </p>
        <Button 
          size="lg"
          className="bg-[#3B82F6] hover:bg-blue-600 transition text-white px-9 py-4 text-lg rounded-xl shadow-md font-semibold"
          onClick={() => navigate("/review")}
        >
          Try Resume Review
        </Button>
      </div>
    </section>
  );
};

export default Hero;
