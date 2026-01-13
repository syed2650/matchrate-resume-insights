import { HelpCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Matchrate.co?",
    answer: "Matchrate.co is an AI-powered platform that analyzes your resume, evaluates your ATS readiness, identifies missing keywords, and provides actionable feedback — helping you significantly improve your chances of getting interviews."
  },
  {
    question: "How does the resume analysis work?",
    answer: "We use a combination of professional resume standards, recruiter best practices, and AI-driven analysis to: Assess the relevance of your resume to a job description, Check your resume's ATS compatibility, Identify missing keywords and skills gaps, Suggest section-by-section improvements, Rewrite resume bullets using the STAR method (Action + Result), and Provide a final \"Would I Interview You?\" verdict."
  },
  {
    question: "What is an ATS, and why does it matter?",
    answer: "An ATS (Applicant Tracking System) is software used by companies to automatically scan, filter, and rank resumes. If your resume isn't ATS-optimized, it may never even reach a human recruiter. We make sure your resume is formatted and keyworded correctly to pass these systems."
  },
  {
    question: "How accurate are the scores?",
    answer: "Our scoring models are built using real-world data from hiring managers, recruiters, and ATS parsing patterns. While no tool can guarantee a job, Matchrate.co gives you the clearest possible picture of your resume's strengths and weaknesses."
  },
  {
    question: "What do I get after analysis?",
    answer: "You get a full feedback report, Relevance Score and ATS Readiness Score, Actionable fixes to improve your resume immediately, and optionally, a professionally rewritten resume (for premium users)."
  },
  {
    question: "Is my data safe?",
    answer: "100%. We do NOT sell, share, or store your resumes longer than necessary. Our platform is built with privacy and security as top priorities."
  },
  {
    question: "How much does Matchrate.co cost?",
    answer: "We offer: Free Plan with 1 resume review per day, and Paid Plans that unlock 30 reviews and 15 professional rewrites monthly. Full pricing details are on our Pricing Page."
  },
  {
    question: "Do you offer refunds?",
    answer: "We do not offer refunds, as resume analysis and rewriting are instant digital services. However, we are committed to customer satisfaction, and if you face any issues, please contact our support team."
  },
  {
    question: "Can Matchrate.co guarantee a job offer?",
    answer: "While we significantly improve your chances by strengthening your resume, we cannot guarantee job placements. We provide you the best possible tools to maximize your success."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us anytime at support@matchrate.co. We usually respond within 24 hours!"
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-warm-bg relative overflow-hidden">
      <FloatingOrbs count={5} />
      
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
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">FAQ</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="animated-gradient-text">Questions</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about MatchRate and how we help you land more interviews.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="glassmorphism rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold text-warm-text hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <motion.a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
