import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`py-4 transition-all duration-300 ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container max-w-screen-xl mx-auto px-4">
        <nav className="flex items-center justify-between">
          <div className="font-bold text-2xl text-slate-800 tracking-tight select-none">
            Matchrate.ai
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Features</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Testimonials</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors duration-200">Pricing</a>
            <Button 
              variant="default"
              className="cta-gradient text-white px-6"
              onClick={() => navigate("/review")}
            >
              Try it free
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
