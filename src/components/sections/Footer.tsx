
const Footer = () => {
  return (
    <footer className="py-14 bg-[#F8FAFC] border-t border-gray-200">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-3">Matchrate.ai</h3>
            <p className="text-[#64748B] text-base">
              AI-powered resume feedback tailored to product management roles.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-[#64748B] hover:text-[#3B82F6] transition">Features</a></li>
              <li><a href="#pricing" className="text-[#64748B] hover:text-[#3B82F6] transition">Pricing</a></li>
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">About</a></li>
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">Blog</a></li>
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[#1E293B] mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">Privacy</a></li>
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">Terms</a></li>
              <li><a href="#" className="text-[#64748B] hover:text-[#3B82F6] transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-[#94A3B8] text-sm">
          <p>© {new Date().getFullYear()} Matchrate.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
