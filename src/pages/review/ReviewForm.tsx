
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    onSubmit(
      resume, 
      jobDescription, 
      jobUrl, 
      jobTitle, 
      companyType, 
      generateRewrite,
      multiVersion
    );
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
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            disabled={isLoading || (!resume && !resumeFile)}
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
