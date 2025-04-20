
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get brutally honest resume feedback tailored to PM roles in tech
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Upload your resume and job description. Get detailed, actionable feedback to improve your chances.
          </p>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            onClick={() => navigate("/review")}
          >
            Try Resume Review
          </Button>

          {/* Process Steps */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Upload",
                description: "Share your resume and target job description",
              },
              {
                title: "Analyze",
                description: "Our AI reviews your materials thoroughly",
              },
              {
                title: "Get Feedback",
                description: "Receive detailed, actionable insights",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 rounded-lg border border-slate-100"
              >
                <div className="text-blue-600 font-bold mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
