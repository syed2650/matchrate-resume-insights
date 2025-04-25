
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
    <header className={`py-6 transition-all duration-300 ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <div className="font-bold text-2xl md:text-3xl text-warm-text tracking-tight select-none">
          Matchrate.ai
        </div>
        <nav>
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <a href="#features" className="text-slate-600 hover:text-warm-accent transition-colors duration-200 font-medium">Features</a>
            </li>
            <li>
              <a href="#testimonials" className="text-slate-600 hover:text-warm-accent transition-colors duration-200 font-medium">Testimonials</a>
            </li>
            <li>
              <a href="#pricing" className="text-slate-600 hover:text-warm-accent transition-colors duration-200 font-medium">Pricing</a>
            </li>
            <li>
              <Button 
                variant="default"
                className="cta-gradient text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.03]"
                onClick={() => navigate("/review")}
              >
                Try it free
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
