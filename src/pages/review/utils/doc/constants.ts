
import { convertInchesToTwip, BorderStyle } from "docx";

export const COLORS = {
  darkBlue: "FFFFFF", // White text for dark background
  text: "FFFFFF",     // White text
  background: "000000" // Black background
};

export const FONTS = {
  main: "Calibri",
};

export const SPACING = {
  sectionSpace: 300, // Space after sections
  headingAfter: 120, // Space after heading title
  betweenParagraphs: 100, // Space between bullet points
};

export const MARGINS = {
  top: convertInchesToTwip(0.5),
  right: convertInchesToTwip(0.7),
  bottom: convertInchesToTwip(0.5),
  left: convertInchesToTwip(0.7),
};

export const BORDERS = {
  none: {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE },
  }
};

export const TEXT_SIZE = {
  name: 28,
  contact: 20,
  heading: 22,
  normal: 22,
};
