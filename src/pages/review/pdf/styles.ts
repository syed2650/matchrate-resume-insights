
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
    },
    blue: {
      600: '#2563EB'
    }
  },
  fonts: {
    regular: 'Arial',
    bold: 'Arial-Bold',
  },
  fontSize: {
    small: 9,
    normal: 10,
    large: 12,
    title: 16,
  },
  backgrounds: {
    header: [30, 41, 59] as [number, number, number], // Dark blue
    lightGray: [248, 250, 252] as [number, number, number],
    lightBlue: [239, 246, 255] as [number, number, number],
  },
  lineHeight: 1.5
};

export function configurePDFStyles(doc: jsPDF) {
  // Configure document for professional output
  doc.setFont('Arial');
  doc.setFontSize(PDF_STYLES.fontSize.normal);
  doc.setLineHeightFactor(PDF_STYLES.lineHeight);
  
  return doc;
}
