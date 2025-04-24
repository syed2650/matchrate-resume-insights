
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResumeFile } from "../types";
import mammoth from "mammoth";
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const useResumeUpload = () => {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const { toast } = useToast();

  // Maximum file size: 5MB
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleFileUpload = async (file: File) => {
    setIsParsingResume(true);
    
    try {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB. Please upload a smaller file.",
          variant: "destructive"
        });
        setIsParsingResume(false);
        return;
      }
      
      setResumeFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      let extractedText = "";
      
      // Process based on file type
      if (file.type === "application/pdf") {
        // Handle PDF files using pdfjs which works in browsers
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
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Handle DOCX files
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({arrayBuffer});
        extractedText = result.value;
      } else if (file.type === "text/plain") {
        // Handle plain text files
        extractedText = await file.text();
      } else {
        // Try basic text extraction as fallback
        try {
          extractedText = await file.text();
        } catch (error) {
          throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file.");
        }
      }
      
      // Clean up text (remove excessive whitespace, etc.)
      const cleanText = extractedText
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      
      setResume(cleanText);
      
      toast({
        title: "Resume parsed successfully",
        description: `Extracted content from ${file.name}`,
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "Error parsing resume",
        description: error instanceof Error ? error.message : "Failed to extract text from the uploaded file. Please paste your resume text manually.",
        variant: "destructive"
      });
    } finally {
      setIsParsingResume(false);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResume("");
  };

  return {
    resume,
    setResume,
    resumeFile,
    isParsingResume,
    handleFileUpload,
    clearResume
  };
};
