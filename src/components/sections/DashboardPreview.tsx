import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const screenshots = [
  {
    title: "Resume Improvements",
    headerBg: "bg-blue-50",
    dotColor: "bg-blue-400",
    image: "/lovable-uploads/resume-improvements-screenshot.png",
    alt: "Resume Improvements screenshot showing summary improvement, bullet rewrites, and action verb suggestions",
  },
  {
    title: "ATS Analysis",
    headerBg: "bg-green-50",
    dotColor: "bg-green-400",
    image: "/lovable-uploads/ats-analysis-screenshot.png",
    alt: "ATS Analysis screenshot showing score, formatting issues, and missing keywords",
  },
  {
    title: "JD Match",
    headerBg: "bg-purple-50",
    dotColor: "bg-purple-400",
    image: "/lovable-uploads/jd-match-screenshot.png",
    alt: "JD Match screenshot showing match score, missing skills, and optimized bullets",
  },
  {
    title: "Roast Card",
    headerBg: "bg-orange-50",
    dotColor: "bg-orange-400",
    image: "/lovable-uploads/roast-card-screenshot.png",
    alt: "Roast Card screenshot showing funny roast and real review with scores",
  },
];

const DashboardPreview = () => {
  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Subtle floating orbs */}
      <FloatingOrbs variant="subtle" />
      
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-warm-section to-white"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-warm-accent font-medium text-sm mb-3 uppercase tracking-wider"
          >
            Tool Output
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-warm-text mb-6 leading-tight"
          >
            See Your Resume <span className="gradient-text-animated">Like Recruiters Do</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            Our new clean UI shows improvements, ATS issues, JD match score & roast card results.
          </motion.p>
        </motion.div>
        
        {/* Screenshots Grid */}
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
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200/80 h-[400px] flex flex-col group cursor-pointer"
              >
                <div className={`${screenshot.headerBg} border-b border-slate-100 p-3 flex items-center gap-2 flex-shrink-0`}>
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${screenshot.dotColor}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <span className="text-sm font-medium text-slate-700">{screenshot.title}</span>
                </div>
                <div className="p-4 flex-1 overflow-hidden relative">
                  <motion.img 
                    src={screenshot.image}
                    alt={screenshot.alt}
                    className="w-full h-full object-cover object-top rounded-lg border border-slate-100 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-4 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center pb-4">
                    <motion.span 
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      className="text-white font-medium text-sm bg-warm-accent/90 px-4 py-2 rounded-full"
                    >
                      View Full Analysis →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Decorative elements with animation */}
          <motion.div 
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-warm-accent/5 rounded-full z-[-1]"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div 
            className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full z-[-1]"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
