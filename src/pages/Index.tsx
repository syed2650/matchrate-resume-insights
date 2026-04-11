import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import SocialProof from "@/components/sections/SocialProof";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import CallToAction from "@/components/sections/CallToAction";
import Footer from "@/components/sections/Footer";
import DashboardPreview from "@/components/sections/DashboardPreview";
import { useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { gtagEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.matchrate.co/#organization",
        name: "MatchRate",
        url: "https://www.matchrate.co",
        logo: {
          "@type": "ImageObject",
          url: "https://www.matchrate.co/lovable-uploads/1995df7f-73f3-4583-9980-04dc5569cd1d.png",
        },
        description:
          "AI-powered resume analysis and optimization to help job seekers pass ATS and land interviews.",
        sameAs: [
          "https://twitter.com/matchrate_ai",
          "https://www.linkedin.com/company/matchrate",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.matchrate.co/#website",
        name: "MatchRate",
        url: "https://www.matchrate.co",
        publisher: { "@id": "https://www.matchrate.co/#organization" },
        description:
          "AI-powered resume analysis tool that helps job seekers optimize their resumes for ATS systems and land more interviews.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.matchrate.co/review?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  useEffect(() => {
    gtagEvent("landing_view", { page: window.location.pathname });
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    revealElements.forEach(element => observer.observe(element));

    const handleHashNavigation = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };
    handleHashNavigation();
    window.addEventListener('popstate', handleHashNavigation);

    return () => {
      revealElements.forEach(element => observer.unobserve(element));
      window.removeEventListener('popstate', handleHashNavigation);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <SEOHead
        title="MatchRate - AI Resume Analyzer & ATS Checker"
        description="Get your resume past ATS systems with MatchRate's AI-powered resume analyzer. Free ATS score check, keyword optimization, and instant feedback to land more interviews."
        keywords="resume analyzer, ATS checker, resume optimization, AI resume review, job application help, resume score"
        canonicalUrl="https://www.matchrate.co/"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-background font-sans">
        <main>
          <Hero />
          <SocialProof />
          <div className="bg-lilac-gradient">
            <div className="container-content">
              <Features />
            </div>
          </div>
          <DashboardPreview />
          <div className="bg-secondary">
            <div className="container-content">
              <Testimonials />
            </div>
          </div>
          <div className="bg-lilac-gradient" id="pricing">
            <div className="container-content">
              <Pricing />
            </div>
          </div>
          <CallToAction />
        </main>
        <Footer />
        
        <Button 
          className="sticky-cta cta-gradient w-12 h-12 p-0 fixed bottom-8 right-8 z-50 rounded-full shadow-cta"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </Button>
      </div>
    </>
  );
};

export default Index;
