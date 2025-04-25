
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";
import DashboardPreview from "@/components/sections/DashboardPreview";
import { useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Add scroll reveal animation
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
      observer.observe(element);
    });
    
    // Cleanup
    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-50">
        <Header />
      </div>
      <main className="mx-auto">
        <Hero />
        <div className="section-alt section-padding bg-lilac-gradient">
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
        <div className="section-padding bg-lilac-gradient">
          <div className="container-content">
            <Pricing />
          </div>
        </div>
        <CallToAction />
      </main>
      <Footer />
      
      {/* Sticky scroll-to-top button */}
      <Button 
        className="sticky-cta cta-gradient w-12 h-12 p-0"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default Index;
