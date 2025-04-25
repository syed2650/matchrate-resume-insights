
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    text: "The section-by-section analysis helped me understand exactly what was missing from my PM resume. After implementing the suggestions, I got more interview calls within weeks.",
    author: "Sarah Chen",
    handle: "@sarahchen_pm",
    role: "Senior Product Manager",
    initial: "SC",
    company: "Spotify"
  },
  {
    text: "The keyword analysis feature is a game-changer. It helped me align my experience perfectly with the job requirements. Honest, actionable feedback that actually helps.",
    author: "Michael Ross",
    handle: "@mross_product",
    role: "Product Manager at Stripe",
    initial: "MR",
    company: "Stripe"
  },
  {
    text: "As someone transitioning into product management, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a PM context.",
    author: "Priya Sharma",
    handle: "@priyapm",
    role: "Associate PM at Shopify",
    initial: "PS",
    company: "Shopify"
  },
  {
    text: "After multiple rejections, this tool helped me understand I wasn't quantifying my achievements. The STAR format suggestions transformed my resume completely.",
    author: "David Wong",
    handle: "@dwong_tech",
    role: "Product Lead at Figma",
    initial: "DW",
    company: "Figma"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-warm-section relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-warm-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 bg-white text-warm-accent border-warm-accent/20">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-warm-text mb-6 leading-tight">
            Trusted by aspiring<br /><span className="text-gradient">Product Managers</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            See how our users transformed their resumes and landed interviews at top tech companies.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
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
                  <div className="testimonial-card h-full flex flex-col py-8 px-6">
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
