
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The section-by-section analysis helped me understand exactly what was missing from my PM resume. After implementing the suggestions, I got more interview calls within weeks.",
    author: "Sarah Chen",
    handle: "@sarahchen_pm"
  },
  {
    text: "The keyword analysis feature is a game-changer. It helped me align my experience perfectly with the job requirements. Honest, actionable feedback that actually helps.",
    author: "Michael Ross",
    handle: "@mross_product"
  },
  {
    text: "As someone transitioning into product management, this tool was invaluable. It helped me highlight transferable skills and frame my experience in a PM context.",
    author: "Priya Sharma",
    handle: "@priyapm"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] font-medium text-sm mb-2 uppercase tracking-wider">Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2 leading-tight">
            Trusted by aspiring<br />Product Managers
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col gap-6 p-7 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24]" />
                ))}
              </div>
              <p className="text-[#334155] text-base mb-3">{testimonial.text}</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-11 h-11 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] font-semibold text-xl">{testimonial.author[0]}</div>
                <div>
                  <div className="font-semibold text-[#1E293B] text-base">{testimonial.author}</div>
                  <div className="text-[#64748B] text-sm">{testimonial.handle}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
