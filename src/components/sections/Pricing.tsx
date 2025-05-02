
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Free",
    price: "Free",
    description: "Get a basic analysis of your resume.",
    features: [
      "Limited resume analysis",
      "Basic keyword matching",
      "Section-by-section feedback",
    ],
    cta: "Get started",
    mostPopular: false,
  },
  {
    name: "Premium",
    price: "$7/month",
    description: "Unlock advanced features to boost your job search.",
    features: [
      "Unlimited resume analysis",
      "Advanced keyword matching",
      "AI-powered bullet point rewrites",
      "Downloadable reports",
    ],
    cta: "Start free trial",
    mostPopular: true,
  },
];

// Replace the CallToAction part at the bottom with a new version that links to Contact page
const EnterpriseCTA = () => {
  return (
    <div className="text-center mt-16 bg-slate-50 p-8 rounded-2xl border border-slate-100">
      <h3 className="text-2xl font-bold mb-2">Need a custom solution for your team?</h3>
      <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
        We offer enterprise plans with volume discounts, custom features, and dedicated support.
      </p>
      <Link to="/contact">
        <Button variant="outline" size="lg" className="font-medium">
          Contact Us for Enterprise Plans
        </Button>
      </Link>
    </div>
  );
};

// Export the updated component that includes the EnterpriseCTA
export default function Pricing() {
  return (
    <>
      <div id="pricing" className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-12">
          Choose the plan that fits your needs, whether you're applying for one job or looking to optimize your entire job search.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-shadow duration-200 ${
                tier.mostPopular ? "scale-105" : ""
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="text-4xl font-extrabold text-warm-text mb-4">
                {tier.price}
              </div>
              <p className="text-slate-600 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-600">
                    <Check className="h-4 w-4 mr-2 text-warm-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full cta-gradient text-white font-medium">
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <EnterpriseCTA />
    </>
  );
}
