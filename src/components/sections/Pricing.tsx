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
  badgeIcon?: React.ReactNode;
  ctaText: string;
  ctaIcon?: React.ReactNode;
  microCopy: string;
  gradient?: string;
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
    ctaIcon: <ArrowRight className="w-4 h-4 ml-2" />,
    microCopy: "No card required · Takes under 60 seconds",
    gradient: "from-slate-50 to-slate-100/50",
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
    badge: "Most Popular",
    badgeIcon: <Star className="w-3 h-3" />,
    ctaText: "Unlock Resume Fixes",
    ctaIcon: <Zap className="w-4 h-4 ml-2" />,
    microCopy: "Cancel anytime · No long-term commitment",
    gradient: "from-amber-50/80 via-orange-50/60 to-rose-50/40",
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
    badgeIcon: <Crown className="w-3 h-3" />,
    ctaText: "Get Full Access",
    ctaIcon: <ArrowRight className="w-4 h-4 ml-2" />,
    microCopy: "Best value for active job seekers · Cancel anytime",
    gradient: "from-emerald-50/80 via-teal-50/60 to-cyan-50/40",
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
    gtagEvent("pricing_view");
  }, []);

  const handleUpgrade = async (planKey: string) => {
    if (planKey === "free") {
      navigate("/review");
    } else {
      track("Checkout Started", { plan: planKey });
      gtagEvent("checkout_started");
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
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden" ref={pricingRef}>
      <FloatingOrbs variant="section" />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
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
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200/50 mb-6"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Simple, Transparent Pricing</span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-warm-text mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Choose the Plan That Fits{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Your Job Search
            </span>
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Get the feedback you need to land interviews, with plans designed for every stage of your job search.
          </motion.p>
          
          {(stats.plan === 'weekly' || stats.plan === 'monthly') && (
            <motion.div 
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-emerald-700">
                You're on the {stats.plan === 'weekly' ? 'Weekly' : 'Monthly'} Plan
              </span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`relative group`}
            >
              {/* Card */}
              <motion.div
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className={`relative flex flex-col h-full rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  ${plan.popular 
                    ? 'border-amber-400 shadow-xl shadow-amber-100/50 bg-gradient-to-br ' + plan.gradient
                    : plan.badge 
                      ? 'border-emerald-300 shadow-lg shadow-emerald-50/50 bg-gradient-to-br ' + plan.gradient
                      : 'border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg bg-gradient-to-br ' + plan.gradient
                  }
                  ${stats.plan === plan.planKey ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
                `}
              >
                {/* Popular/Best Value Badge */}
                {plan.badge && (
                  <div className={`absolute -top-px left-1/2 -translate-x-1/2 z-10`}>
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-b-xl shadow-md
                      ${plan.popular 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      }`}
                    >
                      {plan.badgeIcon}
                      {plan.badge}
                    </div>
                  </div>
                )}
                
                {/* Current Plan Badge */}
                {stats.plan === plan.planKey && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                      <Check className="w-3 h-3" />
                      Current
                    </div>
                  </div>
                )}
                
                {/* Card Content */}
                <div className="p-6 pt-8 flex flex-col flex-grow">
                  {/* Plan Name & Price */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-warm-text mb-3">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-warm-text">£{plan.price}</span>
                      {plan.period && (
                        <span className="text-slate-500 font-medium">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed">{plan.description}</p>
                  </div>
                  
                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-4"
                  >
                    <Button 
                      className={`w-full font-semibold py-6 rounded-xl transition-all duration-200 group/btn
                        ${plan.popular 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50" 
                          : plan.badge
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/50"
                            : "bg-warm-text hover:bg-warm-text/90 text-white"
                        }`}
                      onClick={() => handleUpgrade(plan.planKey)}
                      disabled={stats.plan === plan.planKey || isLoading === plan.planKey}
                      isLoading={isLoading === plan.planKey}
                    >
                      {stats.plan === plan.planKey ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          {plan.ctaText}
                          <span className="group-hover/btn:translate-x-1 transition-transform">
                            {plan.ctaIcon}
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  {/* Micro-copy */}
                  <p className="text-xs text-slate-500 text-center mb-6">{plan.microCopy}</p>
                  
                  {/* Features */}
                  <div className="space-y-3 flex-grow">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">What you get</p>
                    {plan.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * featureIndex }}
                        viewport={{ once: true }}
                      >
                        <div className="mt-0.5 p-0.5 rounded-full bg-emerald-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-sm text-slate-700 leading-tight">
                          {feature.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Locked Features (Free plan only) */}
                  {plan.lockedFeatures && plan.lockedFeatures.length > 0 && (
                    <div className="space-y-2 mt-6 pt-4 border-t border-slate-200/60">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What's locked</p>
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
                    <div className="space-y-2 mt-6 pt-4 border-t border-slate-200/60">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Limits</p>
                      {plan.limits.map((limit, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-2 text-slate-500">
                          <Clock className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                          <span className="text-xs">{limit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Enterprise CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 mb-4">Need a custom solution for your team?</p>
          <Button 
            variant="outline" 
            className="border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl px-6 py-2 transition-all duration-200" 
            asChild
          >
            <Link to="/contact">Contact Us for Enterprise Plans</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
