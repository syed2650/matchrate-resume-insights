import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    { label: "Product", items: [{ to: "/review", text: "Resume Analyzer" }, { to: "/lovable", text: "Resume Roast" }, { to: "/resume-feedback", text: "Health Check" }, { to: "/#pricing", text: "Pricing" }] },
    { label: "Company", items: [{ to: "/about", text: "About" }, { to: "/blog", text: "Blog" }, { to: "/contact", text: "Contact" }] },
    { label: "Legal", items: [{ to: "/terms", text: "Terms" }, { to: "/privacy", text: "Privacy" }, { to: "/cookie-policy", text: "Cookies" }] },
  ];

  return (
    <footer className="py-16 hero-dark border-t border-white/5">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-3">MatchRate.co</h3>
            <p className="text-white/40 text-sm leading-relaxed">AI-powered resume analysis & optimization.</p>
            <p className="text-white/30 text-xs mt-3">Built with GPT-4o, Claude, Supabase & Lovable.</p>
          </div>
          
          {links.map((section) => (
            <div key={section.label}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">{section.label}</h4>
              <div className="flex flex-col gap-2.5">
                {section.items.map((item) => (
                  <Link key={item.to} to={item.to} className="text-sm text-white/40 hover:text-white transition-colors">
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-white/30 text-sm">
          <p>© {new Date().getFullYear()} MatchRate.co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
