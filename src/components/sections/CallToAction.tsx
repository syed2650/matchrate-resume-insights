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

  const handleTryClick = () => {
    navigate("/review");
  };

  const handleCloseLimitModal = () => {
    setShowLimitModal(false);
  };

  return (
    <section className="py-20 md:py-28 hero-gradient border-y border-slate-100 relative overflow-hidden">
      <FloatingOrbs variant="section" />
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-warm-accent/20 to-orange-400/20 rounded-full blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <div className="container max-w-2xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-accent/10 text-warm-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Powered by ChatGPT 5.2
          </span>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-warm-text mb-4 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Ready to <span className="animated-gradient-text">Improve Your Resume</span>?
        </motion.h2>
        
        <motion.p 
          className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto"
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
              className="bg-warm-accent hover:bg-warm-accent/90 transition-all duration-200 text-white px-9 py-4 text-lg rounded-xl shadow-lg font-semibold flex items-center gap-2 glow-effect"
              onClick={handleTryClick}
            >
              Analyze My Resume Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-9 py-4 text-lg rounded-xl font-semibold transition-all duration-200"
              onClick={() => navigate('/lovable')}
            >
              <Flame className="mr-2 w-5 h-5" />
              Try Resume Roast
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <UsageLimitModal 
        isOpen={showLimitModal} 
        onClose={handleCloseLimitModal} 
      />
    </section>
  );
};

export default CallToAction;
