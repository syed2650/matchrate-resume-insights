
import Index from "@/pages/Index";
import About from "@/pages/About";
import Review from "@/pages/Review";
import Blog from "@/pages/Blog";
import ImproveResume from "@/pages/blog/ImproveResume";
import ATSSystems from "@/pages/blog/ATSSystems";
import ResumeMistakes from "@/pages/blog/ResumeMistakes";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import CookiePolicy from "@/pages/CookiePolicy";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Contact from "@/pages/Contact";
import NavBar from "@/components/NavBar";
import BetaAnnouncementBanner from "@/components/BetaAnnouncementBanner";
import { AuthProvider } from "@/hooks/useAuthUser";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BetaAnnouncementBanner />
        <NavBar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/review" element={<Review />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blog/improve-resume" element={<ImproveResume />} />
          <Route path="/blog/ats-systems" element={<ATSSystems />} />
          <Route path="/blog/resume-mistakes" element={<ResumeMistakes />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
