
import React from 'react';
import { pdf } from "@react-pdf/renderer";
import { ResumeData } from "../utils/parseResumeIntoData";
import ResumePdfTemplate from "../components/ResumePdfTemplate";

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Create the PDF document using React.createElement instead of JSX
    // since we're in a .ts file not a .tsx file
    const blob = await pdf(
      React.createElement(ResumePdfTemplate, { data: resumeData })
    ).toBlob();
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `interview-ready-resume.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again later or use DOCX download instead.");
  }
}
