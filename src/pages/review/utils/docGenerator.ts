import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
} from "docx";

import { ResumeData } from "./parseResumeIntoData";

const COLORS = {
  darkBlue: "1E3A8A",
  text: "222222",
};

const FONT = {
  main: "Calibri",
};

const SPACING = {
  sectionSpace: 400, // Space after sections
  headingAfter: 100, // Space after heading title
  betweenParagraphs: 120, // Space between bullet points
};

export const generateDocument = async (data: ResumeData) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.7),
            },
          },
        },
        children: [
          // Name
          new Paragraph({
            children: [
              new TextRun({
                text: data.name,
                bold: true,
                size: 32,
                font: FONT.main,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),

          // Contact Info
          new Paragraph({
            children: [
              new TextRun({
                text: data.contact,
                size: 20,
                font: FONT.main,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: SPACING.sectionSpace },
          }),

          // SUMMARY
          new Paragraph({
            children: [
              new TextRun({
                text: "SUMMARY",
                bold: true,
                color: COLORS.darkBlue,
                size: 24,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.summary.join(" "),
                font: FONT.main,
                size: 22,
              }),
            ],
            spacing: { after: SPACING.sectionSpace },
          }),

          // PROFESSIONAL EXPERIENCE
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL EXPERIENCE",
                bold: true,
                color: COLORS.darkBlue,
                size: 24,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),

          ...data.experiences.flatMap((exp) => [
            // Table Row for Job Title + Company and Dates
            new Table({
              width: { size: 100, type: "pct" },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${exp.title} | ${exp.company}`,
                              bold: true,
                              size: 22,
                              font: FONT.main,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: exp.dates,
                              bold: true,
                              size: 22,
                              font: FONT.main,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            // Bullets
            ...exp.bullets.map((bullet) =>
              new Paragraph({
                text: bullet,
                bullet: { level: 0 },
                spacing: { after: SPACING.betweenParagraphs },
                font: FONT.main,
              })
            ),
            new Paragraph({ spacing: { after: SPACING.sectionSpace } }),
          ]),

          // KEY SKILLS
          new Paragraph({
            children: [
              new TextRun({
                text: "KEY SKILLS",
                bold: true,
                color: COLORS.darkBlue,
                size: 24,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.skills.map((skill) =>
            new Paragraph({
              text: skill,
              bullet: { level: 0 },
              spacing: { after: SPACING.betweenParagraphs },
              font: FONT.main,
            })
          ),
          new Paragraph({ spacing: { after: SPACING.sectionSpace } }),

          // EDUCATION
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                color: COLORS.darkBlue,
                size: 24,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.education.map((edu) =>
            new Paragraph({
              text: edu,
              bullet: { level: 0 },
              spacing: { after: SPACING.betweenParagraphs },
              font: FONT.main,
            })
          ),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
