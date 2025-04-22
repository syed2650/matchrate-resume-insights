
import { FileText, Target, MessageSquare, CheckCircle } from "lucide-react";

const features = [
  {
    title: "Upload & Instant Analysis",
    description: "Upload your resume and job description. Our AI instantly analyzes the match and provides structured, actionable feedback tailored for PM roles.",
    icon: <FileText className="w-7 h-7 text-white" />
  },
  {
    title: "Section-by-Section Review",
    description: "Get detailed feedback on every section of your resume, with specific suggestions to improve impact and relevance for Product Management positions.",
    icon: <Target className="w-7 h-7 text-white" />
  },
  {
    title: "Keyword Analysis & STAR Format",
    description: "Identify critical PM keywords missing from your resume and ensure your achievements follow the STAR format for maximum impact.",
    icon: <MessageSquare className="w-7 h-7 text-white" />
  },
  {
    title: "Expert PM Insights",
    description: "Receive feedback based on actual PM hiring practices, helping you showcase your product thinking and leadership abilities.",
    icon: <CheckCircle className="w-7 h-7 text-white" />
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 md:py-24 bg-transparent">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] font-medium text-sm mb-2 uppercase tracking-wider">Key Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] leading-tight">Get PM-Ready Resume Feedback</h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-3xl mx-auto">
            Our AI-powered tool provides detailed, actionable feedback specifically designed for Product Management roles in tech.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex gap-5 items-start rounded-xl bg-white shadow-md px-7 py-7 transition hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-lg bg-[#3B82F6] flex items-center justify-center shrink-0 shadow">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-[1.18rem] font-semibold text-[#1E293B] mb-2">{feature.title}</h3>
                <p className="text-[#475569]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
