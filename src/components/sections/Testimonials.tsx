import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const testimonials = [
  {
    text: "The section-by-section analysis helped me understand exactly what was missing from my resume. After implementing the suggestions, I got more interview calls within weeks.",
    author: "Sarah Chen",
    role: "Senior Product Manager",
    initial: "SC",
    company: "Tech Industry"
  },
  {
    text: "As a software engineer, I was skeptical, but the tool actually caught missing technical keywords and helped me quantify my achievements. The difference was immediate in callback rates.",
    author: "Alex Rodriguez",
    role: "Full-Stack Engineer",
    initial: "AR",
    company: "Startup"
  },
  {
    text: "As someone transitioning into UX design, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a design context that recruiters understand.",
    author: "Priya Sharma",
    role: "UX Designer",
    initial: "PS",
    company: "E-commerce"
  },
  {
    text: "Being a recent grad, I had no idea how to make my resume stand out. The detailed feedback showed me exactly how to position my projects and internships to land my first job.",
    author: "Jason Lee",
    role: "Junior Developer",
    initial: "JL",
    company: "Agency"
  },
  {
    text: "Switching from finance to tech was daunting, but the tool helped me translate my skills into tech-friendly language. The STAR format suggestions were game-changing.",
    author: "Maya Johnson",
    role: "Business Analyst",
    initial: "MJ",
    company: "Finance"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-12 md:py-16 relative overflow-hidden">
      {/* Floating orbs */}
      <FloatingOrbs variant="section" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-left mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-white text-warm-accent border-warm-accent/20">
              Success Stories
            </Badge>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-warm-text mb-6 leading-tight"
          >
            Trusted by Job Seekers<br />Across<span className="gradient-text-animated ml-2">All Roles</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 max-w-2xl"
          >
            From analysts to engineers to managers — MatchRate helps candidates stand out.
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="testimonial-card glassmorphism h-full flex flex-col py-8 px-6 cursor-pointer"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Quote className="w-10 h-10 text-warm-accent/20 mb-4" />
                    </motion.div>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-slate-700 text-lg mb-8 flex-grow italic">{testimonial.text}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-warm-accent/10 text-warm-accent font-semibold">
                            {testimonial.initial}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div className="text-left">
                        <div className="font-bold text-warm-text text-lg">{testimonial.author}</div>
                        <div className="text-slate-700 text-sm font-medium">{testimonial.role}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <motion.div 
                            className="w-3 h-3 rounded-full bg-emerald-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-slate-500 text-xs">{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-10 gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <CarouselPrevious className="static transform-none mx-2 bg-white border border-gray-200 hover:bg-warm-accent hover:text-white hover:border-warm-accent transition-colors" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <CarouselNext className="static transform-none mx-2 bg-white border border-gray-200 hover:bg-warm-accent hover:text-white hover:border-warm-accent transition-colors" />
              </motion.div>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
