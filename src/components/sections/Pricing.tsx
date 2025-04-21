
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
    <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm mb-2">Pricing Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your PM career journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`p-8 rounded-lg bg-white shadow-sm border ${plan.popular ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <Button 
                className="w-full mb-6"
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
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
