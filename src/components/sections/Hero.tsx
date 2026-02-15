import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, FileSearch, Target, Flame, Zap, ShieldCheck } from "lucide-react";
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
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
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
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Resume Improvements",
      description: "Get a polished summary, bullet rewrites, impact boosts, redundancy fixes & action verbs.",
      hint: "→ Perfect for improving clarity & impact.",
    },
    {
      icon: FileSearch,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "ATS Analysis",
      description: "Spot formatting issues, missing keywords, parsing errors & get an ATS-safe summary.",
      hint: "→ Improve your chances of passing real ATS scanners.",
    },
    {
      icon: Target,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "JD Match",
      description: "Upload a job description and get a match score, missing skills, optimized bullets & role fit.",
      hint: "→ Perfect for targeted applications.",
    },
    {
      icon: Flame,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Roast Card",
      description: "Get a fun, viral-friendly AI roast of your resume.",
      hint: "→ Great for sharing on LinkedIn, X & Instagram.",
    },
  ];

  return (
    <section className="w-full hero-gradient pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
      {/* Dynamic floating orbs */}
      <FloatingOrbs variant="hero" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      <motion.div 
        className="container max-w-6xl mx-auto px-4 text-center md:text-left flex flex-col items-center md:items-start relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated badge */}
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-effect border border-white/30 shadow-sm text-sm font-medium text-gray-600 mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-warm-accent"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-warm-accent" />
          Powered by ChatGPT 5.2
        </motion.div>

        {/* Animated headline */}
        <motion.h1 
          variants={itemVariants}
          className="mb-6 text-4xl md:text-6xl font-bold text-warm-text leading-tight tracking-tight max-w-4xl"
        >
          Get Your Resume Past ATS <br className="hidden md:block" />
          <span className="gradient-text-animated">in Under 3 Minutes</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mb-4 font-medium"
        >
          Join 10,000+ job seekers who landed interviews with our AI-powered resume optimizer.
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-sm text-slate-500 mb-8 flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          No credit card required for free scan
        </motion.p>
        
        {/* Animated CTA button */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-4 w-full md:w-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300 text-white px-10 py-8 text-lg rounded-xl shadow-lg font-bold ripple glow-on-hover"
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

        {/* Trust signal */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 text-xs text-slate-400 mb-16"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-bit SSL Encryption
          </span>
          <span>•</span>
          <span>Your data is private</span>
          <span>•</span>
          <span>PDF, DOCX, or Text</span>
        </motion.div>

        {/* Choose Your AI Tools Section */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-5xl mx-auto mt-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-8"
          >
            Choose Your AI Tools
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <AnimatedCard
                key={tool.title}
                delay={index * 0.1}
                hover3D
                glowOnHover
                className="bg-white rounded-xl shadow-lg p-6 border border-slate-100"
              >
                <motion.div 
                  className={`w-12 h-12 rounded-full ${tool.iconBg} flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                <p className="text-xs text-slate-500 italic">{tool.hint}</p>
              </AnimatedCard>
            ))}
          </div>
        </motion.div>
        
        {/* How It Works Section */}
        <div className="w-full max-w-5xl mx-auto mt-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-8"
          >
            How MatchRate Works in 3 Simple Steps
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "/lovable-uploads/41e02388-22a6-400b-9409-977ae2d23cc8.png",
                alt: "Upload your resume",
                step: "STEP 1",
                title: "Upload Resume",
                description: "One-click upload — supports PDF, DOCX, or paste text. No signup required.",
              },
              {
                image: "/lovable-uploads/daaf6c67-e6aa-4d91-bb27-57e463c4f421.png",
                alt: "Get your instant ATS score",
                step: "STEP 2",
                title: "Get Instant Score",
                description: "See your ATS compatibility score immediately with keyword analysis and formatting checks.",
              },
              {
                image: "/lovable-uploads/076ae941-c3a2-462d-a9a1-c74272f1cbdf.png",
                alt: "Fix and download your resume",
                step: "STEP 3",
                title: "Fix & Download",
                description: "Get specific improvements to optimize your resume. Download results as PDF anytime.",
              },
            ].map((step, index) => (
              <AnimatedCard
                key={step.step}
                delay={index * 0.15}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-1 bg-gradient-to-r from-warm-accent/80 to-blue-500/80">
                  <div className="bg-white p-2 rounded-t-lg">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden group">
                  <motion.img 
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <span className="bg-warm-accent text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                        {step.step}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.description}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Built With section */}
      <div className="py-12 border-t border-gray-100/80 bg-white/70 backdrop-blur-sm mt-24">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm uppercase tracking-wider text-gray-500 font-medium mb-8"
          >
            Built with industry-leading technology
          </motion.p>
          <div className="overflow-hidden">
            <div className="marquee">
              <div className="marquee-content">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-12">
                    <motion.div 
                      className="tech-stack-item"
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="font-medium">ChatGPT 5.2</span>
                    </motion.div>
                    <motion.div 
                      className="tech-stack-item"
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-violet-500">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                      </div>
                      <span className="font-medium">Claude</span>
                    </motion.div>
                    <motion.div 
                      className="tech-stack-item"
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-pink-500">
                          <path d="M12 2l9 4.9V17L12 22l-9-4.9V7z"/>
                        </svg>
                      </div>
                      <span className="font-medium">Lovable</span>
                    </motion.div>
                    <motion.div 
                      className="tech-stack-item"
                      whileHover={{ scale: 1.05, y: -3 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-500">
                          <polyline points="4 7 4 4 20 4 20 7"></polyline>
                          <line x1="9" y1="20" x2="15" y2="20"></line>
                          <line x1="12" y1="4" x2="12" y2="20"></line>
                        </svg>
                      </div>
                      <span className="font-medium">Supabase</span>
                    </motion.div>
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
