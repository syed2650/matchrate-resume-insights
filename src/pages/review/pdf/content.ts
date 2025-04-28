
import { jsPDF } from "jspdf";
import { PDF_STYLES as styles } from "./styles";
import { Feedback } from "../types";

function checkPageBreak(doc: jsPDF, yPos: number, margin: number = 20): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (yPos > pageHeight - margin) {
    doc.addPage();
    return margin + 10;
  }
  return yPos;
}

// Safe text wrapper to handle undefined/null content
function safeText(text: any): string {
  if (text === undefined || text === null) {
    return "No data available";
  }
  return typeof text === 'string' ? text : JSON.stringify(text);
}

export function drawMissingKeywords(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);
  
  // Add section title with professional formatting
  doc.setFont(styles.fonts.heading);
  doc.setFontSize(styles.fontSize.large);
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("MISSING KEYWORDS & SKILLS", styles.margins.side, yPos);
  
  // Add subtle section divider
  doc.setDrawColor(styles.colors.gray[200]);
  doc.setLineWidth(0.5);
  doc.line(styles.margins.side, yPos + 2, pageWidth - styles.margins.side, yPos + 2);
  
  doc.setTextColor(styles.colors.black);
  yPos += 10;
  
  // Reset styles for content
  doc.setFont(styles.fonts.regular);
  doc.setFontSize(styles.fontSize.normal);
  
  if (feedback.missingKeywords && feedback.missingKeywords.length > 0) {
    const columns = 2;
    const colWidth = (pageWidth - (styles.margins.side * 2)) / columns;
    const itemsPerCol = Math.ceil(feedback.missingKeywords.length / columns);
    
    for (let i = 0; i < feedback.missingKeywords.length; i++) {
      const colIndex = Math.floor(i / itemsPerCol);
      const rowIndex = i % itemsPerCol;
      const xPos = styles.margins.side + (colWidth * colIndex);
      const currentY = yPos + (rowIndex * 8);
      
      // Check for page break within column loop
      if (currentY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 30;
        break; // Exit this column and continue with next on new page
      }
      
      // Draw background for each item
      const lightBlueColor = styles.backgrounds.lightBlue;
      doc.setFillColor(lightBlueColor[0], lightBlueColor[1], lightBlueColor[2]);
      doc.roundedRect(xPos, currentY - 4, colWidth - 4, 7, 1, 1, 'F');
      
      const keyword = safeText(feedback.missingKeywords[i]);
      doc.text(`• ${keyword}`, xPos + 3, currentY);
    }
    
    yPos += (Math.min(itemsPerCol, feedback.missingKeywords.length) * 8) + 6;
  } else {
    doc.text("No critical keywords missing.", styles.margins.side, yPos);
    yPos += 10;
  }
  
  return yPos;
}

