
import { FileText, Target, MessageSquare, CheckCircle } from "lucide-react";

const features = [
  {
    title: "Upload & Instant Analysis",
    description: "Upload your resume and job description. Our AI instantly analyzes the match and provides structured, actionable feedback tailored for PM roles.",
    icon: <FileText className="w-6 h-6 text-white" />
  },
  {
    title: "Section-by-Section Review",
    description: "Get detailed feedback on every section of your resume, with specific suggestions to improve impact and relevance for Product Management positions.",
    icon: <Target className="w-6 h-6 text-white" />
  },
  {
    title: "Keyword Analysis & STAR Format",
    description: "Identify critical PM keywords missing from your resume and ensure your achievements follow the STAR format for maximum impact.",
    icon: <MessageSquare className="w-6 h-6 text-white" />
  },
  {
    title: "Expert PM Insights",
    description: "Receive feedback based on actual PM hiring practices, helping you showcase your product thinking and leadership abilities.",
    icon: <CheckCircle className="w-6 h-6 text-white" />
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm mb-2">Key Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get PM-Ready Resume Feedback</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered tool provides detailed, actionable feedback specifically designed for Product Management roles in tech.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
