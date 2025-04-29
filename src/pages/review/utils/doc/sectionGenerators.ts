
import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  UnderlineType,
} from "docx";
import type { ResumeData } from "../resume/types";
import { COLORS, FONTS, SPACING, TEXT_SIZE, BORDERS } from "./constants";

/**
 * Generate the header section with name and contact info
 */
export function generateHeaderSection(data: ResumeData): Paragraph[] {
  return [
    // Name
    new Paragraph({
      children: [
        new TextRun({
          text: data.name.toUpperCase(),
          bold: true,
          size: TEXT_SIZE.name,
          color: COLORS.darkBlue,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    }),

    // Contact Info
    new Paragraph({
      children: [
        new TextRun({
          text: data.contact,
          size: TEXT_SIZE.contact,
          color: COLORS.darkBlue,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: SPACING.sectionSpace },
    }),

    // Separator line
    new Paragraph({
      children: [
        new TextRun({
          text: "______________________________________________________________________________________________",
          color: COLORS.darkBlue,
          size: TEXT_SIZE.contact,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: SPACING.sectionSpace },
    }),
  ];
}

/**
 * Generate the summary section
 */
export function generateSummarySection(data: ResumeData): Paragraph[] {
  return [
    // SUMMARY heading
    new Paragraph({
      children: [
        new TextRun({
          text: "SUMMARY",
          bold: true,
          color: COLORS.darkBlue,
          size: TEXT_SIZE.heading,
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: SPACING.headingAfter },
    }),

    // Summary text
    new Paragraph({
      children: [
        new TextRun({
          text: data.summary.join(" "),
          size: TEXT_SIZE.normal,
          color: COLORS.text,
        }),
      ],
      spacing: { after: SPACING.sectionSpace },
    }),
  ];
}

/**
 * Generate a single experience entry
 */
export function generateExperienceEntry(exp: ResumeData["experiences"][0]): (Paragraph | Table)[] {
  return [
    // Title and company in left, dates in right using a table
    new Table({
      width: { size: 100, type: "pct" },
      borders: BORDERS.none,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.title} | ${exp.company}`,
                      bold: true,
                      size: TEXT_SIZE.normal,
                      color: COLORS.text,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: exp.dates,
                      size: TEXT_SIZE.normal,
                      color: COLORS.text,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Bullet points
    ...exp.bullets.map(
      (bullet) =>
        new Paragraph({
          children: [
            new TextRun({
              text: "• ",
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
            new TextRun({
              text: bullet,
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
          ],
          indent: { left: 360 },
          spacing: { after: SPACING.betweenParagraphs, line: 360 },
        })
    ),

    // Space after the experience entry
    new Paragraph({ spacing: { after: SPACING.betweenParagraphs } }),
  ];
}

/**
 * Generate the experience section
 */
export function generateExperienceSection(data: ResumeData): (Paragraph | Table)[] {
  return [
    // PROFESSIONAL EXPERIENCE heading
    new Paragraph({
      children: [
        new TextRun({
          text: "PROFESSIONAL EXPERIENCE",
          bold: true,
          color: COLORS.darkBlue,
          size: TEXT_SIZE.heading,
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: SPACING.headingAfter },
    }),

    // Experience entries
    ...data.experiences.flatMap((exp) => generateExperienceEntry(exp)),
  ];
}

/**
 * Generate the skills section
 */
export function generateSkillsSection(data: ResumeData): Paragraph[] {
  return [
    // KEY SKILLS heading
    new Paragraph({
      children: [
        new TextRun({
          text: "KEY SKILLS",
          bold: true,
          color: COLORS.darkBlue,
          size: TEXT_SIZE.heading,
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: SPACING.headingAfter },
    }),

    // Skills bullets
    ...data.skills.map(
      (skill) =>
        new Paragraph({
          children: [
            new TextRun({
              text: "• ",
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
            new TextRun({
              text: skill,
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
          ],
          indent: { left: 360 },
          spacing: { after: SPACING.betweenParagraphs, line: 360 },
        })
    ),

    // Space after the skills section
    new Paragraph({ spacing: { after: SPACING.sectionSpace } }),
  ];
}

/**
 * Generate the education section
 */
export function generateEducationSection(data: ResumeData): Paragraph[] {
  return [
    // EDUCATION heading
    new Paragraph({
      children: [
        new TextRun({
          text: "EDUCATION",
          bold: true,
          color: COLORS.darkBlue,
          size: TEXT_SIZE.heading,
          underline: {
            type: UnderlineType.SINGLE,
          },
        }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { after: SPACING.headingAfter },
    }),

    // Education entries
    ...data.education.map(
      (edu) =>
        new Paragraph({
          children: [
            new TextRun({
              text: "• ",
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
            new TextRun({
              text: edu,
              size: TEXT_SIZE.normal,
              color: COLORS.text,
            }),
          ],
          indent: { left: 360 },
          spacing: { after: SPACING.betweenParagraphs, line: 360 },
        })
    ),
  ];
}
