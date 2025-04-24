
import { jsPDF } from "jspdf";

// Define PDF styles as typed tuples for proper TypeScript compatibility
export const PDF_STYLES = {
  margins: {
    side: 15,
    top: 30,
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
    regular: 'Inter',
    bold: 'Inter-bold',
  },
  fontSize: {
    small: 10,
    normal: 12,
    large: 14,
    title: 20,
  },
  backgrounds: {
    header: [30, 41, 59] as [number, number, number], // Dark blue
    lightGray: [248, 250, 252] as [number, number, number],
    lightBlue: [239, 246, 255] as [number, number, number],
  }
};

export function configurePDFStyles(doc: jsPDF) {
  // Set fonts for a more professional look
  doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ.ttf', 'Inter', 'normal');
  doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ.ttf', 'Inter', 'bold');
  
  // Set default font
  doc.setFont('Inter');

  return doc;
}
