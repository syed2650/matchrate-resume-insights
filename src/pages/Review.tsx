import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ResumeAnalyzer from "./review/components/ResumeAnalyzer";
import { AgentActions } from "./review/components/AgentActions";

const Review = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleStartAnalysis = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please upload or paste your resume",
        variant: "destructive"
      });
      return;
    }
    
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description",
        variant: "destructive"
      });
      return;
    }
    
    setShowResults(true);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
        Resume Analysis & Optimization
      </h1>

      {!showResults ? (
        <ResumeAnalyzer 
          onResumeChange={setResumeText}
          onJobDescriptionChange={setJobDescription}
          onAnalyze={handleStartAnalysis}
          resumeText={resumeText}
          jobDescription={jobDescription}
        />
      ) : (
        <AgentActions 
          resumeText={resumeText}
          jobDescription={jobDescription}
          onReset={() => {
            setShowResults(false);
            setResumeText("");
            setJobDescription("");
          }}
        />
      )}
    </div>
  );
};

export default Review;
