
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Menu, X } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isLoading } = useAuthUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Matchrate</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">.ai</span>
            </Link>
          </div>

          <div className="-mr-2 -my-2 md:hidden flex items-center">
            <DarkModeToggle />
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              aria-expanded={isMenuOpen ? "true" : "false"}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <nav className="flex space-x-8 items-center">
              <Link
                to="/review"
                className={`text-base font-medium ${
                  location.pathname === "/review"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                } transition-colors`}
              >
                Resume Review
              </Link>
              <Link
                to="/blog"
                className={`text-base font-medium ${
                  location.pathname.startsWith("/blog")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                } transition-colors`}
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className={`text-base font-medium ${
                  location.pathname === "/contact"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
                } transition-colors`}
              >
                Contact
              </Link>
              
              <DarkModeToggle />

              {!isLoading && (
                <>
                  {user ? (
                    <Button asChild variant="outline">
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-slate-900 divide-y-2 divide-gray-50 dark:divide-slate-800">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-blue-600">Matchrate</span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">.ai</span>
                </div>
                <div className="-mr-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md p-2 inline-flex items-center justify-center focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link
                    to="/review"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      location.pathname === "/review"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200"
                    } hover:text-blue-600 dark:hover:text-blue-400`}
                  >
                    Resume Review
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      location.pathname.startsWith("/blog")
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200"
                    } hover:text-blue-600 dark:hover:text-blue-400`}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-base font-medium ${
                      location.pathname === "/contact"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-200"
                    } hover:text-blue-600 dark:hover:text-blue-400`}
                  >
                    Contact
                  </Link>
                  {!isLoading && (
                    <>
                      {user ? (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/auth"
                          onClick={() => setIsMenuOpen(false)}
                          className="text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500"
                        >
                          Sign In
                        </Link>
                      )}
                    </>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
