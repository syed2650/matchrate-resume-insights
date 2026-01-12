import { AlertCircle, Target, MessageSquare, Lightbulb, Palette, UserCheck, FileSearch, ListChecks, Zap, Eye } from "lucide-react";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import AnimatedCard from "@/components/ui/AnimatedCard";

const features = [
  {
    title: "Understand Why You're Being Rejected",
    description: "Identify weak sections, flagged issues & low-impact bullets instantly.",
    icon: AlertCircle,
    bgColor: "bg-rose-500/90"
  },
  {
    title: "Get Laser-Focused Keyword Matching",
    description: "Get ATS & JD keyword matching with missing skills highlighted automatically.",
    icon: Target,
    bgColor: "bg-indigo-500/90"
  },
  {
    title: "Transform Your Bullet Points",
    description: "Rewrite bullets using STAR format, measurable impact & strong action verbs.",
    icon: MessageSquare,
    bgColor: "bg-violet-500/90"
  },
  {
    title: "Receive Expert-Level Insights",
    description: "Learn exactly what recruiters see — including formatting errors, parsing issues, weak phrases & redundancies.",
    icon: Lightbulb,
    bgColor: "bg-warm-accent/90"
  },
  {
    title: "See Missing Skills",
    description: "Automatically extract missing tools, skills & competencies from any job description.",
    icon: Eye,
    bgColor: "bg-emerald-500/90"
  },
  {
    title: "Fix ATS Issues Instantly",
    description: "Detect formatting issues, missing keywords & parsing problems that block your resume.",
    icon: Zap,
    bgColor: "bg-amber-500/90"
  }
];

const additionalFeatures = [
  {
    title: "Colour-Coded Resume Feedback",
    description: "Easily see strengths, weaknesses & improvement areas.",
    icon: Palette,
  },
  {
    title: "Role-Specific Optimization",
    description: "Tailor your resume to any job description — instantly.",
    icon: UserCheck,
  },
  {
    title: "ATS Compatibility Check",
    description: "Detect formatting issues, missing keywords & parsing problems.",
    icon: FileSearch,
  },
  {
    title: "Missing Skills Insights",
    description: "Automatically extract missing tools, skills & competencies from the JD.",
    icon: ListChecks,
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section id="features" className="py-12 md:py-16 bg-transparent relative overflow-hidden">
      {/* Subtle floating orbs */}
      <FloatingOrbs variant="subtle" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider"
          >
            Why Choose Matchrate?
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-warm-text leading-tight mb-6"
          >
            Stop Guessing Why <span className="gradient-text-animated">Your Resume Isn't</span><br className="hidden md:block" /> Getting Interviews
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-slate-600 max-w-3xl"
          >
            Built for real job seekers — not generic ChatGPT output.
          </motion.p>
        </motion.div>
        
        {/* Main features - larger cards with animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <AnimatedCard
              key={index}
              delay={index * 0.1}
              hover3D
              className="feature-card group"
            >
              <div className="flex gap-6 items-start">
                <motion.div 
                  className={`icon-circle ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-warm-text mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
        
        {/* Secondary features - smaller cards with glass effect */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glassmorphism rounded-2xl p-8 md:p-12 border-gradient-animated"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-left mb-10"
          >
            Additional Powerful Features
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glassmorphism rounded-xl p-6 cursor-pointer"
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-warm-accent/10 flex items-center justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-warm-accent" />
                </motion.div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
