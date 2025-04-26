
import { jsPDF } from "jspdf";
import { Feedback } from "./types";
import { PDF_STYLES as styles, configurePDFStyles } from "./pdf/styles";
import { drawHeader, drawMetadata, drawScores, addFooters } from "./pdf/sections";
import { 
  drawMissingKeywords, 
  drawSectionFeedback, 
  drawWeakBullets, 
  drawFinalSection 
} from "./pdf/content";

export const generatePDF = (feedback: Feedback): jsPDF => {
  // Create new PDF document with a4 format (210x297mm)
  const doc = new jsPDF({ 
    format: 'a4',
    unit: 'mm',
  });

  try {
    // Configure document styles for professional output
    configurePDFStyles(doc);
    
    // Calculate usable width
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    drawHeader(doc, pageWidth);
    
    // Track y position as we add content
    let yPos = 40;
    
    // Add metadata
    yPos = drawMetadata(doc, yPos);
    
    // Add scores section
    yPos = drawScores(doc, feedback, pageWidth, yPos);
    
    // Add missing keywords
    yPos = drawMissingKeywords(doc, feedback, pageWidth, yPos);
    
    // Add section feedback
    yPos = drawSectionFeedback(doc, feedback, pageWidth, yPos);
    
    // Add weak bullet improvements
    yPos = drawWeakBullets(doc, feedback, pageWidth, yPos);
    
    // Add final sections
    yPos = drawFinalSection(doc, feedback, pageWidth, yPos);

    // Add footers to all pages
    addFooters(doc);

    console.log("PDF generation completed successfully");
    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Create a basic error PDF instead of failing completely
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("Error generating full report", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Please try again or contact support if the issue persists.", 20, 30);
    doc.text("Error details: " + ((error as Error).message || "Unknown error"), 20, 40);
    return doc;
  }
};

export default generatePDF;
