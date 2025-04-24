
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "For job seekers exploring our resume feedback tool.",
    features: [
      { name: "1 resume review per day", available: true },
      { name: "Keyword matching", available: true },
      { name: "Section-by-section feedback", available: true },
      { name: "Relevance & ATS Score", available: true },
      { name: "STAR bullet suggestions", available: true, note: "(View-only)" },
      { name: "Full Resume Rewrite", available: false },
      { name: "Export reports", available: false },
      { name: "Multiple version rewrites", available: false },
    ]
  },
  {
    name: "Standard",
    price: "7",
    period: "one-time",
    description: "For focused job seekers actively applying.",
    features: [
      { name: "Unlimited resume reviews", available: true },
      { name: "Keyword matching", available: true },
      { name: "Section-by-section feedback", available: true },
      { name: "Relevance & ATS Score", available: true },
      { name: "STAR bullet suggestions", available: true },
      { name: "Full Resume Rewrite", available: true, note: "(7 total)" },
      { name: "Export reports (.pdf/.docx)", available: true },
      { name: "Multiple version rewrites", available: false },
    ],
    popular: true
  },
  {
    name: "Pro",
    price: "25",
    period: "lifetime",
    description: "For career pivoters or long-term job seekers.",
    features: [
      { name: "Unlimited resume reviews", available: true },
      { name: "Keyword matching", available: true },
      { name: "Section-by-section feedback", available: true },
      { name: "Relevance & ATS Score", available: true },
      { name: "STAR bullet suggestions", available: true },
      { name: "Full Resume Rewrite", available: true, note: "(25 total)" },
      { name: "Export reports (.pdf/.docx)", available: true },
      { name: "Multiple version rewrites", available: true },
    ]
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-transparent">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] font-medium text-sm mb-2 uppercase tracking-wider">Pricing Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-3xl mx-auto">
            Get the feedback you need to land interviews, with plans designed for every job seeker
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`flex flex-col rounded-2xl bg-white shadow-md border transition hover:shadow-lg px-7 py-9 ${plan.popular ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/40' : 'border-gray-100'}`}
            >
              {plan.popular && (
                <span className="self-start inline-block px-3 py-1 text-xs font-medium text-[#3B82F6] bg-[#EFF6FF] rounded-full mb-3">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-3">
                <span className="text-4xl font-bold text-[#1E293B]">${plan.price}</span>
                {plan.period && <span className="text-[#64748B] ml-1">{plan.period}</span>}
              </div>
              <p className="text-[#475569] mb-6">{plan.description}</p>
              <Button 
                className={`w-full mb-7 font-semibold px-6 py-3 rounded-lg ${plan.popular ? "bg-[#3B82F6] hover:bg-blue-600 text-white" : "bg-white text-[#3B82F6] border border-[#3B82F6] hover:bg-[#F0F6FF] hover:text-[#1E293B]"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 text-[#475569]">
                    {feature.available ? (
                      <Check className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <span>
                      {feature.name} 
                      {feature.note && <span className="text-sm text-gray-500"> {feature.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
