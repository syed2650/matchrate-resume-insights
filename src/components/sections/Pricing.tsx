import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Zap, Crown, Clock, ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUsageStats } from "@/pages/review/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/mixpanel";
import { gtagEvent } from "@/lib/gtag";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

interface PlanFeature { name: string; available: boolean; note?: string; }
interface PricingPlan {
  name: string; planKey: string; price: string; period: string | null;
  description: string; features: PlanFeature[]; lockedFeatures?: string[];
  limits?: string[]; popular?: boolean; badge?: string; badgeIcon?: React.ReactNode;
  ctaText: string; ctaIcon?: React.ReactNode; microCopy: string; gradient?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free", planKey: "free", price: "0", period: null,
    description: "See why your resume isn't getting interviews.",
    features: [
      { name: "1 resume upload", available: true },
      { name: "1 job match check", available: true },
      { name: "Executive Summary", available: true },
      { name: "Overall Match Score", available: true },
      { name: "Top 3 improvement actions", available: true },
    ],
    lockedFeatures: ["Resume Strength fixes", "ATS Safety reasoning", "Job Fit gap analysis", "Roast Review", "Recheck after edits", "PDF export & history"],
    ctaText: "Run Free Resume Check",
    ctaIcon: <ArrowRight className="w-4 h-4 ml-2" />,
    microCopy: "No card required · Takes under 60 seconds",
  },
  {
    name: "Weekly", planKey: "weekly", price: "1.99", period: "week",
    description: "Perfect for active job applications this week.",
    features: [
      { name: "Up to 5 job match checks", available: true },
      { name: "Full Resume Strength fixes", available: true },
      { name: "ATS Safety analysis", available: true },
      { name: "Job Fit analysis", available: true },
      { name: "Full Roast Review", available: true },
      { name: "Recheck after edits", available: true },
    ],
    limits: ["Access valid for 7 days", "History saved for 7 days only"],
    popular: true, badge: "Most Popular",
    badgeIcon: <Star className="w-3 h-3" />,
    ctaText: "Unlock Resume Fixes",
    ctaIcon: <Zap className="w-4 h-4 ml-2" />,
    microCopy: "Cancel anytime · No long-term commitment",
  },
  {
    name: "Monthly", planKey: "monthly", price: "6.99", period: "month",
    description: "Tailor your resume for every job you apply to this month.",
    features: [
      { name: "Up to 25 job match checks / month", available: true },
      { name: "Everything in Weekly", available: true },
      { name: "Saved resume & job history", available: true },
      { name: "PDF exports", available: true },
      { name: "Priority usage limits", available: true },
    ],
    badge: "Best Value",
    badgeIcon: <Crown className="w-3 h-3" />,
    ctaText: "Get Full Access",
    ctaIcon: <ArrowRight className="w-4 h-4 ml-2" />,
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

  useEffect(() => { gtagEvent("pricing_view"); }, []);

  const handleUpgrade = async (planKey: string) => {
    if (planKey === "free") { navigate("/review"); return; }
    track("Checkout Started", { plan: planKey });
    gtagEvent("checkout_started");
    try {
      setIsLoading(planKey);
      if (!user) { navigate("/auth", { state: { fromPricing: true, selectedPlan: planKey } }); return; }
      toast({ title: "Preparing checkout...", description: "You'll be redirected to the payment page shortly." });
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { plan: planKey } });
      if (error) throw new Error(`Checkout error: ${error.message}`);
      if (data?.url) { setTimeout(() => { window.location.href = data.url; }, 300); }
      else throw new Error("No checkout URL returned from server");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({ title: "Payment Error", description: error instanceof Error ? error.message : "Could not initiate checkout.", variant: "destructive" });
    } finally { setIsLoading(null); }
  };

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden" ref={pricingRef}>
      <FloatingOrbs variant="section" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Simple, Transparent Pricing</span>
          </motion.div>
          
          <motion.h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Choose the Plan That Fits{" "}
            <span className="gradient-text-animated">Your Job Search</span>
          </motion.h2>
          
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the feedback you need to land interviews.
          </motion.p>
          
          {(stats.plan === 'weekly' || stats.plan === 'monthly') && (
            <motion.div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-emerald-700">You're on the {stats.plan === 'weekly' ? 'Weekly' : 'Monthly'} Plan</span>
            </motion.div>
          )}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative flex flex-col h-full rounded-3xl border-2 transition-all duration-300 overflow-hidden bg-card
                  ${plan.popular 
                    ? 'border-primary shadow-glow-violet' 
                    : plan.badge 
                      ? 'border-accent shadow-glow-cyan'
                      : 'border-border hover:border-primary/30 shadow-card hover:shadow-premium'
                  }
                  ${stats.plan === plan.planKey ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
                `}
              >
                {plan.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 z-10">
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-b-xl shadow-md text-white
                      ${plan.popular ? 'cta-gradient' : 'bg-gradient-to-r from-emerald-500 to-brand-cyan'}`}
                    >
                      {plan.badgeIcon}{plan.badge}
                    </div>
                  </div>
                )}
                
                {stats.plan === plan.planKey && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-700 rounded-full">
                      <Check className="w-3 h-3" />Current
                    </div>
                  </div>
                )}
                
                <div className="p-6 pt-8 flex flex-col flex-grow">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">£{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground font-medium">/{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground mt-3 text-sm">{plan.description}</p>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mb-4">
                    <Button 
                      className={`w-full font-semibold py-6 rounded-xl transition-all
                        ${plan.popular 
                          ? "cta-gradient text-white shadow-cta" 
                          : plan.badge
                            ? "bg-gradient-to-r from-emerald-500 to-brand-cyan text-white shadow-glow-cyan"
                            : "bg-foreground hover:bg-foreground/90 text-background"
                        }`}
                      onClick={() => handleUpgrade(plan.planKey)}
                      disabled={stats.plan === plan.planKey || isLoading === plan.planKey}
                      isLoading={isLoading === plan.planKey}
                    >
                      {stats.plan === plan.planKey ? (<><Check className="w-4 h-4 mr-2" />Current Plan</>) : (<>{plan.ctaText}<span className="group-hover/btn:translate-x-1 transition-transform">{plan.ctaIcon}</span></>)}
                    </Button>
                  </motion.div>
                  
                  <p className="text-xs text-muted-foreground text-center mb-6">{plan.microCopy}</p>
                  
                  <div className="space-y-3 flex-grow">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What you get</p>
                    {plan.features.map((feature, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <div className="mt-0.5 p-0.5 rounded-full bg-emerald-500/10">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.lockedFeatures && plan.lockedFeatures.length > 0 && (
                    <div className="space-y-2 mt-6 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">What's locked</p>
                      {plan.lockedFeatures.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-3 text-muted-foreground/60">
                          <X className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {plan.limits && plan.limits.length > 0 && (
                    <div className="space-y-2 mt-6 pt-4 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Limits</p>
                      {plan.limits.map((l, li) => (
                        <div key={li} className="flex items-start gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                          <span className="text-xs">{l}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div className="mt-16 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-muted-foreground mb-4">Need a custom solution for your team?</p>
          <Button variant="outline" className="border-2 border-border hover:border-primary/30 rounded-xl px-6" asChild>
            <Link to="/contact">Contact Us for Enterprise Plans</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
