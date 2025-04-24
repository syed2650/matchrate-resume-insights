
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { ResumeUploadSection } from "./components/ResumeUploadSection";
import { JobDescriptionSection } from "./components/JobDescriptionSection";
import { CompanySection } from "./components/CompanySection";
import { OutputOptionsSection } from "./components/OutputOptionsSection";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { useJobDescription } from "./hooks/useJobDescription";

interface Props {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string,
    role?: string,
    companyType?: string,
    generateRewrite?: boolean,
    multiVersion?: boolean
  ) => Promise<void>;
  isLoading: boolean;
}

const ReviewForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyType, setCompanyType] = useState<string>("general");
  const [generateRewrite, setGenerateRewrite] = useState(false);
  const [multiVersion, setMultiVersion] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    resume,
    setResume,
    resumeFile,
    isParsingResume,
    handleFileUpload,
    clearResume
  } = useResumeUpload();
  
  const {
    jobDescription,
    setJobDescription,
    jobUrl,
    setJobUrl,
    extractionStatus,
    handleUrlPaste
  } = useJobDescription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisError(null);
    
    if (!resume && !resumeFile) {
      toast({
        title: "Resume required",
        description: "Please paste your resume text or upload a resume file",
        variant: "destructive"
      });
      return;
    }
    
    if (!jobDescription && !jobUrl) {
      toast({
        title: "Job information required",
        description: "Please paste a job description or provide a job URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await onSubmit(
        resume, 
        jobDescription, 
        jobUrl, 
        jobTitle, 
        companyType, 
        generateRewrite,
        multiVersion
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      setAnalysisError(error instanceof Error ? error.message : "An unexpected error occurred during analysis");
      
      toast({
        title: "Analysis failed",
        description: "There was a problem analyzing your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 shadow-md rounded-xl border border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        <ResumeUploadSection
          resume={resume}
          setResume={setResume}
          resumeFile={resumeFile}
          isParsingResume={isParsingResume}
          onFileUpload={handleFileUpload}
          onClear={clearResume}
        />

        <JobDescriptionSection
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          jobUrl={jobUrl}
          setJobUrl={setJobUrl}
          extractionStatus={extractionStatus}
          onExtract={handleUrlPaste}
        />

        <CompanySection
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          companyType={companyType}
          setCompanyType={setCompanyType}
        />

        <Separator className="my-6" />
        
        <OutputOptionsSection
          generateRewrite={generateRewrite}
          setGenerateRewrite={setGenerateRewrite}
          multiVersion={multiVersion}
          setMultiVersion={setMultiVersion}
        />
        
        {analysisError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Analysis failed</p>
            <p className="text-sm mt-1">{analysisError}</p>
            <p className="text-sm mt-2">Please try again or contact support if this persists.</p>
          </div>
        )}
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            disabled={isLoading || isParsingResume || (!resume && !resumeFile)}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Analyze My Resume
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
