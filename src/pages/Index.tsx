
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Push to deploy",
      description: "Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "SSL certificates",
      description: "Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "Simple queues",
      description: "Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    },
    {
      title: "Advanced security",
      description: "Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
      icon: <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>
    }
  ];

  const testimonials = [
    {
      text: "Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero. Has condimentum dignissim nibh vulputate ut nunc. Amet nibh orci mi venenatis blandit vel et proin. Non hendrerit in vel ac diam.",
      author: "Brenna Goyette",
      handle: "@brennagoyette"
    },
    {
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      author: "John Doe",
      handle: "@johndoe"
    },
    {
      text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      author: "Jane Smith",
      handle: "@janesmith"
    }
  ];

  const pricingPlans = [
    {
      name: "Personal",
      price: "29",
      description: "The perfect plan if you're just getting started with our product.",
      features: [
        "25 products",
        "Up to 10,000 subscribers",
        "Audience segmentation",
        "Advanced analytics",
        "Email support",
        "Marketing automations"
      ]
    },
    {
      name: "Team",
      price: "99",
      description: "A plan that scales with your rapidly growing business.",
      features: [
        "Priority support",
        "Single sign-on",
        "Enterprise integrations",
        "Custom reporting tools"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header - with purple gradient background */}
      <header className="py-6 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="font-bold text-2xl text-gray-900">Matchrate.ai</div>
          <nav>
            <ul className="hidden md:flex space-x-8">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li>
                <Button 
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  onClick={() => navigate("/review")}
                >
                  Try it now
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section - with purple gradient background */}
      <section className="pt-24 pb-24 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-8">
            Get{" "}
            <AnimatedTextCycle
              words={[
                "brutally honest",
                "insightful",
                "actionable",
                "expert",
                "unbiased",
                "tailored"
              ]}
              interval={2600}
              className="text-indigo-600"
            />{" "}
            resume feedback for PM roles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Upload your resume and job description. Get detailed, actionable feedback to improve your chances.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-lg"
              onClick={() => navigate("/review")}
            >
              Try Resume Review
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 px-8 py-6 text-lg rounded-lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - using the new design */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-medium text-sm mb-2">Deploy faster</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                {feature.icon}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - using the new design */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-medium text-sm mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">We have worked with<br />thousands of amazing people</h2>
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

      {/* Pricing Section - using the new design */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-medium text-sm mb-2">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Choose the right plan for you</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="p-8 bg-white shadow-sm">
                <h3 className="text-indigo-600 font-medium">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="ml-2 text-gray-600">/month</span>
                </div>
                <p className="mt-4 text-gray-600">{plan.description}</p>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-indigo-600 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Get started today
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - using the new design */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Boost your productivity.<br />Start using our app today.</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua proident excepteur commodo do ea.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => navigate("/review")}
            >
              Get started
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 flex items-center gap-2"
            >
              Learn more <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - styled to match the new design */}
      <footer className="py-12 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Matchrate.ai</h3>
              <p className="text-gray-600">
                AI-powered resume feedback tailored to product management roles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Matchrate.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
