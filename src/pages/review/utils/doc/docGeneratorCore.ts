
import {
  Document,
  Packer,
} from "docx";
import type { ResumeData } from "../resume/types";
import { MARGINS, COLORS } from "./constants";
import {
  generateHeaderSection,
  generateSummarySection,
  generateExperienceSection,
  generateSkillsSection,
  generateEducationSection,
} from "./sectionGenerators";

/**
 * Generate a DOCX document from resume data
 */
export const generateDocument = async (data: ResumeData) => {
  const headerSection = generateHeaderSection(data);
  const summarySection = generateSummarySection(data);
  const experienceSection = generateExperienceSection(data);
  const skillsSection = generateSkillsSection(data);
  const educationSection = generateEducationSection(data);

  // Combine all sections
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGINS.top,
              right: MARGINS.right,
              bottom: MARGINS.bottom,
              left: MARGINS.left,
            },
            background: {
              color: COLORS.background,
            },
          },
        },
        children: [
          ...headerSection,
          ...summarySection,
          ...experienceSection,
          ...skillsSection,
          ...educationSection,
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
