import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
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
  lifetime?: boolean;
  badge?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "0",
    period: null,
    description: "Perfect for trying MatchRate.",
    features: [
      { name: "1 resume analysis", available: true },
      { name: "1 job match check", available: true },
      { name: "Basic ATS Score", available: true },
      { name: "Basic bullet rewrite", available: true },
      { name: "Roast card", available: false },
      { name: "PDF export", available: false },
      { name: "Save history", available: false },
    ]
  },
  {
    name: "Premium",
    price: "3.99",
    period: "month",
    description: "For serious job seekers wanting full optimization.",
    features: [
      { name: "Unlimited resume analyses", available: true },
      { name: "Unlimited ATS & JD matching", available: true },
      { name: "Full bullet rewrites", available: true },
      { name: "Personalized summary rewrite", available: true },
      { name: "Roast + Real Review", available: true },
      { name: "PDF export", available: true },
      { name: "Save history", available: true },
      { name: "Priority updates", available: true },
    ],
    popular: true
  },
  {
    name: "Lifetime",
    price: "29",
    period: null,
    description: "Limited to first 200 buyers only.",
    features: [
      { name: "Everything in Premium", available: true },
      { name: "No monthly fees", available: true },
      { name: "Lifetime updates", available: true },
      { name: "Priority roadmap access", available: true },
    ],
    lifetime: true,
    badge: "Best Value"
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
                You're currently on a Premium Plan!
              </span>
            </div>
          )}
        </div>
        
        <div className="max-w-5xl mx-auto fade-in pricing-animated">
          <Tabs defaultValue="plans" className="mb-8">
            <div className="flex justify-center">
              <TabsList className="grid w-64 grid-cols-2 mb-12 glass">
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="compare">Compare</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="plans" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col rounded-2xl glassmorphism transition-all duration-300 hover:shadow-premium-hover px-6 py-8 relative ${
                      plan.popular ? 'border-warm-accent ring-2 ring-warm-accent/20 translate-y-[-8px]' : ''
                    } ${plan.lifetime ? 'border-amber-400 ring-2 ring-amber-200/40 bg-gradient-to-br from-amber-50/50 to-orange-50/30' : 'border-slate-100'}
                    ${stats.plan === plan.name.toLowerCase() ? 'border-emerald-300 ring-2 ring-emerald-100' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block px-4 py-1 text-xs font-medium text-white bg-warm-accent rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}
                    
                    {plan.badge && !plan.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-4 py-1 text-xs font-medium text-amber-800 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
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
                      {plan.lifetime && (
                        <span className="text-amber-600 ml-2 text-sm font-medium">one-time</span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>
                    
                    <Button 
                      className={`w-full mb-6 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                        plan.lifetime 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600"
                          : plan.popular 
                            ? "cta-gradient text-white shadow-md" 
                            : "bg-white text-warm-text border border-slate-200 hover:bg-slate-50"
                      }`}
                      variant={plan.popular || plan.lifetime ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={stats.plan === plan.name.toLowerCase() || isLoading === plan.name}
                      isLoading={isLoading === plan.name}
                    >
                      {stats.plan === plan.name.toLowerCase() ? 'Current Plan' : 
                        plan.name === "Free" ? "Try Now" : 
                        plan.lifetime ? "Get Lifetime Access" : "Get Premium"}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3 text-slate-600">
                          {feature.available ? (
                            <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <X className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" />
                          )}
                          <span className="text-sm">
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
              <div className="glassmorphism rounded-xl overflow-hidden overflow-x-auto">
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
                      "ATS & JD matching",
                      "Bullet rewrites",
                      "Summary rewrite",
                      "Roast + Real Review",
                      "PDF export",
                      "Save history",
                      "Priority updates",
                    ].map((feature, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="p-4 text-sm text-slate-700">{feature}</td>
                        {pricingPlans.map((plan, planIndex) => {
                          const planFeature = plan.features.find(f => f.name.toLowerCase().includes(feature.toLowerCase().split(' ')[0]));
                          const isLifetimeAll = plan.lifetime && i > 0;
                          return (
                            <td key={planIndex} className="p-4 text-center">
                              {planFeature?.available || isLifetimeAll ? (
                                <>
                                  <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                                  {planFeature?.note && (
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
                          {plan.period && <div className="text-xs text-slate-500">/{plan.period}</div>}
                          {plan.lifetime && <div className="text-xs text-amber-600 font-medium">one-time</div>}
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
