
import React from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ResumeFile } from "../types";

interface Props {
  resume: string;
  setResume: (value: string) => void;
  resumeFile: ResumeFile | null;
  isParsingResume: boolean;
  onFileUpload: (file: File) => void;
  onClear: () => void;
}

export const ResumeUploadSection: React.FC<Props> = ({
  resume,
  setResume,
  resumeFile,
  isParsingResume,
  onFileUpload,
  onClear
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Resume</h2>
        <div className="relative">
          <input
            type="file"
            id="resume-upload"
            className="absolute inset-0 opacity-0 w-full cursor-pointer"
            accept=".pdf,.docx,.doc,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileUpload(file);
            }}
            disabled={isParsingResume}
          />
          <Button 
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            disabled={isParsingResume}
          >
            <FileText className="h-4 w-4" />
            {isParsingResume ? "Parsing..." : "Upload File"}
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Copy and paste your resume text here..."
          className="min-h-[200px] resize-y rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          required={!resumeFile}
        />
        
        {isParsingResume && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="mt-2 text-sm font-medium text-blue-600">Parsing resume...</span>
            </div>
          </div>
        )}
      </div>
      
      {resumeFile && (
        <div className="flex items-center bg-blue-50 p-4 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm text-blue-700 font-medium">{resumeFile.name}</span>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-blue-600 h-8 hover:text-red-600"
            onClick={onClear}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};
