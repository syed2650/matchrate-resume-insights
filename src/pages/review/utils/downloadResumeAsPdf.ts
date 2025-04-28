
import { pdf } from "@react-pdf/renderer";
import ResumePdfTemplate from "../components/ResumePdfTemplate"; // Adjust the path if needed
import { ResumeData } from "../components/ResumePdfTemplate"; // Import type if you want type safety
import React from 'react';

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    // Use React.createElement instead of JSX syntax
    const element = React.createElement(ResumePdfTemplate, { data: resumeData });
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
