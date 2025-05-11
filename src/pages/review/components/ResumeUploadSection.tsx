
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Loader2, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeFile } from "../types";
import { bytesToSize } from "../utils";

interface ResumeUploadSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFileUpload: (file: File) => void;
  isParsingResume: boolean;
  resumeFile: ResumeFile | null;
  onClear: () => void;
}

const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  resumeText,
  setResumeText,
  onTextChange,
  onFileUpload,
  isParsingResume,
  resumeFile,
  onClear,
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Check if file is PDF, DOCX, or TXT
        if (
          file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain"
        ) {
          onFileUpload(file);
        } else {
          setUploadError("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
        }
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    onTextChange(e);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>

      {!resumeFile && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors mb-4 ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600">Drop your resume file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop your resume file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Accepted formats: PDF, DOCX, TXT (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {uploadError}
          </p>
        </div>
      )}

      {isParsingResume && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
            <p className="text-blue-700">Parsing resume content...</p>
          </div>
        </div>
      )}

      {resumeFile && !isParsingResume && (
        <div className="mb-4">
          <Card className="p-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <File className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-sm">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {bytesToSize(resumeFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="mb-2">
        <label
          htmlFor="resume"
          className="block text-sm font-medium text-gray-700"
        >
          {resumeFile
            ? "Extracted Resume Text (Edit if needed)"
            : "Paste Your Resume Text"}
        </label>
      </div>
      <textarea
        id="resume"
        value={resumeText}
        onChange={handleTextChange}
        placeholder="Copy and paste your resume text here or upload a file above..."
        className="w-full min-h-[250px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isParsingResume}
      />

      {!resumeText && !isParsingResume && !resumeFile && (
        <p className="text-sm text-amber-600 mt-2">
          <span className="font-semibold">Pro tip:</span> For best results, upload a text-based PDF
          or DOCX file to ensure all formatting is correctly captured.
        </p>
      )}
      
      {resumeText && resumeText.length < 200 && !isParsingResume && (
        <p className="text-sm text-amber-600 mt-2">
          Your resume seems quite short. For the best analysis, please ensure your complete resume is included.
        </p>
      )}
    </div>
  );
};

export default ResumeUploadSection;
