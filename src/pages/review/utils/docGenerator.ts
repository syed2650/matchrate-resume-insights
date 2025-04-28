// Final, fully corrected docGenerator.ts
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
  PageNumber,
  Footer,
  convertInchesToTwip,
} from "docx";

interface Section {
  [key: string]: string[];
}

const RESUME_STYLES = {
  fonts: {
    main: "Calibri",
  },
  fontSize: {
    heading: 16,
    subheading: 13,
    normal: 11,
    small: 9,
  },
  spacing: {
    afterSection: 300,
    afterParagraph: 150,
    afterHeading: 200,
  },
  colors: {
    dark: "222222",
    accent: "2563EB",
    light: "666666",
  },
};

export async function generateDocument(
  resumeText: string,
  roleSummary: string,
  atsScore: number,
  generatedTimestamp: string,
  activeVersion: string,
  hasMultipleVersions: boolean
) {
  const paragraphs: Paragraph[] = [];

  const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentSection = "";
  let currentExperience: any = null;

  // Header: Name
  const name = lines.shift() || "Candidate Name";
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({ text: name, bold: true, size: 32, font: RESUME_STYLES.fonts.main }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: RESUME_STYLES.spacing.afterHeading },
    })
  );

  // Header: Contact
  const contact = lines.shift() || "Contact Information";
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: contact, size: 18, font: RESUME_STYLES.fonts.main, color: RESUME_STYLES.colors.light })],
      alignment: AlignmentType.CENTER,
      spacing: { after: RESUME_STYLES.spacing.afterSection },
    })
  );

  for (const line of lines) {
    const upper = line.toUpperCase();

    if (upper.includes("SUMMARY")) {
      currentSection = "SUMMARY";
      paragraphs.push(sectionTitle("Professional Summary"));
      continue;
    } else if (upper.includes("SKILLS")) {
      currentSection = "SKILLS";
      paragraphs.push(sectionTitle("Key Skills"));
      continue;
    } else if (upper.includes("EXPERIENCE")) {
      currentSection = "EXPERIENCE";
      paragraphs.push(sectionTitle("Work Experience"));
      continue;
    } else if (upper.includes("EDUCATION")) {
      currentSection = "EDUCATION";
      paragraphs.push(sectionTitle("Education"));
      continue;
    } else if (upper.includes("CERTIFICATION")) {
      currentSection = "CERTIFICATIONS";
      paragraphs.push(sectionTitle("Certifications"));
      continue;
    }

    if (currentSection === "SUMMARY" || currentSection === "SKILLS" || currentSection === "CERTIFICATIONS") {
      paragraphs.push(simpleText(line));
    } else if (currentSection === "EXPERIENCE") {
      if (line.includes("\u2022")) {
        paragraphs.push(bulletPoint(line.replace(/^\u2022\s*/, "")));
      } else if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{2}\/\d{4})/.test(line)) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: line, italics: true, font: RESUME_STYLES.fonts.main })],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph },
          })
        );
      } else if (line.includes("\u2022")) {
        paragraphs.push(bulletPoint(line.replace(/^\u2022\s*/, "")));
      } else {
        const companyName = line.split("\u2022")[0]?.trim() || line.trim();
        paragraphs.push(companyTitle(companyName));
      }
    } else if (currentSection === "EDUCATION") {
      paragraphs.push(simpleText(line));
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `ATS Score: ${atsScore}/100 | `,
                    size: RESUME_STYLES.fontSize.small * 2,
                    color: RESUME_STYLES.colors.light,
                    font: RESUME_STYLES.fonts.main,
                  }),
                  PageNumber.CURRENT,
                  new TextRun({
                    text: " of ",
                    size: RESUME_STYLES.fontSize.small * 2,
                    color: RESUME_STYLES.colors.light,
                    font: RESUME_STYLES.fonts.main,
                  }),
                  PageNumber.TOTAL_PAGES,
                  new TextRun({
                    text: ` | Generated on ${generatedTimestamp}`,
                    size: RESUME_STYLES.fontSize.small * 2,
                    color: RESUME_STYLES.colors.light,
                    font: RESUME_STYLES.fonts.main,
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  return Packer.toBlob(doc);
}

// Helper functions
const sectionTitle = (title: string) =>
  new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_1,
    thematicBreak: true,
    spacing: { after: RESUME_STYLES.spacing.afterHeading },
    style: "Heading1",
    children: [
      new TextRun({
        text: title,
        bold: true,
        color: RESUME_STYLES.colors.accent,
        size: RESUME_STYLES.fontSize.heading * 2,
      }),
    ],
  });

const companyTitle = (company: string) =>
  new Paragraph({
    children: [
      new TextRun({
        text: company,
        bold: true,
        size: RESUME_STYLES.fontSize.normal * 2,
        font: RESUME_STYLES.fonts.main,
      }),
    ],
    spacing: { after: RESUME_STYLES.spacing.afterParagraph },
  });

const simpleText = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, size: RESUME_STYLES.fontSize.normal * 2, font: RESUME_STYLES.fonts.main })],
    spacing: { after: RESUME_STYLES.spacing.afterParagraph },
  });

const bulletPoint = (text: string) =>
  new Paragraph({
    children: [new TextRun({ text, size: RESUME_STYLES.fontSize.normal * 2, font: RESUME_STYLES.fonts.main })],
    bullet: { level: 0 },
    spacing: { after: RESUME_STYLES.spacing.afterParagraph },
  });
