
const pricingPlans = [
  {
    name: "Personal",
    price: "29",
    description: "Perfect for job seekers actively applying to PM roles.",
    features: [
      "Resume analysis with AI feedback",
      "Keyword matching & suggestions",
      "Section-by-section review",
      "Export to PDF",
      "Basic score history",
      "Email support"
    ]
  },
  {
    name: "Premium",
    price: "99",
    description: "For serious candidates targeting top tech companies.",
    features: [
      "Everything in Personal, plus:",
      "Expert human review",
      "Premium formatting suggestions",
      "Unlimited revisions",
      "Priority support",
      "Interview preparation tips"
    ]
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm mb-2">Pricing Plans</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Get started with the plan that fits your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="p-8 border rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">${plan.price}</div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                    {feature}
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
