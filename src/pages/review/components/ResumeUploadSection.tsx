
import React, { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { UploadCloud, X, File, Loader2 } from "lucide-react";
import { bytesToSize } from "../utils";
import { ResumeFile } from "../types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResumeUploadSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  onFileUpload: (file: File) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isParsingResume: boolean;
  resumeFile: ResumeFile | null;
  onClear: () => void;
}

const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  resumeText,
  setResumeText,
  onFileUpload,
  onTextChange,
  isParsingResume,
  resumeFile,
  onClear,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Simulate upload progress for better UX
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          onFileUpload(acceptedFiles[0]);
          setTimeout(() => setUploadProgress(0), 1000);
        }
      }, 100);
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Upload Your Resume
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Upload your resume to analyze it against a job description. We support PDF, DOCX, and TXT formats.
      </p>

      {!resumeText && !isParsingResume ? (
        <div
          {...getRootProps({
            className: `border-2 border-dashed p-8 rounded-lg cursor-pointer
              ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-700"}
              transition-colors duration-200 ease-in-out
              flex flex-col items-center justify-center
              min-h-[150px] md:min-h-[250px]`,
          })}
          aria-label="Drop zone for resume upload"
        >
          <input {...getInputProps()} aria-label="File input" />
          
          <UploadCloud size={40} className="text-gray-400 mb-4" aria-hidden="true" />
          
          <div className="text-center">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Drag & drop your resume here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or
            </p>
            <Button type="button" className="mt-2" size="lg">
              Browse Files
            </Button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supported formats: PDF, DOCX, TXT
            </p>
          </div>
        </div>
      ) : isParsingResume ? (
        <Card className="p-6 flex flex-col items-center justify-center min-h-[150px]">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-700 dark:text-gray-300 font-medium">Extracting content from your resume...</p>
          <Progress className="w-64 mt-4" value={75} aria-label="Parsing progress" />
        </Card>
      ) : (
        <div className="space-y-4">
          {resumeFile && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <File className="h-5 w-5 text-blue-500 mr-2" aria-hidden="true" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 text-sm truncate max-w-[180px] sm:max-w-xs">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {bytesToSize(resumeFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="text-gray-500 hover:text-red-500"
                aria-label="Remove uploaded file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <Progress 
                value={uploadProgress} 
                className="h-2" 
                aria-label="Upload progress"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}%</p>
            </div>
          )}

          <div>
            <label 
              htmlFor="resumeText" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Resume Text
            </label>
            <textarea
              id="resumeText"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                        resize-y resume-input"
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                if (onTextChange) onTextChange(e);
              }}
              placeholder="Your resume content will appear here. You can also paste your resume text directly."
              aria-label="Resume text content"
            />
          </div>

          {resumeText && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClear}
                aria-label="Clear resume content"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploadSection;
