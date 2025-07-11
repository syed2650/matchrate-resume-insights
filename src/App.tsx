import Index from "@/pages/Index";
import About from "@/pages/About";
import Review from "@/pages/Review";
import Blog from "@/pages/Blog";
import ImproveResume from "@/pages/blog/ImproveResume";
import ATSSystems from "@/pages/blog/ATSSystems";
import ResumeMistakes from "@/pages/blog/ResumeMistakes";
import ResumeRejection from "@/pages/blog/ResumeRejection";
import ResumeRejectionMistakes from "@/pages/blog/ResumeRejectionMistakes";
import ResumeFormatGuide from "@/pages/blog/ResumeFormatGuide";
import ResumePsychology from "@/pages/blog/ResumePsychology";
import BeatATS from "@/pages/blog/BeatATS";
import ResumeKeywords from "@/pages/blog/ResumeKeywords";
import ResumeKeywordsData from "@/pages/blog/ResumeKeywordsData";
import ResumeTemplatesATS from "@/pages/blog/ResumeTemplatesATS";
import FreeVsPaidCheckers from "@/pages/blog/FreeVsPaidCheckers";
import ATSAlgorithmExposed from "@/pages/blog/ATSAlgorithmExposed";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import CookiePolicy from "@/pages/CookiePolicy";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Contact from "@/pages/Contact";
import FreeATSCheck from "@/pages/FreeATSCheck";
import ResumeFeedback from "@/pages/ResumeFeedback";
import UTMDashboard from "@/pages/UTMDashboard";
import NavBar from "@/components/NavBar";
import BetaAnnouncementBanner from "@/components/BetaAnnouncementBanner";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { UTMTracker } from "@/components/UTMTracker";
import { useExitIntent } from "@/hooks/useExitIntent";
import { AuthProvider } from "@/hooks/useAuthUser";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LinkedInProfileOptimization from "@/pages/blog/LinkedInProfileOptimization";

function AppContent() {
  const { showPopup, closePopup } = useExitIntent();

  return (
    <>
      <UTMTracker />
      <BetaAnnouncementBanner />
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/review" element={<Review />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/free-ats-check" element={<FreeATSCheck />} />
        <Route path="/resume-feedback" element={<ResumeFeedback />} />
        <Route path="/utm-dashboard" element={<UTMDashboard />} />
        <Route path="/blog/resume-psychology" element={<ResumePsychology />} />
        <Route path="/blog/improve-resume" element={<ImproveResume />} />
        <Route path="/blog/ats-systems" element={<ATSSystems />} />
        <Route path="/blog/resume-mistakes" element={<ResumeMistakes />} />
        <Route path="/blog/resume-rejection" element={<ResumeRejection />} />
        <Route path="/blog/resume-rejection-mistakes" element={<ResumeRejectionMistakes />} />
        <Route path="/blog/resume-format-guide" element={<ResumeFormatGuide />} />
        <Route path="/blog/beat-ats" element={<BeatATS />} />
        <Route path="/blog/resume-keywords" element={<ResumeKeywords />} />
        <Route path="/blog/resume-keywords-data" element={<ResumeKeywordsData />} />
        <Route path="/blog/resume-templates-ats" element={<ResumeTemplatesATS />} />
        <Route path="/blog/free-vs-paid-checkers" element={<FreeVsPaidCheckers />} />
        <Route path="/blog/ats-algorithm-exposed" element={<ATSAlgorithmExposed />} />
        <Route path="/blog/linkedin-profile-optimization" element={<LinkedInProfileOptimization />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ExitIntentPopup isVisible={showPopup} onClose={closePopup} />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
