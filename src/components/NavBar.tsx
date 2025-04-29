import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function NavBar() {
  const { user } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="bg-background py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Matchrate.co</Link>
          
          <div className="flex flex-1 justify-end items-center">
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                to="/"
                className={`text-sm font-medium ${
                  location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium ${
                  location.pathname === "/about" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
              >
                About
              </Link>
              <Link
                to="/review"
                className={`text-sm font-medium ${
                  location.pathname === "/review" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
              >
                Review
              </Link>
              <Link
                to="/blog"
                className={`text-sm font-medium ${
                  location.pathname === "/blog" ? "text-foreground" : "text-muted-foreground"
                } hover:text-foreground transition-colors`}
              >
                Blog
              </Link>
              
              {user && (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium ${
                    location.pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
                  } hover:text-foreground transition-colors`}
                >
                  Dashboard
                </Link>
              )}
              
              {user ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  Sign Out
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setShowMobileMenu(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </Button>
            </nav>
          </div>
          
          {showMobileMenu && (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg p-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-bold text-xl">Matchrate.co</Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-md hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-4">
            <Link
              to="/"
              className={`text-base font-medium ${
                location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-base font-medium ${
                location.pathname === "/about" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              About
            </Link>
            <Link
              to="/review"
              className={`text-base font-medium ${
                location.pathname === "/review" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Review
            </Link>
            <Link
              to="/blog"
              className={`text-base font-medium ${
                location.pathname === "/blog" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Blog
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                className={`text-base font-medium ${
                  location.pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
            )}
            
            {user ? (
              <Button variant="outline" size="sm" onClick={() => {
                setShowMobileMenu(false);
                navigate("/auth");
              }}>
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => {
                setShowMobileMenu(false);
                navigate("/auth");
              }}>
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    )}
    </div>
  );
}
