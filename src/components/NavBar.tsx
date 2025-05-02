
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function NavBar() {
  const { user } = useAuthUser();
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
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-background py-4 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">Matchrate.co</Link>
          
        <div className="flex flex-1 justify-end items-center">
          <nav className="flex items-center gap-4 sm:gap-6">
            {!isMobile && (
              <>
                <Link
                  to="/"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                
                {user && (
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
            
            <Button 
              variant="default"
              className="cta-gradient text-white px-6"
              onClick={() => navigate("/review")}
            >
              Try it free
            </Button>

            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
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
                  className="text-base font-medium text-muted-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-base font-medium text-muted-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </Link>
                
                {user && (
                  <Link
                    to="/dashboard"
                    className="text-base font-medium text-muted-foreground"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
