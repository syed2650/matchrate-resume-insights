
const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Matchrate.ai</h3>
            <p className="text-gray-600">
              AI-powered resume feedback tailored to product management roles.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-indigo-600">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-indigo-600">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Matchrate.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
