
import React from 'react';
import { pdf } from "@react-pdf/renderer";
import { ResumeData } from "../utils/parseResumeIntoData";
import ResumePdfTemplate from "../components/ResumePdfTemplate";

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Create the PDF document using the correct Document component and props
    const blob = await pdf(
      <ResumePdfTemplate data={resumeData} />
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
