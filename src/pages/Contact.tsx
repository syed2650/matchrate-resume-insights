import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";
import { Mail, Clock, Send, MessageSquare } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setSubject("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-warm-bg font-sans relative overflow-hidden">
      <FloatingOrbs variant="hero" />
      
      <main className="relative z-10">
        <div className="container-content max-w-screen-xl mx-auto px-4 py-16">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-warm-text mb-4">
              Contact <span className="animated-gradient-text">Us</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Have a question or need help? Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div 
              className="glassmorphism p-8 rounded-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  ></textarea>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="cta-gradient w-full text-white py-3 rounded-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            <div className="flex flex-col justify-center gap-6">
              <motion.div 
                className="glassmorphism p-8 rounded-2xl"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Us
                </h2>
                <p className="text-slate-600">
                  Send us an email directly at:{" "}
                  <a href="mailto:support@matchrate.co" className="text-primary font-medium hover:underline">
                    support@matchrate.co
                  </a>
                </p>
              </motion.div>
              
              <motion.div 
                className="glassmorphism p-8 rounded-2xl"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Office Hours
                </h2>
                <p className="text-slate-600 mb-2">
                  Monday - Friday: 9:00 AM - 5:00 PM EST
                </p>
                <p className="text-slate-600">
                  We aim to respond to all inquiries within 24-48 business hours.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
