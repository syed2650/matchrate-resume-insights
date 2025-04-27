
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ResumeUploadSection from "./components/ResumeUploadSection";
import { JobDescriptionSection } from "./components/JobDescriptionSection";
import { ExtractionStatus } from "./types";
import { useJobDescription } from "./hooks/useJobDescription";
import { useResumeUpload } from "./hooks/useResumeUpload";

interface ReviewFormProps {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string, 
    jobTitle?: string
  ) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

const ReviewForm = ({ onSubmit, isLoading, isDisabled = false }: ReviewFormProps) => {
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

  const [jobTitle, setJobTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resume && (jobDescription || jobUrl)) {
      onSubmit(
        resume, 
        jobDescription, 
        jobUrl,
        jobTitle
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
            onExtract={handleUrlPaste}
          />

          <div className="mb-6">
            <div className="mb-2">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Adding a job title helps personalize the analysis
              </p>
            </div>
            <input
              id="jobTitle"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Product Manager, Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isDisabled}
            />
          </div>

          <div className="flex justify-center">
         <Button
  type="submit"
  disabled={isLoading || isDisabled || !resume || (!jobDescription && !jobUrl)}
  className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
    isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
  }`}
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
