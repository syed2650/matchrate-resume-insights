import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { getUsageStats } from "@/pages/review/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";

interface PlanFeature {
  name: string;
  available: boolean;
  note?: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string | null;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    period: null,
    description: "Perfect for trying MatchRate.",
    features: [
      { name: "1 resume upload", available: true },
      { name: "Basic resume improvements", available: true },
      { name: "Basic ATS score", available: true },
      { name: "Basic JD match", available: true },
      { name: "Roast card", available: true },
      { name: "No history", available: false },
      { name: "No PDF downloads", available: false },
      { name: "Daily limit applies", available: false },
    ]
  },
  {
    name: "Pro",
    price: "3.99",
    period: "monthly",
    description: "For serious job seekers wanting full optimization.",
    features: [
      { name: "Unlimited resume analyses", available: true },
      { name: "Unlimited JD match scans", available: true },
      { name: "Full ATS breakdown", available: true },
      { name: "Full Resume Improvements suite", available: true },
      { name: "Colour-coded results", available: true },
      { name: "All PDF downloads", available: true },
      { name: "Shareable roast cards", available: true },
      { name: "Priority processing", available: true },
    ],
    popular: true
  }
];

const Pricing = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const stats = getUsageStats();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuthUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const pricingElements = document.querySelectorAll('.pricing-animated');
    pricingElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      pricingElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleUpgrade = async (planName: string) => {
    if (planName === "Free") {
      toast({
        title: "Free plan activated",
        description: "You're now on the Free plan with 1 resume review per day."
      });
      navigate("/review");
    } else {
      try {
        setIsLoading(planName);
        
        if (!user) {
          navigate("/auth", { 
            state: { 
              fromPricing: true, 
              selectedPlan: planName.toLowerCase() 
            } 
          });
          return;
        }
        
        toast({
          title: "Preparing checkout...",
          description: "You'll be redirected to the payment page shortly."
        });
        
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { plan: planName.toLowerCase() }
        });
        
        if (error) {
          console.error("Error creating checkout session:", error);
          throw new Error(`Checkout error: ${error.message}`);
        }
        
        if (data?.url) {
          setTimeout(() => {
            window.location.href = data.url;
          }, 300);
        } else {
          throw new Error("No checkout URL returned from server");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast({
          title: "Payment Error",
          description: error instanceof Error 
            ? `Could not initiate checkout: ${error.message}` 
            : "Could not initiate checkout. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(null);
      }
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative" ref={pricingRef}>
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-left mb-16 fade-in pricing-animated">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">Simple Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text mb-6">
            Simple Pricing That <span className="text-gradient">Fits Your Job Search</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            Get the feedback you need to land interviews, with plans designed for every job seeker's budget and goals.
          </p>
          
          {stats.plan === 'paid' && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg inline-flex items-center gap-2">
              <div className="bg-emerald-100 p-1 rounded-full">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-medium text-emerald-800">
                You're currently on the Pro Plan!
              </span>
            </div>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto fade-in pricing-animated">
          <Tabs defaultValue="plans" className="mb-8">
            <div className="flex justify-center">
              <TabsList className="grid w-64 grid-cols-2 mb-12 glass">
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="plans" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pricingPlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col rounded-2xl glassmorphism transition-all duration-300 hover:shadow-premium-hover px-7 py-9 relative ${
                      plan.popular ? 'border-warm-accent ring-2 ring-warm-accent/20 translate-y-[-8px]' : 'border-slate-100'
                    } ${stats.plan === plan.name.toLowerCase() ? 'border-emerald-300 ring-2 ring-emerald-100' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block px-4 py-1 text-xs font-medium text-white bg-warm-accent rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}
                    
                    {stats.plan === plan.name.toLowerCase() && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block px-4 py-1 text-xs font-medium text-white bg-emerald-600 rounded-full shadow-md">
                        Your Current Plan
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-warm-text mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-4xl font-bold text-warm-text">£{plan.price}</span>
                      {plan.period && (
                        <span className="text-slate-500 ml-1">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>
                    
                    <Button 
                      className={`w-full mb-7 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                        plan.popular 
                          ? "cta-gradient text-white shadow-md" 
                          : "bg-white text-warm-text border border-slate-200 hover:bg-slate-50"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={stats.plan === plan.name.toLowerCase() || isLoading === plan.name}
                      isLoading={isLoading === plan.name}
                    >
                      {stats.plan === plan.name.toLowerCase() ? 'Current Plan' : 
                        plan.name === "Free" ? "Try Now" : "Get MatchRate Pro"}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3 text-slate-600">
                          {feature.available ? (
                            <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                          )}
                          <span>
                            {feature.name} 
                            {feature.note && <span className="text-sm text-slate-400"> {feature.note}</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="compare">
              <div className="glassmorphism rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left p-4 font-medium text-slate-500">Feature</th>
                      {pricingPlans.map((plan, i) => (
                        <th key={i} className="p-4 font-medium text-slate-800">{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Resume analyses",
                      "JD match scans",
                      "ATS breakdown",
                      "Resume Improvements",
                      "Colour-coded results",
                      "PDF downloads",
                      "Shareable roast cards",
                      "Priority processing",
                    ].map((feature, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="p-4 text-sm text-slate-700">{feature}</td>
                        {pricingPlans.map((plan, planIndex) => {
                          const planFeature = plan.features.find(f => f.name.toLowerCase().includes(feature.toLowerCase()));
                          return (
                            <td key={planIndex} className="p-4 text-center">
                              {planFeature?.available ? (
                                <>
                                  <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                  {planFeature.note && (
                                    <div className="text-xs text-slate-500 mt-1">{planFeature.note}</div>
                                  )}
                                </>
                              ) : (
                                <X className="w-5 h-5 text-slate-300 mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr className="bg-slate-50">
                      <td className="p-4 text-sm font-medium text-slate-800">Pricing</td>
                      {pricingPlans.map((plan, i) => (
                        <td key={i} className="p-4 text-center">
                          <div className="font-bold text-warm-text">£{plan.price}</div>
                          {plan.period && <div className="text-xs text-slate-500">{plan.period}</div>}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center fade-in pricing-animated" style={{ animationDelay: '300ms' }}>
            <p className="text-slate-500 mb-4">Need a custom solution for your team?</p>
            <Button variant="outline" className="glassmorphism hover:bg-white/80" asChild>
              <Link to="/contact">Contact Us for Enterprise Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
