import { AlertCircle, Target, MessageSquare, Lightbulb, Palette, UserCheck, FileSearch, ListChecks, Zap, Eye } from "lucide-react";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import AnimatedCard from "@/components/ui/AnimatedCard";

const features = [
  {
    title: "Understand Why You're Being Rejected",
    description: "Identify weak sections, flagged issues & low-impact bullets instantly.",
    icon: AlertCircle,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    title: "Get Laser-Focused Keyword Matching",
    description: "Get ATS & JD keyword matching with missing skills highlighted automatically.",
    icon: Target,
    gradient: "from-brand-indigo to-brand-violet",
  },
  {
    title: "Transform Your Bullet Points",
    description: "Rewrite bullets using STAR format, measurable impact & strong action verbs.",
    icon: MessageSquare,
    gradient: "from-brand-violet to-purple-600",
  },
  {
    title: "Receive Expert-Level Insights",
    description: "Learn exactly what recruiters see — formatting errors, parsing issues, weak phrases.",
    icon: Lightbulb,
    gradient: "from-brand-coral to-amber-500",
  },
  {
    title: "See Missing Skills",
    description: "Automatically extract missing tools, skills & competencies from any job description.",
    icon: Eye,
    gradient: "from-emerald-500 to-brand-cyan",
  },
  {
    title: "Fix ATS Issues Instantly",
    description: "Detect formatting issues, missing keywords & parsing problems that block your resume.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
  }
];

const additionalFeatures = [
  { title: "Colour-Coded Feedback", description: "Easily see strengths, weaknesses & improvement areas.", icon: Palette },
  { title: "Role-Specific Optimization", description: "Tailor your resume to any job description — instantly.", icon: UserCheck },
  { title: "ATS Compatibility Check", description: "Detect formatting issues, missing keywords & parsing problems.", icon: FileSearch },
  { title: "Missing Skills Insights", description: "Automatically extract missing tools, skills & competencies.", icon: ListChecks },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      <FloatingOrbs variant="subtle" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Choose MatchRate?</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6"
          >
            Stop Guessing Why{" "}
            <span className="gradient-text-animated">Your Resume Isn't</span>
            <br className="hidden md:block" /> Getting Interviews
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Built for real job seekers — not generic ChatGPT output.
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <AnimatedCard key={index} delay={index * 0.1} hover3D className="feature-card group">
              <div className="flex gap-5 items-start">
                <motion.div 
                  className={`icon-circle bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glassmorphism rounded-3xl p-8 md:p-12 border-gradient-animated"
        >
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-10"
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
                className="glassmorphism rounded-2xl p-6 cursor-pointer text-center"
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h4 className="text-base font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
