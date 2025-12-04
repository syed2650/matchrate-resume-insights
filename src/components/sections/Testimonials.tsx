import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect } from "react";

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
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const testimonialElements = document.querySelectorAll('.testimonial-animated');
    testimonialElements.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      testimonialElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-28 relative overflow-hidden" ref={testimonialRef}>
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-warm-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-left mb-16 fade-in testimonial-animated">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-white text-warm-accent border-warm-accent/20">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text mb-6 leading-tight">
            Trusted by Job Seekers<br />Across<span className="text-gradient ml-2">All Roles</span>
          </h2>
          <p className="text-slate-600 max-w-2xl">
            From analysts to engineers to managers — MatchRate helps candidates stand out.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto fade-in testimonial-animated">
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
                  <div className="testimonial-card glassmorphism h-full flex flex-col py-8 px-6">
                    <Quote className="w-10 h-10 text-warm-accent/20 mb-4" />
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-lg mb-8 flex-grow italic">{testimonial.text}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-warm-accent/10 text-warm-accent font-semibold">
                          {testimonial.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-bold text-warm-text text-lg">{testimonial.author}</div>
                        <div className="text-slate-700 text-sm font-medium">{testimonial.role}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <span className="text-slate-500 text-xs">{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-10 gap-4">
              <CarouselPrevious className="static transform-none mx-2 bg-white border border-gray-200" />
              <CarouselNext className="static transform-none mx-2 bg-white border border-gray-200" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
