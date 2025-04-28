// Full TealHQ-Level Resume Generator
// Final cleaned-up version

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  convertInchesToTwip,
  BorderStyle,
  Footer,
  PageNumber,
  HeadingLevel,
  Table,
  TableRow,
  TableCell
} from "docx";

interface Section {
  [key: string]: string[];
}

const RESUME_STYLES = {
  fonts: {
    main: "Calibri",
    heading: "Calibri",
  },
  fontSize: {
    heading: 16,
    subheading: 13,
    normal: 11,
    small: 9,
  },
  spacing: {
    afterSection: 400,
    afterParagraph: 200,
    afterHeading: 240,
  },
  colors: {
    dark: "222222",
    accent: "2563eb",
    headingBlue: "1E293B",
    light: "666666",
  },
};

export const parseResumeContent = (content: string) => {
  const sections: Section = { header: [] };
  let currentSection = "header";

  const lines = content.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.match(/^#{1,3}\s+/) || (trimmed === trimmed.toUpperCase() && trimmed.length > 4)) {
      currentSection = trimmed.replace(/^#{1,3}\s+/, '').trim();
      if (!sections[currentSection]) sections[currentSection] = [];
    } else {
      sections[currentSection].push(trimmed);
    }
  }

  return sections;
};

export const generateDocument = async (
  currentResume: string,
  roleSummary: string,
  currentAtsScore: number,
  generatedTimestamp: string
) => {
  try {
    const sections = parseResumeContent(currentResume);
    const paragraphs: Paragraph[] = [];

    // Name Extraction
    const nameLine = currentResume.split("\n")[0]?.replace(/^#{1,3}\s+/, '') || "Resume";
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: nameLine, bold: true, size: 48, font: RESUME_STYLES.fonts.main })],
      spacing: { after: RESUME_STYLES.spacing.afterHeading },
      alignment: AlignmentType.CENTER
    }));

    // Contact Info
    if (sections.header) {
      const contactInfo = sections.header.filter(l => l.includes("@") || l.includes("linkedin.com") || l.includes("github.com") || l.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/));
      if (contactInfo.length) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: contactInfo.join(" | "), font: RESUME_STYLES.fonts.main, size: 22 })],
          spacing: { after: RESUME_STYLES.spacing.afterParagraph },
          alignment: AlignmentType.CENTER
        }));
      }
    }

    // Role Summary (Italic Blue)
    if (roleSummary) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: roleSummary, italics: true, size: 24, color: RESUME_STYLES.colors.accent })],
        alignment: AlignmentType.CENTER,
        spacing: { after: RESUME_STYLES.spacing.afterSection },
      }));
    }

    // Helper to add Section Headers
    const addSectionHeader = (title: string) => paragraphs.push(new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 32, color: RESUME_STYLES.colors.headingBlue })],
      heading: HeadingLevel.HEADING_1,
      border: { bottom: { color: RESUME_STYLES.colors.headingBlue, size: 12, style: BorderStyle.SINGLE } },
      spacing: { after: RESUME_STYLES.spacing.afterHeading }
    }));

    // Process Summary
    const summaryKey = Object.keys(sections).find(k => k.toLowerCase().includes("summary"));
    if (summaryKey) {
      addSectionHeader("Professional Summary");
      for (const line of sections[summaryKey]) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, font: RESUME_STYLES.fonts.main, size: 22 })],
          spacing: { after: RESUME_STYLES.spacing.afterParagraph }
        }));
      }
    }

    // Skills
    const skillsKey = Object.keys(sections).find(k => k.toLowerCase().includes("skill"));
    if (skillsKey) {
      addSectionHeader("Key Skills");
      const skills = sections[skillsKey].join(' ').split(',').map(s => s.trim()).filter(Boolean);
      for (let i = 0; i < skills.length; i += 3) {
        paragraphs.push(new Paragraph({
          children: skills.slice(i, i + 3).map(skill => new TextRun({ text: `• ${skill} `, size: 22 })),
          spacing: { after: RESUME_STYLES.spacing.afterParagraph }
        }));
      }
    }

    // Experience
    const expKey = Object.keys(sections).find(k => k.toLowerCase().includes("experience") || k.toLowerCase().includes("employment"));
    if (expKey) {
      addSectionHeader("Professional Experience");
      let isJobTitle = false;
      for (const line of sections[expKey]) {
        if (line.includes("•")) {
          const [company, location] = line.split("•").map(s => s.trim());
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({ text: company, bold: true, size: 22 }),
              new TextRun({ text: ` • ${location}`, size: 22, color: RESUME_STYLES.colors.light })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          }));
          isJobTitle = true;
        } else if (isJobTitle) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: line, bold: true, size: 22 })],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          }));
          isJobTitle = false;
        } else if (line.startsWith("•") || line.startsWith("-")) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: line.replace(/^[-•]\s*/, ""), size: 22 })],
            bullet: { level: 0 },
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          }));
        }
      }
    }

    // Education
    const eduKey = Object.keys(sections).find(k => k.toLowerCase().includes("education"));
    if (eduKey) {
      addSectionHeader("Education");
      for (const line of sections[eduKey]) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: RESUME_STYLES.spacing.afterParagraph }
        }));
      }
    }

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
        children: paragraphs,
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `ATS Score: ${currentAtsScore}/100 | Generated on ${generatedTimestamp}`, size: 16, color: RESUME_STYLES.colors.light }),
                  new TextRun({ text: "         " }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16 }),
                  new TextRun({ text: " of " }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16 }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
                border: { top: { color: RESUME_STYLES.colors.light, style: BorderStyle.SINGLE, size: 1 } }
              })
            ]
          })
        }
      }]
    });

    return await Packer.toBlob(doc);

  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
};
