
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-white">
        <Header />
      </div>
      {/* max-w-screen-xl (1280px) content, centered */}
      <main className="mx-auto max-w-screen-xl">
        <Hero />
        <div className="section-alt">
          <Features />
        </div>
        <Testimonials />
        <div className="section-alt">
          <Pricing />
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
