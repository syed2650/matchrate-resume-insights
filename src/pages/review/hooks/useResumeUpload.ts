
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/mixpanel";
import { ResumeFile } from "../types";
import mammoth from "mammoth";
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const useResumeUpload = () => {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [hasParsingError, setHasParsingError] = useState(false);
  const { toast } = useToast();

  // Maximum file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileUpload = async (file: File) => {
    setIsParsingResume(true);
    setHasParsingError(false);
    
    try {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB. Please upload a smaller file.",
          variant: "destructive"
        });
        setIsParsingResume(false);
        setHasParsingError(true);
        return;
      }
      
      setResumeFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      let extractedText = "";
      
      // Handle image files - text should already be extracted by OCR in the component
      if (file.type.startsWith('image/') || file.type === 'text/plain') {
        try {
          extractedText = await file.text();
        } catch (error) {
          setHasParsingError(true);
          throw new Error("Could not read the processed text. Please try uploading the image again.");
        }
      }
      // Process based on file type for documents
      else if (file.type === "application/pdf") {
        // Handle PDF files using pdfjs which works in browsers
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument(new Uint8Array(arrayBuffer)).promise;
          
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          extractedText = fullText;
          
          // Verify extracted content
          if (!extractedText || extractedText.trim().length < 50) {
            throw new Error("Could not extract sufficient text from PDF. The PDF may be scanned or contain images of text.");
          }
        } catch (pdfError) {
          setHasParsingError(true);
          throw new Error("Could not parse this PDF file. Please upload a text-based PDF or try using Word (.docx) format instead.");
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Handle DOCX files
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({arrayBuffer});
          extractedText = result.value;
          
          // Verify extracted content
          if (!extractedText || extractedText.trim().length < 50) {
            throw new Error("Could not extract sufficient text from DOCX file.");
          }
        } catch (docxError) {
          setHasParsingError(true);
          throw new Error("Could not parse this DOCX file. The file might be corrupted or password protected.");
        }
      } else {
        // Try basic text extraction as fallback
        try {
          extractedText = await file.text();
          
          // Check if we got meaningful content
          if (extractedText.trim().length < 50) {
            setHasParsingError(true);
            throw new Error("Unsupported file format. Please upload a PDF, DOCX, TXT file, or an image.");
          }
        } catch (error) {
          setHasParsingError(true);
          throw new Error("Unsupported file format. Please upload a PDF, DOCX, TXT file, or an image.");
        }
      }
      
      // Clean up text (remove excessive whitespace, etc.)
      const cleanText = extractedText
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      
      // Final check to make sure we have enough content
      if (cleanText.length < 100) {
        setHasParsingError(true);
        throw new Error("We couldn't extract enough text from your file. The file might be an image-based PDF or contain too little text. Please try uploading a different format or copy-paste your resume text directly.");
      }
      
      setResume(cleanText);
      
      const fileTypeLabel = file.type.startsWith('image/') ? 'image' : 'document';
      toast({
        title: `Resume ${fileTypeLabel} processed successfully`,
        description: `Extracted content from ${file.name}`,
      });
      track("Resume Uploaded");
    } catch (error) {
      setHasParsingError(true);
      console.error("Error parsing file:", error);
      toast({
        title: "Error processing resume",
        description: error instanceof Error 
          ? error.message 
          : "We couldn't extract text from your resume. Please upload a text-based file (.docx or PDF), an image, or copy-paste your resume text manually.",
        variant: "destructive"
      });
    } finally {
      setIsParsingResume(false);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResume("");
    setHasParsingError(false);
  };

  return {
    resume,
    setResume,
    resumeFile,
    isParsingResume,
    hasParsingError,
    handleFileUpload,
    clearResume
  };
};
