
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for trying out our resume review tool.",
    features: [
      "One resume analysis per day",
      "Basic keyword matching",
      "Section-by-section feedback",
      "Download PDF report",
      "No login required"
    ]
  },
  {
    name: "Career Booster",
    price: "19",
    period: "/month",
    description: "For serious PM candidates actively job hunting.",
    features: [
      "Unlimited resume analyses",
      "Advanced keyword matching",
      "STAR format suggestions",
      "Saved history dashboard",
      "Role-specific feedback",
      "Priority support"
    ],
    popular: true
  },
  {
    name: "Expert Review",
    price: "49",
    period: "/one-time",
    description: "Get a deep-dive human review of your resume.",
    features: [
      "Everything in Career Booster",
      "Human expert review",
      "Detailed teardown report",
      "1-on-1 feedback session",
      "LinkedIn summary rewrite",
      "2 revision rounds"
    ]
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 md:py-24 bg-transparent">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] font-medium text-sm mb-2 uppercase tracking-wider">Pricing Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-[#64748B] max-w-3xl mx-auto">
            Select the perfect plan for your PM career journey
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
                    <Check className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                    <span>{feature}</span>
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
