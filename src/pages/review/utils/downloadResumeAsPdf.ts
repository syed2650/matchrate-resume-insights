import { pdf } from "@react-pdf/renderer";
import ResumePdfTemplate from "../components/ResumePdfTemplate"; // Adjust the path if needed
import { ResumeData } from "../components/ResumePdfTemplate"; // Import type if you want type safety

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  try {
    const blob = await pdf(<ResumePdfTemplate data={resumeData} />).toBlob();
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
