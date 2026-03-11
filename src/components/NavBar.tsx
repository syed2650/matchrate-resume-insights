import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { X, Menu, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import matchrateLogo from "@/assets/matchrate-logo.png";

export default function NavBar() {
  const { user } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out successfully" });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({ title: "Error signing out", description: "Please try again", variant: "destructive" });
    }
  };

  const isHome = location.pathname === "/";

  return (
    <div className={`py-2 sticky top-0 z-50 transition-colors duration-300 ${isHome ? 'bg-black/40 backdrop-blur-md border-b border-white/10' : 'bg-background border-b border-border shadow-sm'}`}>
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center py-1">
          <img 
            src={matchrateLogo} 
            alt="Matchrate" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>
          
        <div className="flex flex-1 justify-end items-center">
          <nav className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <>
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/#features", label: "Features" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                      isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 
                      location.pathname === link.to ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}>
                    Resources
                    <ChevronDown className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="bg-background border border-border shadow-lg rounded-xl">
                    <DropdownMenuItem asChild>
                      <Link to="/resume-feedback" className="cursor-pointer">Resume Health Check</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/lovable" className="cursor-pointer">Resume Roast</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/blog" className="cursor-pointer">Blog</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {user && (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                      isHome ? 'text-white/80 hover:text-white hover:bg-white/10' : 
                      location.pathname === "/dashboard" ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <Button variant="outline" size="sm" className={`rounded-lg ${isHome ? 'border-foreground/20 text-foreground hover:bg-foreground/10' : ''}`} onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" className={`rounded-lg ${isHome ? 'border-foreground/20 text-foreground hover:bg-foreground/10' : ''}`} onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
            
            <Button 
              className="cta-gradient text-white px-5 rounded-xl font-semibold shadow-cta hover:shadow-glow-violet transition-all"
              onClick={() => navigate("/review")}
            >
              Start Matching
            </Button>

            {isMobile && (
              <Button variant="ghost" size="icon" className={`ml-1 ${isHome ? 'text-foreground hover:bg-foreground/10' : ''}`} onClick={() => setShowMobileMenu(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </nav>
        </div>
          
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg p-6">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center">
                  <img src={matchrateLogo} alt="Matchrate" className="h-10 w-auto object-contain" />
                </Link>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-lg hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/#features", label: "Features" },
                  { to: "/blog", label: "Blog" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-base font-medium px-3 py-2.5 rounded-lg ${
                      location.pathname === link.to ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:bg-secondary'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-4 pb-1">Resources</div>
                <Link to="/resume-feedback" className="text-base font-medium px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary" onClick={() => setShowMobileMenu(false)}>Resume Health Check</Link>
                <Link to="/lovable" className="text-base font-medium px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary" onClick={() => setShowMobileMenu(false)}>Resume Roast</Link>
                
                {user && (
                  <Link to="/dashboard" className={`text-base font-medium px-3 py-2.5 rounded-lg ${location.pathname === "/dashboard" ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:bg-secondary'}`} onClick={() => setShowMobileMenu(false)}>Dashboard</Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
