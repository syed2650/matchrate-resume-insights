
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default Header;
