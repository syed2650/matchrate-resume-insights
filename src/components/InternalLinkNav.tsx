import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, BookOpen, Users } from "lucide-react";

interface InternalLinkNavProps {
  currentPage: string;
  showCallToAction?: boolean;
}

export function InternalLinkNav({ currentPage, showCallToAction = true }: InternalLinkNavProps) {
  const getRecommendedLinks = () => {
    switch (currentPage) {
      case "home":
        return [
          { href: "/review", label: "Start Resume Analysis", icon: FileText, priority: "high" },
          { href: "/blog", label: "Resume Success Tips", icon: BookOpen, priority: "medium" },
          { href: "/free-ats-check", label: "Free ATS Checker", icon: CheckCircle, priority: "medium" },
        ];
      case "about":
        return [
          { href: "/review", label: "Try Our AI Resume Analyzer", icon: FileText, priority: "high" },
          { href: "/blog/resume-psychology", label: "Resume Psychology Guide", icon: BookOpen, priority: "medium" },
          { href: "/contact", label: "Contact Our Team", icon: Users, priority: "low" },
        ];
      case "blog":
        return [
          { href: "/review", label: "Analyze Your Resume Now", icon: FileText, priority: "high" },
          { href: "/blog/ats-algorithm-exposed", label: "Beat ATS Systems", icon: CheckCircle, priority: "medium" },
          { href: "/free-ats-check", label: "Free ATS Check", icon: CheckCircle, priority: "medium" },
        ];
      case "privacy":
        return [
          { href: "/about", label: "About MatchRate", icon: Users, priority: "medium" },
          { href: "/terms", label: "Terms of Service", icon: FileText, priority: "low" },
          { href: "/contact", label: "Contact Us", icon: Users, priority: "low" },
        ];
      default:
        return [
          { href: "/review", label: "Resume Analysis", icon: FileText, priority: "high" },
          { href: "/blog", label: "Career Resources", icon: BookOpen, priority: "medium" },
          { href: "/about", label: "About Us", icon: Users, priority: "low" },
        ];
    }
  };

  const links = getRecommendedLinks();
  const primaryLink = links.find(link => link.priority === "high");
  const secondaryLinks = links.filter(link => link.priority !== "high");

  return (
    <nav className="border-t border-border/50 bg-muted/30 py-8 mt-12" aria-label="Related pages">
      <div className="container max-w-screen-xl mx-auto px-4">
        {showCallToAction && primaryLink && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to improve your resume?</h2>
            <Button asChild size="lg" className="gap-2">
              <Link to={primaryLink.href}>
                <primaryLink.icon className="h-5 w-5" />
                {primaryLink.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <link.icon className="h-5 w-5 text-primary" />
                <span className="font-medium group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}