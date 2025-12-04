import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 bg-warm-section border-t border-slate-200">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-xl font-bold text-warm-text mb-3">
            MatchRate.co
          </h3>
          <p className="text-slate-600 text-base max-w-md mx-auto">
            AI-powered resume analysis & optimization.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Built with GPT-4o, Claude, Supabase & Lovable.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <Link to="/" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Home</Link>
          <a href="/#features" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Features</a>
          <a href="/#pricing" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Pricing</a>
          <Link to="/terms" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Terms</Link>
          <Link to="/privacy" className="text-slate-600 hover:text-warm-accent transition-colors duration-200">Privacy</Link>
        </div>
        
        <div className="border-t border-slate-200 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} MatchRate.co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