export function drawSectionFeedback(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);
  
  // Section title with professional formatting
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.heading);
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("SECTION-BY-SECTION FEEDBACK", styles.margins.side, yPos);
  
  // Add subtle section divider
  doc.setDrawColor(styles.colors.gray[200]);
  doc.setLineWidth(0.5);
  doc.line(styles.margins.side, yPos + 2, pageWidth - styles.margins.side, yPos + 2);
  
  doc.setTextColor(styles.colors.black);
  yPos += 10;

  if (feedback.sectionFeedback && Object.keys(feedback.sectionFeedback).length > 0) {
    doc.setFontSize(styles.fontSize.normal);
    Object.entries(feedback.sectionFeedback).forEach(([section, text]: [string, string]) => {
      yPos = checkPageBreak(doc, yPos);
      
      // Add section name with background
      const lightGrayColor = styles.backgrounds.lightGray;
      doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
      doc.roundedRect(styles.margins.side, yPos - 5, pageWidth - (styles.margins.side * 2), 10, 1, 1, 'F');
      doc.setFont(styles.fonts.heading);
      doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}:`, styles.margins.side + 2, yPos);
      yPos += 8;
      
      doc.setFont(styles.fonts.regular);
      const feedbackText = safeText(text);
      const splitText = doc.splitTextToSize(feedbackText, pageWidth - (styles.margins.side * 2) - 4);
      
      // Check if this text block will exceed page height
      if (yPos + (splitText.length * 6) > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(splitText, styles.margins.side + 2, yPos);
      yPos += splitText.length * 6 + 10;
    });
  } else {
    doc.text("No section feedback available.", styles.margins.side, yPos);
    yPos += 10;
  }

  return yPos;
}

export function drawWeakBullets(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);

  // Section title with professional formatting
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.heading);
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("BULLET POINT IMPROVEMENTS", styles.margins.side, yPos);
  
  // Add subtle section divider
  doc.setDrawColor(styles.colors.gray[200]);
  doc.setLineWidth(0.5);
  doc.line(styles.margins.side, yPos + 2, pageWidth - styles.margins.side, yPos + 2);
  
  doc.setTextColor(styles.colors.black);
  yPos += 10;
  
  if (feedback.weakBullets && feedback.weakBullets.length > 0) {
    doc.setFontSize(styles.fontSize.normal);
    
    for (let i = 0; i < feedback.weakBullets.length; i++) {
      const bullet = feedback.weakBullets[i];
      yPos = checkPageBreak(doc, yPos);
      
      if (typeof bullet === "object" && bullet.original && bullet.improved) {
        // Original bullet
        const lightGrayColor = styles.backgrounds.lightGray;
        doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
        
        // Get the height based on text wrapping
        const origText = doc.splitTextToSize(bullet.original, pageWidth - (styles.margins.side * 2) - 8);
        const origHeight = origText.length * 5 + 4;
        
        // Check if this will fit on the current page
        if (yPos + origHeight + 15 > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.roundedRect(styles.margins.side, yPos - 4, pageWidth - (styles.margins.side * 2), 6 + origHeight, 1, 1, 'F');
        
        doc.setFont(styles.fonts.heading);
        doc.setTextColor(styles.colors.slate[600]);
        doc.text("Original:", styles.margins.side + 2, yPos);
        yPos += 6;
        
        doc.setFont(styles.fonts.regular);
        doc.setTextColor(styles.colors.slate[600]);
        doc.text(origText, styles.margins.side + 4, yPos);
        yPos += origHeight + 4;
        
        // Check page break again for improved section
        yPos = checkPageBreak(doc, yPos);
        
        // Improved bullet
        const lightBlueColor = styles.backgrounds.lightBlue;
        doc.setFillColor(lightBlueColor[0], lightBlueColor[1], lightBlueColor[2]);
        
        // Get the height based on text wrapping
        const imprText = doc.splitTextToSize(bullet.improved, pageWidth - (styles.margins.side * 2) - 8);
        const imprHeight = imprText.length * 5 + 4;
        
        // Check if improved section will fit
        if (yPos + imprHeight + 15 > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.roundedRect(styles.margins.side, yPos - 4, pageWidth - (styles.margins.side * 2), 6 + imprHeight, 1, 1, 'F');
        
        doc.setFont(styles.fonts.heading);
        doc.setTextColor(styles.colors.blue[600]);
        doc.text("Improved:", styles.margins.side + 2, yPos);
        yPos += 6;
        
        doc.setFont(styles.fonts.regular);
        doc.setTextColor(styles.colors.black);
        doc.text(imprText, styles.margins.side + 4, yPos);
        yPos += imprHeight + 10;
      }
    }
  } else {
    doc.text("No bullet point improvements available.", styles.margins.side, yPos);
    yPos += 10;
  }

  return yPos;
}

export function drawFinalSection(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);

  // Add tone suggestions
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.heading);
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("TONE & CLARITY SUGGESTIONS", styles.margins.side, yPos);
  
  // Add subtle section divider
  doc.setDrawColor(styles.colors.gray[200]);
  doc.setLineWidth(0.5);
  doc.line(styles.margins.side, yPos + 2, pageWidth - styles.margins.side, yPos + 2);
  
  doc.setTextColor(styles.colors.black);
  yPos += 10;
  
  if (feedback.toneSuggestions) {
    doc.setFontSize(styles.fontSize.normal);
    doc.setFont(styles.fonts.regular);
    const toneSuggestions = safeText(feedback.toneSuggestions);
    const toneSplit = doc.splitTextToSize(toneSuggestions, pageWidth - (styles.margins.side * 2));
    
    // Check if this text block will exceed page height
    if (yPos + (toneSplit.length * 5) > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(toneSplit, styles.margins.side, yPos);
    yPos += toneSplit.length * 5 + 12;
  } else {
    doc.text("No tone suggestions available.", styles.margins.side, yPos);
    yPos += 12;
  }

  yPos = checkPageBreak(doc, yPos);

  // Add interview recommendation in a highlighted box
  const boxMargin = 5;
  const boxPadding = 8;
  doc.setFillColor(236, 252, 243); // Light green background
  doc.setDrawColor(34, 197, 94); // Green border
  doc.setLineWidth(0.5);
  doc.roundedRect(
    styles.margins.side - boxMargin, 
    yPos - boxMargin, 
    pageWidth - (styles.margins.side * 2) + (boxMargin * 2), 
    50, 
    3, 3, 'FD');

  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.heading);
  doc.setTextColor(styles.colors.slate[800]);
  doc.text("FINAL VERDICT: WOULD I INTERVIEW?", 
    styles.margins.side + boxPadding, yPos + boxPadding);
  yPos += boxPadding * 2 + 4;
  
  if (feedback.wouldInterview) {
    doc.setFontSize(styles.fontSize.normal);
    doc.setFont(styles.fonts.regular);
    doc.setTextColor(styles.colors.slate[600]);
    const interviewText = safeText(feedback.wouldInterview);
    const interviewSplit = doc.splitTextToSize(
      interviewText, 
      pageWidth - (styles.margins.side * 2) - (boxPadding * 2)
    );
    doc.text(interviewSplit, styles.margins.side + boxPadding, yPos);
  } else {
    doc.text("No interview recommendation available.", styles.margins.side + boxPadding, yPos);
  }

  return yPos + 40;
}
