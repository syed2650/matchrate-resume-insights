
import { pdf, Document } from "@react-pdf/renderer";
import ResumePdfTemplate from "../components/ResumePdfTemplate";
import { ResumeData } from "../components/ResumePdfTemplate";
import React from 'react';

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Create a Document component that wraps our ResumePdfTemplate
    const element = React.createElement(
      Document,
      {},
      React.createElement(ResumePdfTemplate, { data: resumeData })
    );
    
    // Pass the Document element to pdf
    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optimized-resume.pdf";
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
}
