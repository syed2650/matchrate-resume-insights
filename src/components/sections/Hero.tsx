
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-warm-bg via-lilac-light to-coral-light py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container-content relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Get Your Resume{" "}
            <span className="bg-gradient-to-r from-coral to-coral-dark bg-clip-text text-transparent">
              ATS-Ready
            </span>{" "}
            in Seconds
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your resume and job description. Our AI instantly scores your match, 
            identifies missing keywords, and provides actionable feedback to land more interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              asChild 
              size="lg" 
              className="cta-gradient text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/review">
                Try Resume Review Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <span className="text-slate-500 text-sm">or</span>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-coral text-coral hover:bg-coral hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <Link to="/resume-feedback">
                Get Complete Feedback
                <FileText className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-slate-600">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
              <span>ATS Score Analysis</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              <span>Content Optimization</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="w-4 h-4 mr-2 text-coral" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
