
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRedirecting(true);
          // Redirect after showing "Redirecting..." for a moment
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname]);

  // Get suggestions based on the current path
  const getSuggestions = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes("blog")) {
      return [
        { path: "/blog", name: "Blog Home" },
        { path: "/blog/improve-resume", name: "Improve Your Resume" },
        { path: "/blog/ats-systems", name: "ATS Systems Explained" }
      ];
    }
    
    if (path.includes("review") || path.includes("resume")) {
      return [
        { path: "/review", name: "Resume Review Tool" }
      ];
    }
    
    // Default suggestions
    return [
      { path: "/review", name: "Resume Review" },
      { path: "/blog", name: "Blog Articles" },
      { path: "/about", name: "About Us" }
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-slate-800">404</h1>
          <p className="text-xl text-slate-600 mt-2">Page not found</p>
          <p className="text-sm text-slate-500 mt-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {!redirecting ? (
          <p className="text-sm text-slate-500 mb-6">
            Redirecting to homepage in <span className="font-medium">{countdown}</span> seconds...
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-6">Redirecting...</p>
        )}

        <div className="space-y-4">
          <div className="flex gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </Link>
            </Button>
            <Button 
              variant="outline"
              asChild 
              className="flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <Link to="#">
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Link>
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 mb-3">You might be looking for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <Button 
                    key={index}
                    variant="secondary"
                    size="sm"
                    asChild
                    className="text-xs"
                  >
                    <Link to={suggestion.path}>{suggestion.name}</Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
