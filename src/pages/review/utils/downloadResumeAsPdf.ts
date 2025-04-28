
// This file is kept for compatibility but functionality is moved to docGenerator
import { ResumeData } from "../components/ResumePdfTemplate";

export async function downloadResumeAsPdf(resumeData: ResumeData) {
  console.error("PDF download is currently not supported. Please use DOCX download instead.");
  throw new Error("PDF download is temporarily disabled. Please use DOCX download instead.");
}
