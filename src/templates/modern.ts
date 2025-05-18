
import { ResumeTemplate } from "../utils/resumeRewriter";

const modernTemplate: ResumeTemplate = {
  id: "modern",
  name: "Modern",
  fontFamily: "'Open Sans', sans-serif",
  primaryColor: "#2D74FF",
  secondaryColor: "#E6F0FF",
  headerStyle: "bold",
  sectionDividers: true,
  spacing: "compact",
  layout: "two-column", // 70/30 split
  // columnRatio: 70, // Left column takes 70% of width - removed as not in the interface
};

export default modernTemplate;
