
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 bg-warm-section border-t border-slate-200">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold text-warm-text mb-3">Matchrate.co</h3>
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
              <li><Link to="/contact" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-text mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">About</Link></li>
              <li><Link to="/blog" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Blog</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-warm-text mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Privacy</Link></li>
              <li><Link to="/terms" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Terms</Link></li>
              <li><Link to="/cookie-policy" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-200 mt-12 pt-8 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Matchrate.co. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="mailto:support@matchrate.co" className="text-warm-accent hover:underline">support@matchrate.co</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
