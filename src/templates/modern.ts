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
  layout: "two-column",
  preview: "/templates/modern-preview.png", // This would be the path to a preview image
  columnRatio: 70, // Left column takes 70% of width
  headerSpanColumns: true, // Header spans both columns
  sidebarSection: "right", // Which side gets the sidebar
  skillStyle: "bar", // Use progress bars for skills
  borderRadius: "4px", // Border radius for UI elements
  sectionTitleCase: "uppercase", // Section titles in uppercase
  iconSet: "minimal", // Use minimal icon set
  bulletStyle: "circle" // Use circle bullets
};

export default modernTemplate;
