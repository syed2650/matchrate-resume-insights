
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="py-7 bg-white border-b border-gray-100 shadow-none">
      <div className="container max-w-screen-xl mx-auto px-4 flex justify-between items-center">
        <div className="font-bold text-2xl md:text-3xl text-[#1E293B] tracking-tight select-none">
          Matchrate.ai
        </div>
        <nav>
          <ul className="hidden md:flex space-x-8">
            <li>
              <a href="#features" className="text-[#64748B] hover:text-[#1E293B] font-medium">Features</a>
            </li>
            <li>
              <a href="#testimonials" className="text-[#64748B] hover:text-[#1E293B] font-medium">Testimonials</a>
            </li>
            <li>
              <a href="#pricing" className="text-[#64748B] hover:text-[#1E293B] font-medium">Pricing</a>
            </li>
            <li>
              <Button 
                variant="default"
                className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                onClick={() => navigate("/review")}
              >
                Try it now
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
