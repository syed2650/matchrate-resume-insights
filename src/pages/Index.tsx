
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
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => observer.observe(element));
    
    // Handle hash navigation (e.g., #features) when the page loads
    const handleHashNavigation = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          // Add a slight delay to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHashNavigation();

    // Add event listener for popstate to handle browser back/forward navigation
    window.addEventListener('popstate', handleHashNavigation);
    
    return () => {
      revealElements.forEach(element => observer.unobserve(element));
      window.removeEventListener('popstate', handleHashNavigation);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-warm-bg font-sans">
      <main>
        <Hero />
        <div className="section-alt py-12 md:py-16 bg-lilac-gradient">
          <div className="container-content">
            <Features />
          </div>
        </div>
        <div className="py-12 md:py-16">
          <DashboardPreview />
        </div>
        <div className="py-12 md:py-16 bg-white">
          <div className="container-content">
            <Testimonials />
          </div>
        </div>
        <div className="py-12 md:py-16 bg-lilac-gradient" id="pricing">
          <div className="container-content">
            <Pricing />
          </div>
        </div>
        <CallToAction />
      </main>
      <Footer />
      
      <Button 
        className="sticky-cta cta-gradient w-12 h-12 p-0 fixed bottom-8 right-8 z-50 rounded-full shadow-lg"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
};

export default Index;
