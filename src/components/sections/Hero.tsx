import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, FileSearch, Target, Flame, Zap, ShieldCheck, Upload, BarChart3, Download } from "lucide-react";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { track } from "@/lib/mixpanel";

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const tools = [
    {
      icon: Sparkles,
      gradient: "from-brand-violet to-brand-indigo",
      title: "Resume Improvements",
      description: "Polished summary, bullet rewrites, impact boosts & action verbs.",
      hint: "→ Perfect for improving clarity & impact.",
    },
    {
      icon: FileSearch,
      gradient: "from-emerald-500 to-brand-cyan",
      title: "ATS Analysis",
      description: "Spot formatting issues, missing keywords & parsing errors.",
      hint: "→ Pass real ATS scanners.",
    },
    {
      icon: Target,
      gradient: "from-brand-indigo to-brand-cyan",
      title: "JD Match",
      description: "Match score, missing skills, optimized bullets & role fit.",
      hint: "→ Perfect for targeted applications.",
    },
    {
      icon: Flame,
      gradient: "from-brand-coral to-amber-500",
      title: "Roast Card",
      description: "Fun, viral-friendly AI roast of your resume.",
      hint: "→ Great for sharing on social media.",
    },
  ];

  const steps = [
    { icon: Upload, step: "01", title: "Upload Resume", description: "One-click upload — supports PDF, DOCX, or paste text.", image: "/lovable-uploads/41e02388-22a6-400b-9409-977ae2d23cc8.png" },
    { icon: BarChart3, step: "02", title: "Get Instant Score", description: "ATS compatibility score with keyword analysis instantly.", image: "/lovable-uploads/daaf6c67-e6aa-4d91-bb27-57e463c4f421.png" },
    { icon: Download, step: "03", title: "Fix & Download", description: "Get specific improvements. Download results as PDF.", image: "/lovable-uploads/076ae941-c3a2-462d-a9a1-c74272f1cbdf.png" },
  ];

  return (
    <section className="w-full hero-dark pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
      <FloatingOrbs variant="hero" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>
      
      <motion.div 
        className="container max-w-6xl mx-auto px-4 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-sm font-medium text-white/80 mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-brand-cyan" />
          Powered by ChatGPT 5.2
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="mb-6 text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl mx-auto"
        >
          Get Your Resume Past ATS{" "}
          <span className="gradient-text-animated">in Under 3 Minutes</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4 font-medium"
        >
          Join 10,000+ job seekers who landed interviews with our AI-powered resume optimizer.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-sm text-white/40 mb-10 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-brand-cyan" />
          No credit card required for free scan
        </motion.p>
        
        {/* CTA */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-brand-violet to-brand-indigo hover:shadow-glow-violet transition-all duration-300 text-white px-10 py-7 text-lg rounded-2xl shadow-cta font-bold ripple"
              onClick={() => {
                track("CTA Clicked", { location: "hero", label: "Scan My Resume Free" });
                navigate("/review");
              }}
            >
              Scan My Resume Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 text-xs text-white/30 mb-20"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-bit SSL
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Your data is private</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>PDF, DOCX, or Text</span>
        </motion.div>

        {/* AI Tools Cards */}
        <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto mt-4">
          <motion.h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Choose Your AI Tools
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, index) => (
              <AnimatedCard
                key={tool.title}
                delay={index * 0.1}
                hover3D
                glowOnHover
                className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-left"
              >
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <tool.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-white/50 mb-3">{tool.description}</p>
                <p className="text-xs text-brand-cyan/70 font-medium">{tool.hint}</p>
              </AnimatedCard>
            ))}
          </div>
        </motion.div>
        
        {/* How It Works */}
        <div className="w-full max-w-5xl mx-auto mt-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
          >
            How MatchRate Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <AnimatedCard key={step.step} delay={index * 0.15} className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <div className="relative overflow-hidden group">
                  <motion.img 
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 to-transparent flex items-end">
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-brand-cyan text-xs font-bold tracking-wider">{step.step}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm">{step.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Built With */}
      <div className="py-12 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm mt-24">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs uppercase tracking-[0.2em] text-white/30 font-medium mb-8"
          >
            Built with industry-leading technology
          </motion.p>
          <div className="overflow-hidden">
            <div className="marquee">
              <div className="marquee-content">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-12">
                    {[
                      { name: "ChatGPT 5.2", color: "bg-emerald-500/20", iconColor: "text-emerald-400" },
                      { name: "Claude", color: "bg-violet-500/20", iconColor: "text-violet-400" },
                      { name: "Lovable", color: "bg-pink-500/20", iconColor: "text-pink-400" },
                      { name: "Supabase", color: "bg-brand-cyan/20", iconColor: "text-brand-cyan" },
                    ].map((tech) => (
                      <motion.div 
                        key={`${i}-${tech.name}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] rounded-xl border border-white/10"
                        whileHover={{ scale: 1.05, y: -3 }}
                      >
                        <div className={`w-5 h-5 rounded-full ${tech.color} flex items-center justify-center`}>
                          <Zap className={`w-3 h-3 ${tech.iconColor}`} />
                        </div>
                        <span className="font-medium text-white/70 text-sm">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
