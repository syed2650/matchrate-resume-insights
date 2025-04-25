
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";
import DashboardPreview from "@/components/sections/DashboardPreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      <main className="mx-auto">
        <Hero />
        <div className="section-alt section-padding">
          <div className="container-content">
            <Features />
          </div>
        </div>
        <DashboardPreview />
        <div className="section-padding bg-white">
          <div className="container-content">
            <Testimonials />
          </div>
        </div>
        <div className="section-padding">
          <div className="container-content">
            <Pricing />
          </div>
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
