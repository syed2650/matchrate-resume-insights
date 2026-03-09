import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const screenshots = [
  { title: "Resume Improvements", gradient: "from-brand-violet/10 to-brand-indigo/10", dotColor: "bg-brand-violet", image: "/lovable-uploads/resume-improvements-screenshot.png", alt: "Resume Improvements screenshot" },
  { title: "ATS Analysis", gradient: "from-emerald-500/10 to-brand-cyan/10", dotColor: "bg-emerald-500", image: "/lovable-uploads/ats-analysis-screenshot.png", alt: "ATS Analysis screenshot" },
  { title: "JD Match", gradient: "from-brand-indigo/10 to-brand-cyan/10", dotColor: "bg-brand-indigo", image: "/lovable-uploads/jd-match-screenshot.png", alt: "JD Match screenshot" },
  { title: "Roast Card", gradient: "from-brand-coral/10 to-amber-500/10", dotColor: "bg-brand-coral", image: "/lovable-uploads/roast-card-screenshot.png", alt: "Roast Card screenshot" },
];

const DashboardPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <FloatingOrbs variant="subtle" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">Tool Output</span>
          </motion.div>
          <motion.h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            See Your Resume <span className="gradient-text-animated">Like Recruiters Do</span>
          </motion.h2>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto">
            Our clean UI shows improvements, ATS issues, JD match score & roast card results.
          </motion.p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {screenshots.map((screenshot, index) => (
              <motion.div
                key={screenshot.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-card rounded-2xl shadow-card overflow-hidden border border-border h-[400px] flex flex-col group cursor-pointer hover:shadow-premium transition-all"
              >
                <div className={`bg-gradient-to-r ${screenshot.gradient} border-b border-border p-3 flex items-center gap-2 flex-shrink-0`}>
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${screenshot.dotColor}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <span className="text-sm font-medium text-foreground/70">{screenshot.title}</span>
                </div>
                <div className="p-4 flex-1 overflow-hidden relative">
                  <img 
                    src={screenshot.image}
                    alt={screenshot.alt}
                    className="w-full h-full object-cover object-top rounded-xl border border-border transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-4 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-4">
                    <span className="text-white font-medium text-sm cta-gradient px-4 py-2 rounded-full">
                      View Full Analysis →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
