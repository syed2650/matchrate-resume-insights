
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="py-7 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="container max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <div className="font-bold text-2xl md:text-3xl text-warm-text tracking-tight select-none">
          Matchrate.ai
        </div>
        <nav>
          <ul className="hidden md:flex space-x-8 items-center">
            <li>
              <a href="#features" className="text-slate-600 hover:text-warm-text transition-colors duration-200 font-medium">Features</a>
            </li>
            <li>
              <a href="#testimonials" className="text-slate-600 hover:text-warm-text transition-colors duration-200 font-medium">Testimonials</a>
            </li>
            <li>
              <a href="#pricing" className="text-slate-600 hover:text-warm-text transition-colors duration-200 font-medium">Pricing</a>
            </li>
            <li>
              <Button 
                variant="default"
                className="bg-warm-accent hover:bg-warm-accent/90 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.03]"
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
