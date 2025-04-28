
import { jsPDF } from "jspdf";

// Define PDF styles as typed tuples for proper TypeScript compatibility
export const PDF_STYLES = {
  margins: {
    side: 15,
    top: 20,
  },
  colors: {
    white: '#FFFFFF',
    black: '#000000',
    slate: {
      500: '#64748B',
      600: '#475569',
      800: '#1E293B',
    },
    blue: {
      600: '#2563EB',
      700: '#1D4ED8',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
    }
  },
  fonts: {
    regular: 'Arial',
    bold: 'Arial-Bold',
    heading: 'Arial-Bold',
  },
  fontSize: {
    xs: 8,
    small: 9,
    normal: 10,
    large: 12,
    title: 16,
    header: 20,
  },
  backgrounds: {
    header: [30, 41, 59] as [number, number, number], // Dark blue
    lightGray: [248, 250, 252] as [number, number, number],
    lightBlue: [239, 246, 255] as [number, number, number],
    accent: [224, 242, 254] as [number, number, number], // Light cyan for highlights
  },
  lineHeight: 1.5,
  spacing: {
    section: 15,
    paragraph: 8,
    item: 5,
  },
  widths: {
    pageContent: 180,
    contentMaxWidth: 170,
    columnGap: 10,
  }
};

export function configurePDFStyles(doc: jsPDF) {
  // Configure document for professional output
  doc.addFont('Arial', 'Arial', 'normal');
  doc.addFont('Arial', 'Arial-Bold', 'bold');
  
  doc.setFont('Arial');
  doc.setFontSize(PDF_STYLES.fontSize.normal);
  doc.setLineHeightFactor(PDF_STYLES.lineHeight);
  
  return doc;
}

export function addProfessionalHeader(doc: jsPDF, title: string, subtitle?: string) {
  const pageWidth = doc.internal.pageSize.width;
  
  // Add gradient header background
  const headerColor = PDF_STYLES.backgrounds.header;
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  // Add logo/branding
  doc.setTextColor(PDF_STYLES.colors.white);
  doc.setFontSize(PDF_STYLES.fontSize.header);
  doc.setFont(PDF_STYLES.fonts.heading);
  doc.text(title, PDF_STYLES.margins.side, 20);
  
  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(PDF_STYLES.fontSize.normal);
    doc.setFont(PDF_STYLES.fonts.regular);
    doc.text(subtitle, PDF_STYLES.margins.side, 26);
  }
  
  // Reset text color for the document body
  doc.setTextColor(PDF_STYLES.colors.black);
}

export function formatSectionTitle(doc: jsPDF, title: string, yPos: number) {
  doc.setFontSize(PDF_STYLES.fontSize.large);
  doc.setFont(PDF_STYLES.fonts.heading);
  doc.setTextColor(PDF_STYLES.colors.blue[700]);
  
  const pageWidth = doc.internal.pageSize.width;
  
  // Add subtle background
  const bgColor = PDF_STYLES.backgrounds.accent;
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.roundedRect(PDF_STYLES.margins.side - 2, yPos - 6, pageWidth - (PDF_STYLES.margins.side * 2) + 4, 12, 1, 1, 'F');
  
  doc.text(title, PDF_STYLES.margins.side, yPos);
  
  // Add underline
  doc.setDrawColor(PDF_STYLES.colors.blue[700]);
  doc.setLineWidth(0.5);
  doc.line(PDF_STYLES.margins.side, yPos + 2, pageWidth - PDF_STYLES.margins.side, yPos + 2);
  
  // Reset styles
  doc.setFont(PDF_STYLES.fonts.regular);
  doc.setFontSize(PDF_STYLES.fontSize.normal);
  doc.setTextColor(PDF_STYLES.colors.black);
  
  return yPos + PDF_STYLES.spacing.section;
}
