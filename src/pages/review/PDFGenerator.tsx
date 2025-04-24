
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

  // Configure document styles
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

  return doc;
};

export default generatePDF;
