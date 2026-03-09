import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

const testimonials = [
  { text: "The section-by-section analysis helped me understand exactly what was missing from my resume. After implementing the suggestions, I got more interview calls within weeks.", author: "Sarah Chen", role: "Senior Product Manager", initial: "SC", company: "Tech Industry" },
  { text: "As a software engineer, I was skeptical, but the tool actually caught missing technical keywords and helped me quantify my achievements. The difference was immediate in callback rates.", author: "Alex Rodriguez", role: "Full-Stack Engineer", initial: "AR", company: "Startup" },
  { text: "As someone transitioning into UX design, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a design context that recruiters understand.", author: "Priya Sharma", role: "UX Designer", initial: "PS", company: "E-commerce" },
  { text: "Being a recent grad, I had no idea how to make my resume stand out. The detailed feedback showed me exactly how to position my projects and internships to land my first job.", author: "Jason Lee", role: "Junior Developer", initial: "JL", company: "Agency" },
  { text: "Switching from finance to tech was daunting, but the tool helped me translate my skills into tech-friendly language. The STAR format suggestions were game-changing.", author: "Maya Johnson", role: "Business Analyst", initial: "MJ", company: "Finance" }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 relative overflow-hidden">
      <FloatingOrbs variant="section" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            Success Stories
          </Badge>
          <motion.h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Trusted by Job Seekers<br />Across <span className="gradient-text-animated">All Roles</span>
          </motion.h2>
          <motion.p className="text-muted-foreground max-w-2xl mx-auto">
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
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-card border border-border rounded-2xl h-full flex flex-col py-8 px-6 shadow-card hover:shadow-premium transition-all cursor-pointer"
                  >
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-base mb-8 flex-grow italic leading-relaxed">{testimonial.text}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Avatar className="h-12 w-12 border-2 border-border shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold text-sm">
                          {testimonial.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-bold text-foreground">{testimonial.author}</div>
                        <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-muted-foreground text-xs">{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-10 gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <CarouselPrevious className="static transform-none mx-2 bg-card border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors rounded-xl" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <CarouselNext className="static transform-none mx-2 bg-card border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors rounded-xl" />
              </motion.div>
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
