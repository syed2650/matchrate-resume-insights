
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ResumeUploadSection from "./components/ResumeUploadSection";
import { JobDescriptionSection } from "./components/JobDescriptionSection";
import { ExtractionStatus } from "./types";
import { useJobDescription } from "./hooks/useJobDescription";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { CompanySection } from "./components/CompanySection";
import { OutputOptionsSection } from "./components/OutputOptionsSection";
import CompanySectorInput from "./components/CompanySectorInput";

interface ReviewFormProps {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string, 
    jobTitle?: string,
    companyType?: string,
    generateRewrite?: boolean,
    multiVersion?: boolean
  ) => void;
  isLoading: boolean;
  jobSector: "saas" | "enterprise" | "public" | "startup" | "consulting" | "general";
  setJobSector: (sector: "saas" | "enterprise" | "public" | "startup" | "consulting" | "general") => void;
}

const ReviewForm = ({ onSubmit, isLoading, jobSector, setJobSector }: ReviewFormProps) => {
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
    handleExtractJobDescription
  } = useJobDescription();

  const [jobTitle, setJobTitle] = useState<string>("");
  const [generateRewrite, setGenerateRewrite] = useState<boolean>(true);
  const [multiVersion, setMultiVersion] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resume && (jobDescription || jobUrl)) {
      onSubmit(
        resume, 
        jobDescription, 
        jobUrl,
        jobTitle,
        jobSector,
        generateRewrite,
        multiVersion
      );
    }
  };

  const handleResumeTextChange = (text: string) => {
    // Optional: Add any additional logic for text change if needed
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <ResumeUploadSection
            resumeText={resume}
            setResumeText={setResume}
            onFileUpload={handleFileUpload}
            onTextChange={handleResumeTextChange}
            isParsingResume={isParsingResume}
            resumeFile={resumeFile}
            onClear={clearResume}
          />

          <JobDescriptionSection
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            jobUrl={jobUrl}
            setJobUrl={setJobUrl}
            extractionStatus={extractionStatus as ExtractionStatus}
            onExtract={handleExtractJobDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CompanySection
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              companyType={jobSector}
              setCompanyType={setJobSector}
            />
            <CompanySectorInput
              selectedSector={jobSector}
              onSectorChange={setJobSector}
            />
          </div>

          <OutputOptionsSection
            generateRewrite={generateRewrite}
            setGenerateRewrite={setGenerateRewrite}
            multiVersion={multiVersion}
            setMultiVersion={setMultiVersion}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading || !resume || (!jobDescription && !jobUrl)}
              className="px-8 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                "Analyze My Resume"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;

