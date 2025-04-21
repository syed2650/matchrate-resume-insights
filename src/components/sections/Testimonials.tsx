
import { Card } from "@/components/ui/card";

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
    <section id="testimonials" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-medium text-sm mb-2">Success Stories</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trusted by aspiring<br />Product Managers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white shadow-sm">
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.handle}</div>
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
