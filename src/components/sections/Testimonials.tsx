
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    text: "The section-by-section analysis helped me understand exactly what was missing from my PM resume. After implementing the suggestions, I got more interview calls within weeks.",
    author: "Sarah Chen",
    handle: "@sarahchen_pm",
    role: "Senior Product Manager",
    initial: "SC"
  },
  {
    text: "The keyword analysis feature is a game-changer. It helped me align my experience perfectly with the job requirements. Honest, actionable feedback that actually helps.",
    author: "Michael Ross",
    handle: "@mross_product",
    role: "Product Manager at Stripe",
    initial: "MR"
  },
  {
    text: "As someone transitioning into product management, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a PM context.",
    author: "Priya Sharma",
    handle: "@priyapm",
    role: "Associate PM at Shopify",
    initial: "PS"
  },
  {
    text: "After multiple rejections, this tool helped me understand I wasn't quantifying my achievements. The STAR format suggestions transformed my resume completely.",
    author: "David Wong",
    handle: "@dwong_tech",
    role: "Product Lead at Figma",
    initial: "DW"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-warm-bg">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-warm-accent font-medium text-sm mb-2 uppercase tracking-wider">Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-warm-text mb-2 leading-tight">
            Trusted by aspiring<br />Product Managers
          </h2>
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
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="testimonial-card h-full flex flex-col p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-base mb-6 flex-grow">{testimonial.text}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-warm-accent/10 text-warm-accent">
                          {testimonial.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-semibold text-warm-text text-base">{testimonial.author}</div>
                        <div className="text-slate-500 text-sm">{testimonial.role}</div>
                        <div className="text-slate-400 text-xs">{testimonial.handle}</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static transform-none mx-2" />
              <CarouselNext className="static transform-none mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
