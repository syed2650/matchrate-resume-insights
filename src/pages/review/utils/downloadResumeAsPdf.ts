
import React from 'react';
import { pdf, Document } from "@react-pdf/renderer";
import { ResumeData } from "./parseResumeIntoData";
import ResumePdfTemplate from "../components/ResumePdfTemplate";

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Create the PDF document using React.createElement 
    // We need to wrap our component in a Document component from react-pdf
    const blob = await pdf(
      React.createElement(Document, {}, 
        React.createElement(ResumePdfTemplate, { data: resumeData })
      )
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
