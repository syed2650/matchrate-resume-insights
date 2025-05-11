
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ResumeUploadSection from "./components/ResumeUploadSection";
import { JobDescriptionSection } from "./components/JobDescriptionSection";
import { ExtractionStatus } from "./types";
import { useJobDescription } from "./hooks/useJobDescription";
import { useResumeUpload } from "./hooks/useResumeUpload";
import { useResumeAutosave } from "./hooks/useResumeAutosave";

interface ReviewFormProps {
  onSubmit: (
    resume: string,
    jobDescription: string,
    jobUrl?: string, 
    jobTitle?: string
  ) => void;
  isLoading: boolean;
  isDisabled?: boolean;
  savedData?: {
    resume: string;
    jobDescription: string;
    jobUrl?: string;
    jobTitle?: string;
    lastSaved?: Date;
  } | null;
}

const ReviewForm = ({ onSubmit, isLoading, isDisabled = false, savedData }: ReviewFormProps) => {
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
    jobTitle,
    setJobTitle,
    extractionStatus,
    handleUrlPaste
  } = useJobDescription();

  const { saveFormData } = useResumeAutosave();
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Load saved data if provided
  useEffect(() => {
    if (savedData) {
      setResume(savedData.resume || "");
      setJobDescription(savedData.jobDescription || "");
      if (savedData.jobUrl) setJobUrl(savedData.jobUrl);
      if (savedData.jobTitle) setJobTitle(savedData.jobTitle);
    }
  }, [savedData]);
  
  // Auto-save form data every 30 seconds or when content changes significantly
  useEffect(() => {
    if (!resume && !jobDescription) return;
    
    const saveTimeout = setTimeout(() => {
      if (resume || jobDescription) {
        saveFormData({
          resume,
          jobDescription,
          jobUrl,
          jobTitle
        });
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(saveTimeout);
  }, [resume, jobDescription, jobUrl, jobTitle]);
  
  // Save when substantial content is entered
  useEffect(() => {
    if (resume.length > 200 || jobDescription.length > 200) {
      saveFormData({
        resume,
        jobDescription,
        jobUrl,
        jobTitle
      });
    }
  }, [resume.length > 200, jobDescription.length > 200]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (resume && (jobDescription || jobUrl)) {
      // Immediately show loading spinner
      setSubmitting(true);

      onSubmit(
        resume, 
        jobDescription, 
        jobUrl,
        jobTitle
      );
    }
  };

  // Use either the prop loading state or our local submitting state
  const isSubmitting = isLoading || submitting;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <ResumeUploadSection
            resumeText={resume}
            setResumeText={setResume}
            onFileUpload={handleFileUpload}
            onTextChange={() => {}}
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
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
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
              disabled={isSubmitting || isDisabled}
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting || isDisabled || !resume || (!jobDescription && !jobUrl)}
              className="px-8 py-6 text-lg relative"
            >
              {isSubmitting ? (
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
