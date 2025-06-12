
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Loader2, File, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeFile } from "../types";
import { bytesToSize } from "../utils";
import Tesseract from 'tesseract.js';

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Handle image OCR processing
  const handleImageUpload = async (file: File) => {
    setIsProcessingImage(true);
    setOcrProgress(0);
    setUploadError(null);

    try {
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image file too large. Maximum size is 5MB.");
      }

      // Set file info
      const imageFile: ResumeFile = {
        name: file.name,
        size: file.size,
        type: file.type
      };

      // Process image with Tesseract OCR
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });

      const extractedText = result.data.text.trim();

      if (!extractedText || extractedText.length < 50) {
        throw new Error("Could not extract sufficient text from the image. Please ensure the image is clear and contains readable text, or try uploading a different format.");
      }

      // Clean up the extracted text
      const cleanText = extractedText
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      setResumeText(cleanText);
      
      // Create a virtual file object for display purposes
      const virtualFile = new File([cleanText], file.name.replace(/\.(jpg|jpeg|png|webp)$/i, '.txt'), {
        type: 'text/plain'
      });
      
      // Use the existing file upload handler for consistency
      onFileUpload(virtualFile);

    } catch (error) {
      console.error("Error processing image:", error);
      setUploadError(error instanceof Error ? error.message : "Failed to process image. Please try a different image or format.");
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(0);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        
        // Check if file is an image
        if (file.type.startsWith('image/')) {
          handleImageUpload(file);
        }
        // Check if file is PDF, DOCX, or TXT
        else if (
          file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "text/plain"
        ) {
          onFileUpload(file);
        } else {
          setUploadError("Unsupported file type. Please upload a PDF, DOCX, TXT file, or an image (JPG, PNG, WebP).");
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
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    },
    maxFiles: 1,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    onTextChange(e);
  };

  const isProcessing = isParsingResume || isProcessingImage;

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
              <div className="flex justify-center space-x-4 mb-4">
                <File className="h-8 w-8 text-gray-400" />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">
                Drag & drop your resume file or image here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>Documents:</strong> PDF, DOCX, TXT (max 5MB)
              </p>
              <p className="text-xs text-gray-500">
                <strong>Images:</strong> JPG, PNG, WebP (max 5MB) - We'll extract text using OCR
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

      {isProcessingImage && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <div className="flex items-center mb-2">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
            <p className="text-blue-700">Processing image with OCR...</p>
          </div>
          {ocrProgress > 0 && (
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{width: `${ocrProgress}%`}}
              ></div>
            </div>
          )}
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

      {resumeFile && !isProcessing && (
        <div className="mb-4">
          <Card className="p-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {resumeFile.type.startsWith('image/') ? (
                  <ImageIcon className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <File className="h-5 w-5 text-blue-600 mr-2" />
                )}
                <div>
                  <p className="font-medium text-sm">{resumeFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {bytesToSize(resumeFile.size)}
                    {resumeFile.type.startsWith('image/') && (
                      <span className="ml-2 text-green-600">• Text extracted via OCR</span>
                    )}
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
        placeholder="Copy and paste your resume text here or upload a file/image above..."
        className="w-full min-h-[250px] p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isProcessing}
      />

      {!resumeText && !isProcessing && !resumeFile && (
        <div className="mt-2 space-y-2">
          <p className="text-sm text-amber-600">
            <span className="font-semibold">Pro tip:</span> For best results, upload a text-based PDF
            or DOCX file to ensure all formatting is correctly captured.
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-semibold">New!</span> You can now upload images (photos/screenshots) 
            of your resume - we'll extract the text automatically using OCR technology.
          </p>
        </div>
      )}
      
      {resumeText && resumeText.length < 200 && !isProcessing && (
        <p className="text-sm text-amber-600 mt-2">
          Your resume seems quite short. For the best analysis, please ensure your complete resume is included.
        </p>
      )}
    </div>
  );
};

export default ResumeUploadSection;
