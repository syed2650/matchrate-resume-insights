
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomepageHero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full pt-24 pb-32 md:pt-32 md:pb-40 bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center gap-12 md:gap-0">
        <div className="w-full md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
          <span className="inline-block text-xs font-bold tracking-wider uppercase bg-indigo-100 text-indigo-700 rounded px-3 py-1 mb-4 animate-fade-in">
            PM-Focused AI
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6 animate-fade-in">
            Resumes that
            <span className="bg-gradient-to-r from-indigo-700 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent animate-gradient">
              {" "}Get Noticed
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-xl mb-8 animate-fade-in">
            Instantly analyze your resume against any PM job description. Honest, actionable feedback and rewrites—no coaching required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 text-lg rounded-xl animate-fade-in"
              onClick={() => navigate("/review")}
            >
              Try Resume Review
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-indigo-700 border-indigo-300 hover:bg-indigo-50 hover:border-indigo-500 transition animate-fade-in"
              onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
            >
              How It Works
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center animate-scale-in">
          <div className="relative w-full max-w-[420px] rounded-xl shadow-lg bg-white border border-gray-100 p-6 md:p-10 flex flex-col gap-6">
            <div className="w-full h-44 rounded-lg bg-gradient-to-br from-indigo-200 via-purple-100 to-fuchsia-200 mb-6 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-indigo-700 opacity-80">
                🎯 Instant Feedback
              </span>
            </div>
            <p className="text-gray-700 font-semibold text-center">
              Drop your resume, paste the job, and get structured tips—plus bullet rewrites—in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExplainerSteps = () => (
  <section className="relative z-10 py-16 sm:py-20 bg-gradient-to-b from-white to-purple-50">
    <div className="container mx-auto px-4 md:px-8 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-3">How It Works</h2>
        <p className="text-gray-600 mx-auto max-w-xl">
          3 simple steps to get actionable, honest PM feedback—no coaching calls, no fluff.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-white shadow-md min-w-[240px] animate-fade-in">
          <div className="bg-indigo-100 text-indigo-700 w-12 h-12 flex items-center justify-center rounded-full mb-4 font-extrabold text-xl">1</div>
          <span className="font-bold text-lg mb-2">Upload Resume & Job</span>
          <span className="text-gray-600">Drop your resume or paste the text, then add the job description—even a pasted JD works.</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-white shadow-md min-w-[240px] animate-fade-in">
          <div className="bg-indigo-100 text-indigo-700 w-12 h-12 flex items-center justify-center rounded-full mb-4 font-extrabold text-xl">2</div>
          <span className="font-bold text-lg mb-2">AI Analyzes Instantly</span>
          <span className="text-gray-600">Get a clear, honest breakdown—score, PM keywords, and section-by-section advice. Fluff-free.</span>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-white shadow-md min-w-[240px] animate-fade-in">
          <div className="bg-indigo-100 text-indigo-700 w-12 h-12 flex items-center justify-center rounded-full mb-4 font-extrabold text-xl">3</div>
          <span className="font-bold text-lg mb-2">Apply with Confidence</span>
          <span className="text-gray-600">Use bullet rewrites, keyword tips, and final verdict to fix and submit with real advantage.</span>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      <HomepageHero />
      <ExplainerSteps />
      {/* You can add more sections or the Footer here if needed */}
      <Footer />
    </div>
  );
};

export default Index;
