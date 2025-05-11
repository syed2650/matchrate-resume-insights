
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/useTheme";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Review from "./pages/Review";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import ImproveResume from "./pages/blog/ImproveResume";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";
import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/review" element={<Review />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/improve-resume" element={<ImproveResume />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
