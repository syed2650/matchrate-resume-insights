import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import ResumeUploadSection from "./ResumeUploadSection";

interface ResumeAnalyzerProps {
  onResumeChange: (resume: string) => void;
  onJobDescriptionChange: (jobDescription: string) => void;
  onAnalyze: () => void;
  resumeText: string;
  jobDescription: string;
}

const ResumeAnalyzer = ({ 
  onResumeChange, 
  onJobDescriptionChange, 
  onAnalyze,
  resumeText,
  jobDescription 
}: ResumeAnalyzerProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);

  const handleFileUpload = (file: File) => {
    setResumeFile(file);
    // File parsing logic would go here
    // For now, just set the resume text
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onResumeChange(text);
    };
    reader.readAsText(file);
  };

  const clearResume = () => {
    setResumeFile(null);
    onResumeChange("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <ResumeUploadSection
          resumeText={resumeText}
          setResumeText={onResumeChange}
          onFileUpload={handleFileUpload}
          onTextChange={() => {}}
          isParsingResume={isParsingResume}
          resumeFile={resumeFile}
          onClear={clearResume}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Job Description *
          </label>
          <Textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[200px]"
          />
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!resumeText || !jobDescription}
          className="w-full h-auto py-6 flex flex-col items-center gap-2"
          size="lg"
        >
          <Sparkles className="h-6 w-6" />
          <span className="font-semibold text-lg">Analyze Results</span>
          <span className="text-xs opacity-80">Run all 4 AI agents at once</span>
        </Button>
      </div>
    </Card>
  );
};

export default ResumeAnalyzer;
