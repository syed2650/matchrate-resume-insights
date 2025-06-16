
import { Link } from "react-router-dom";
import BetaBadge from "@/components/BetaBadge";

const Footer = () => {
  return (
    <footer className="py-16 bg-warm-section border-t border-slate-200">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-warm-text mb-3 flex items-center gap-2">
              Matchrate.co
              <BetaBadge />
            </h3>
            <p className="text-slate-600 text-base">
              AI-powered resume feedback tailored to tech job seekers — from PMs to Engineers and beyond.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Built with GPT-4. Trusted by job seekers in tech.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-warm-text mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Features</a></li>
              <li><a href="/#pricing" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Pricing</a></li>
              <li><Link to="/faq" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-text mb-3">Quick Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/free-ats-check" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">ATS Compatibility Check</Link></li>
              <li><Link to="/resume-feedback" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Resume Health Check</Link></li>
              <li><a href="#" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">File Format Checker</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-text mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">About</Link></li>
              <li><Link to="/blog" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Blog</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Contact</Link></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Privacy</Link></li>
              <li><Link to="/terms" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Matchrate.co. All rights reserved.</p>
          <p className="mt-2">
            Questions? <a href="mailto:support@matchrate.co" className="text-warm-accent hover:underline">support@matchrate.co</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
