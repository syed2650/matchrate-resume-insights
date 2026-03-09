import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UsageLimitModal from "@/pages/review/components/UsageLimitModal";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const CallToAction = () => {
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);

  return (
    <section className="py-24 md:py-32 hero-dark relative overflow-hidden">
      <FloatingOrbs variant="section" />
      
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-brand-violet/30 to-brand-cyan/20 rounded-full blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-brand-coral/30 to-brand-violet/20 rounded-full blur-[80px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <div className="container max-w-2xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium border border-white/10">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            Powered by ChatGPT 5.2
          </span>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Ready to <span className="gradient-text-animated">Improve Your Resume</span>?
        </motion.h2>
        
        <motion.p 
          className="text-lg text-white/50 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Get instant AI-powered resume feedback and discover exactly what's holding you back.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              className="cta-gradient text-white px-10 py-7 text-lg rounded-2xl shadow-cta font-bold"
              onClick={() => navigate("/review")}
            >
              Analyze My Resume Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-brand-coral/50 text-brand-coral hover:bg-brand-coral hover:text-white px-10 py-7 text-lg rounded-2xl font-bold transition-all"
              onClick={() => navigate('/lovable')}
            >
              <Flame className="mr-2 w-5 h-5" />
              Try Resume Roast
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <UsageLimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
    </section>
  );
};

export default CallToAction;
