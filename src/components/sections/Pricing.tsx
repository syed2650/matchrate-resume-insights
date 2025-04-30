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
    description: "For job seekers exploring our resume feedback tool.",
    features: [
      { name: "1 resume review", available: true },
      { name: "Keyword matching", available: true },
      { name: "Section-by-section feedback", available: true },
      { name: "Relevance & ATS Score", available: true },
      { name: "STAR bullet suggestions", available: true, note: "(View-only)" },
      { name: "Full Resume Rewrite", available: false },
      { name: "Export reports", available: false },
    ]
  },
  {
    name: "Premium",
    price: "7",
    period: "monthly",
    description: "For focused job seekers actively applying.",
    features: [
      { name: "30 resume reviews per month", available: true },
      { name: "Keyword matching", available: true },
      { name: "Section-by-section feedback", available: true },
      { name: "Relevance & ATS Score", available: true },
      { name: "STAR bullet suggestions", available: true },
      { name: "15 Resume rewrites per month", available: true },
      { name: "Export reports (.docx)", available: true },
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
      // Free plan doesn't need authentication
      // Simply activate the free plan
      toast({
        title: "Free plan activated",
        description: "You're now on the Free plan with 1 resume review per day."
      });
      navigate("/review");
    } else {
      try {
        setIsLoading(planName);
        
        if (!user) {
          // If not logged in, redirect to auth page with the selected plan
          navigate("/auth", { 
            state: { 
              fromPricing: true, 
              selectedPlan: planName.toLowerCase() 
            } 
          });
          return;
        }
        
        // User is already logged in, proceed to checkout
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { plan: planName.toLowerCase() }
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Redirect to Stripe Checkout
        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive"
        });
      }
      setIsLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative" ref={pricingRef}>
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-left mb-16 fade-in pricing-animated">
          <p className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider">Simple Pricing</p>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text mb-6">
            Choose the Plan That <span className="text-gradient">Fits Your Needs</span>
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
                You're currently on the Premium Plan!
              </span>
              <span className="text-sm text-emerald-700">
                {30 - stats.monthly.feedbacks} reviews and {15 - stats.monthly.rewrites} rewrites remaining this month.
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
                      <span className="text-4xl font-bold text-warm-text">${plan.price}</span>
                      {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
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
                        plan.name === "Free" ? "Try Now" : "Get Started"}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.slice(0, 5).map((feature, featureIndex) => (
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
                      
                      {plan.features.length > 5 && (
                        <div className="pt-2 border-t border-slate-100 mt-4">
                          {plan.features.slice(5).map((feature, featureIndex) => (
                            <div key={featureIndex + 5} className="flex items-start gap-3 text-slate-600 mt-3">
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
                      )}
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
                      "Resume reviews",
                      "Keyword matching",
                      "Section-by-section feedback",
                      "Relevance & ATS Score",
                      "STAR bullet suggestions",
                      "Resume rewrite credits",
                      "Export reports",
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
                          <div className="font-bold text-warm-text">${plan.price}</div>
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
