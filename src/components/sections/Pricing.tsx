import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Rocket, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import { getUsageStats } from "@/pages/review/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

interface PlanFeature {
  name: string;
  available: boolean;
  note?: string;
}

interface PricingPlan {
  name: string;
  planKey: string;
  price: string;
  period: string | null;
  description: string;
  features: PlanFeature[];
  lockedFeatures?: string[];
  limits?: string[];
  popular?: boolean;
  badge?: string;
  ctaText: string;
  ctaIcon?: React.ReactNode;
  microCopy: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    planKey: "free",
    price: "0",
    period: null,
    description: "See why your resume isn't getting interviews.",
    features: [
      { name: "1 resume upload", available: true },
      { name: "1 job match check", available: true },
      { name: "Executive Summary", available: true },
      { name: "Overall Match Score", available: true },
      { name: "Top 3 improvement actions", available: true },
    ],
    lockedFeatures: [
      "Resume Strength fixes",
      "ATS Safety reasoning",
      "Job Fit gap analysis",
      "Roast Review",
      "Recheck after edits",
      "PDF export & history",
    ],
    ctaText: "Run Free Resume Check",
    ctaIcon: <span className="mr-1">👉</span>,
    microCopy: "No card required · Takes under 60 seconds",
  },
  {
    name: "Weekly",
    planKey: "weekly",
    price: "1.99",
    period: "week",
    description: "Perfect for active job applications this week.",
    features: [
      { name: "Up to 5 job match checks", available: true },
      { name: "Full Resume Strength fixes (Top 5 critical issues)", available: true },
      { name: "ATS Safety analysis (pass / risk clarity)", available: true },
      { name: "Job Fit analysis (what's missing + how to fix)", available: true },
      { name: "Full Roast Review", available: true },
      { name: "Recheck after edits", available: true },
    ],
    limits: [
      "Access valid for 7 days",
      "History saved for 7 days only",
    ],
    popular: true,
    ctaText: "Unlock Resume Fixes for This Week",
    ctaIcon: <span className="mr-1">👉</span>,
    microCopy: "Cancel anytime · No long-term commitment",
  },
  {
    name: "Monthly",
    planKey: "monthly",
    price: "6.99",
    period: "month",
    description: "Tailor your resume for every job you apply to this month.",
    features: [
      { name: "Up to 25 job match checks / month", available: true },
      { name: "Everything in Weekly", available: true },
      { name: "Saved resume & job history", available: true },
      { name: "PDF exports", available: true },
      { name: "Priority usage limits", available: true },
    ],
    badge: "Best Value",
    ctaText: "Get Full Access for This Month",
    ctaIcon: <span className="mr-1">👉</span>,
    microCopy: "Best value for active job seekers · Cancel anytime",
  },
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

  const handleUpgrade = async (planKey: string) => {
    if (planKey === "free") {
      navigate("/review");
    } else {
      try {
        setIsLoading(planKey);
        
        if (!user) {
          navigate("/auth", { 
            state: { 
              fromPricing: true, 
              selectedPlan: planKey
            } 
          });
          return;
        }
        
        toast({
          title: "Preparing checkout...",
          description: "You'll be redirected to the payment page shortly."
        });
        
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: { plan: planKey }
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
    <section id="pricing" className="py-12 md:py-16 relative overflow-hidden" ref={pricingRef}>
      <FloatingOrbs variant="section" />
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-left mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Simple Pricing
          </motion.p>
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-warm-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Simple Pricing That <span className="text-gradient animated-gradient-text">Fits Your Job Search</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-lg text-slate-600 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Get the feedback you need to land interviews, with plans designed for every job seeker's budget and goals.
          </motion.p>
          
          {(stats.plan === 'weekly' || stats.plan === 'monthly') && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg inline-flex items-center gap-2">
              <div className="bg-emerald-100 p-1 rounded-full">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-medium text-emerald-800">
                You're currently on the {stats.plan === 'weekly' ? 'Weekly' : 'Monthly'} Plan!
              </span>
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: plan.popular ? -12 : -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className={`flex flex-col rounded-2xl glassmorphism transition-all duration-300 hover:shadow-premium-hover px-6 py-8 relative ${
                  plan.popular ? 'border-warm-accent ring-2 ring-warm-accent/20 translate-y-[-8px]' : ''
                } ${plan.badge && !plan.popular ? 'border-emerald-400 ring-2 ring-emerald-200/40 bg-gradient-to-br from-emerald-50/50 to-teal-50/30' : 'border-slate-100'}
                ${stats.plan === plan.planKey ? 'border-emerald-300 ring-2 ring-emerald-100' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-4 py-1 text-xs font-medium text-white bg-warm-accent rounded-full shadow-md">
                    <Zap className="w-3 h-3" />
                    High Conversion
                  </div>
                )}
                
                {plan.badge && !plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-4 py-1 text-xs font-medium text-emerald-800 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full shadow-md">
                    <Rocket className="w-3 h-3" />
                    {plan.badge}
                  </div>
                )}
                
                {stats.plan === plan.planKey && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block px-4 py-1 text-xs font-medium text-white bg-emerald-600 rounded-full shadow-md">
                    Your Current Plan
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-warm-text mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-warm-text">£{plan.price}</span>
                  {plan.period && (
                    <span className="text-slate-500 ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>
                
                <Button 
                  className={`w-full mb-6 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                    plan.popular 
                      ? "cta-gradient text-white shadow-md" 
                      : plan.badge
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600"
                        : "bg-white text-warm-text border border-slate-200 hover:bg-slate-50"
                  }`}
                  variant={plan.popular || plan.badge ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={stats.plan === plan.planKey || isLoading === plan.planKey}
                  isLoading={isLoading === plan.planKey}
                >
                  {stats.plan === plan.planKey ? 'Current Plan' : (
                    <>
                      {plan.ctaIcon}
                      {plan.ctaText}
                    </>
                  )}
                </Button>
                
                {/* Micro-copy */}
                <p className="text-xs text-slate-500 text-center mb-4 -mt-4">{plan.microCopy}</p>
                
                {/* What you get */}
                <div className="space-y-3 mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">What you get</p>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3 text-slate-600">
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm">
                        {feature.name} 
                        {feature.note && <span className="text-sm text-slate-400"> {feature.note}</span>}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* What's locked (Free plan only) */}
                {plan.lockedFeatures && plan.lockedFeatures.length > 0 && (
                  <div className="space-y-2 mb-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">What's locked</p>
                    {plan.lockedFeatures.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3 text-slate-400">
                        <X className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Limits (Weekly plan) */}
                {plan.limits && plan.limits.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Limits</p>
                    {plan.limits.map((limit, limitIndex) => (
                      <div key={limitIndex} className="flex items-start gap-2 text-slate-500">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="text-xs">{limit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-500 mb-4">Need a custom solution for your team?</p>
            <Button variant="outline" className="glassmorphism hover:bg-white/80 hover-scale" asChild>
              <Link to="/contact">Contact Us for Enterprise Plans</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
