
import { Check } from "lucide-react";

const features = [
  {
    title: "Upload & Instant Analysis",
    description: "Simply upload your resume and job description. Our AI instantly analyzes the match and provides detailed, actionable feedback.",
    icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
  },
  {
    title: "Section-by-Section Review",
    description: "Get comprehensive feedback on each section of your resume, identifying strengths and areas for improvement tailored to PM roles.",
    icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
  },
  {
    title: "Keyword Analysis",
    description: "Identify missing keywords and skills that matter most for the specific PM role you're targeting, improving your resume's relevance score.",
    icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
  },
  {
    title: "Professional Insights",
    description: "Receive clear, honest feedback on your resume's impact, including a final verdict on whether it would pass initial screening.",
    icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm mb-2">Key Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Transform Your PM Resume</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Get detailed, actionable feedback tailored specifically for Product Management roles in tech companies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6">
              {feature.icon}
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
