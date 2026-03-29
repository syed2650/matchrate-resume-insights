
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/mixpanel";
import { ResumeFile } from "../types";
import mammoth from "mammoth";
import * as pdfjs from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import Tesseract from "tesseract.js";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MIN_RESUME_TEXT_LENGTH = 100;
const OCR_RENDER_SCALE = 2;

const normalizeExtractedText = (text: string) =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const countMatches = (text: string, pattern: RegExp) => (text.match(pattern) || []).length;

const looksLikePdfBinary = (text: string) =>
  /%PDF-|endobj|stream|xref|trailer|\/Producer|\/Type\s*\/Page/i.test(text);

const hasMeaningfulResumeText = (text: string, minLength = MIN_RESUME_TEXT_LENGTH) => {
  const normalized = normalizeExtractedText(text);

  if (normalized.length < minLength) return false;

  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const letterCount = countMatches(normalized, /[A-Za-z]/g);
  const unusualCharacterCount = countMatches(normalized, /[^A-Za-z0-9\s@&/.,\-+()#:;%•]/g);
  const unusualCharacterRatio = normalized.length > 0 ? unusualCharacterCount / normalized.length : 1;

  return wordCount >= 20 && letterCount >= 80 && unusualCharacterRatio < 0.35;
};

const extractTextFromPdfPage = async (page: any) => {
  const textContent = await page.getTextContent({
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  });

  const items = (textContent.items || []).filter(
    (item: any) => typeof item?.str === "string" && item.str.trim().length > 0
  );

  if (!items.length) return "";

  const lineBuckets = new Map<number, Array<{ x: number; text: string }>>();

  for (const item of items) {
    const x = item.transform?.[4] ?? 0;
    const y = item.transform?.[5] ?? 0;
    const bucketY = Math.round(y / 3) * 3;
    const existingLine = lineBuckets.get(bucketY) || [];

    existingLine.push({ x, text: item.str });
    lineBuckets.set(bucketY, existingLine);
  }

  return [...lineBuckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, lineItems]) =>
      lineItems
        .sort((a, b) => a.x - b.x)
        .map(({ text }) => text.trim())
        .filter(Boolean)
        .join(" ")
    )
    .join("\n");
};

const renderPdfPageToCanvas = async (page: any) => {
  const viewport = page.getViewport({ scale: OCR_RENDER_SCALE });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Canvas context unavailable for OCR.");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas;
};

const extractTextFromPdfWithOcr = async (pdf: any) => {
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = await renderPdfPageToCanvas(page);

      try {
        const result = await Tesseract.recognize(canvas, "eng");
        const pageText = normalizeExtractedText(result.data.text || "");

        if (pageText) {
          pages.push(pageText);
        }
      } finally {
        canvas.width = 0;
        canvas.height = 0;
      }
    } catch (error) {
      console.error(`OCR failed on PDF page ${pageNumber}:`, error);
    }
  }

  return normalizeExtractedText(pages.join("\n\n"));
};

const extractTextFromPdf = async (file: File) => {
  let pdf: any;

  try {
    const arrayBuffer = await file.arrayBuffer();
    pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;

    const nativePages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      try {
        const page = await pdf.getPage(pageNumber);
        const pageText = await extractTextFromPdfPage(page);

        if (pageText) {
          nativePages.push(pageText);
        }
      } catch (error) {
        console.error(`Native extraction failed on PDF page ${pageNumber}:`, error);
      }
    }

    const nativeText = normalizeExtractedText(nativePages.join("\n\n"));

    if (!looksLikePdfBinary(nativeText) && hasMeaningfulResumeText(nativeText)) {
      return nativeText;
    }

    const ocrText = await extractTextFromPdfWithOcr(pdf);

    if (hasMeaningfulResumeText(ocrText)) {
      return ocrText;
    }

    const bestEffortText = ocrText.length > nativeText.length ? ocrText : nativeText;

    if (hasMeaningfulResumeText(bestEffortText, 60)) {
      return bestEffortText;
    }

    throw new Error(
      "We tried both PDF parsing and OCR but still couldn't extract enough readable text. Please upload a Word (.docx) file, a clear screenshot/image, or paste your resume text directly."
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Could not parse this PDF file. Please try uploading a Word (.docx) file, a screenshot/image, or paste your resume text directly."
    );
  } finally {
    if (pdf) {
      await pdf.destroy();
    }
  }
};

export const useResumeUpload = () => {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [hasParsingError, setHasParsingError] = useState(false);
  const { toast } = useToast();

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
        try {
          extractedText = await extractTextFromPdf(file);
        } catch (pdfError) {
          setHasParsingError(true);
          throw pdfError instanceof Error
            ? pdfError
            : new Error("Could not parse this PDF file. Please try uploading a Word (.docx) file, a screenshot/image, or paste your resume text directly.");
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
      const cleanText = normalizeExtractedText(extractedText);
      
      // Final check to make sure we have enough content
      if (cleanText.length < MIN_RESUME_TEXT_LENGTH) {
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
