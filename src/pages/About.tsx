import { Info, CheckCircle2, Sparkles, Target, Shield, Zap } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { InternalLinkNav } from "@/components/InternalLinkNav";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About MatchRate",
    "description": "Learn about MatchRate.co - AI-powered resume analysis and optimization platform helping job seekers land more interviews through expert feedback and ATS optimization.",
    "url": "https://www.matchrate.co/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "MatchRate",
      "url": "https://www.matchrate.co",
      "logo": "https://www.matchrate.co/lovable-uploads/1995df7f-73f3-4583-9980-04dc5569cd1d.png",
      "description": "AI-powered resume analysis and feedback tailored to specific job descriptions.",
      "foundingDate": "2024",
      "founder": {
        "@type": "Organization",
        "name": "MatchRate Team"
      },
      "serviceArea": "Global",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Resume Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI Resume Analysis",
              "description": "Expert AI feedback on resumes tailored to specific job descriptions"
            }
          }
        ]
      }
    }
  };

  const features = [
    { icon: Target, title: "Real AI Feedback", description: "Trained on thousands of hiring patterns" },
    { icon: Zap, title: "Instant Action Plans", description: "Fix your resume immediately" },
    { icon: Shield, title: "ATS Readiness", description: "Boost your interview chances" },
    { icon: Sparkles, title: "Pro Rewrites", description: "Maximize application success" },
  ];

  return (
    <>
      <SEOHead
        title="About MatchRate - AI Resume Analysis & Career Optimization Platform"
        description="Learn about MatchRate.co - AI-powered resume analysis and optimization platform helping job seekers land more interviews through expert feedback and ATS optimization."
        keywords="about matchrate, resume analysis company, AI career platform, resume optimization service, job application help"
        canonicalUrl="https://www.matchrate.co/about"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-warm-bg relative overflow-hidden">
        <FloatingOrbs variant="hero" />
        
        <div className="container max-w-screen-xl mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Info className="h-5 w-5" />
              <span className="font-medium">About Us</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="animated-gradient-text">Matchrate.co</span>
            </h1>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="glassmorphism rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-warm-text">Revolutionizing Resume Reviews and Job Matching</h2>
              <p className="text-lg text-slate-600 mb-6">
                At Matchrate.co, we believe that landing your dream job shouldn't be a guessing game.
                We are here to empower job seekers by providing honest, actionable, and professional feedback on their resumes — using cutting-edge AI technology, fine-tuned specifically for resume optimization, ATS compatibility, and real-world hiring practices.
              </p>
              
              <p className="text-slate-600 mb-6">
                Every resume you upload isn't just "analyzed" — it is optimized against modern recruiter expectations and applicant tracking systems (ATS).
                Our mission is simple: help you match better, faster, and smarter with the roles you deserve.
              </p>
              
              <p className="text-slate-600">
                We've built Matchrate.co because job seekers deserve clarity, fairness, and tools that actually work — not just another vague "score" or gimmicky advice.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6 text-warm-text">Why Matchrate.co?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glassmorphism rounded-xl p-6 flex items-start gap-4"
                  >
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-text mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.p 
              className="text-slate-600 mb-8 text-center text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Whether you're a fresh graduate, a career switcher, or an experienced executive —<br/>
              <span className="font-semibold text-warm-text">Matchrate.co is your secret weapon to stand out.</span>
            </motion.p>

            <motion.div 
              className="glassmorphism rounded-2xl p-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-warm-text">Our Promise</h2>
              <div className="space-y-3 text-slate-600">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  No jargon. No fake scores. Just actionable results.
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Transparent. Professional. Built for real-world hiring.
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Your success is our mission.
                </p>
              </div>
              <p className="mt-6 text-lg font-medium text-warm-text">
                Welcome to Matchrate.co — Where Resumes Get Smarter.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-xl font-semibold mb-3">Ready to optimize your resume?</h3>
              <p className="text-slate-600 mb-6">
                Join thousands of job seekers who have improved their interview rates with our AI-powered resume analysis.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.a 
                  href="/review" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Analysis
                </motion.a>
                <motion.a 
                  href="/blog" 
                  className="inline-flex items-center px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Read Success Stories
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <InternalLinkNav currentPage="about" />
    </>
  );
}