
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
  WidthType,
  BorderStyle,
} from "docx";

import { ResumeData } from "./parseResumeIntoData";

const COLORS = {
  darkBlue: "000000", // Changed to black for better professional look
  text: "222222",
};

const FONT = {
  main: "Calibri",
};

const SPACING = {
  sectionSpace: 300, // Space after sections
  headingAfter: 120, // Space after heading title
  betweenParagraphs: 100, // Space between bullet points
};

export const generateDocument = async (data: ResumeData) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.7),
            },
          },
        },
        children: [
          // Name
          new Paragraph({
            children: [
              new TextRun({
                text: data.name.toUpperCase(),
                bold: true,
                size: 28,
                font: FONT.main,
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
                size: 20,
                font: FONT.main,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: SPACING.sectionSpace },
          }),

          // Add a horizontal line separator
          new Paragraph({
            children: [
              new TextRun({
                text: "______________________________________________________________________________________________",
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
                size: 22,
                font: FONT.main,
                underline: {},
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
                size: 22,
                font: FONT.main,
                underline: {},
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),

          ...data.experiences.flatMap((exp) => [
            // Title and company in left, dates in right using a table
            new Table({
              width: { size: 100, type: "pct" },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
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
                              size: 22,
                              font: FONT.main,
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
            ...exp.bullets.map((bullet) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: "• ",
                    size: 22,
                    font: FONT.main,
                  }),
                  new TextRun({
                    text: bullet,
                    size: 22,
                    font: FONT.main,
                  }),
                ],
                indent: { left: 360 },
                spacing: { after: SPACING.betweenParagraphs, line: 360 },
              })
            ),
            new Paragraph({ spacing: { after: SPACING.betweenParagraphs } }),
          ]),

          // KEY SKILLS
          new Paragraph({
            children: [
              new TextRun({
                text: "KEY SKILLS",
                bold: true,
                color: COLORS.darkBlue,
                size: 22,
                font: FONT.main,
                underline: {},
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.skills.map((skill) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ",
                  size: 22,
                  font: FONT.main,
                }),
                new TextRun({
                  text: skill,
                  size: 22,
                  font: FONT.main,
                }),
              ],
              indent: { left: 360 },
              spacing: { after: SPACING.betweenParagraphs, line: 360 },
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
                size: 22,
                font: FONT.main,
                underline: {},
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.education.map((edu) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ",
                  size: 22,
                  font: FONT.main,
                }),
                new TextRun({
                  text: edu,
                  size: 22,
                  font: FONT.main,
                }),
              ],
              indent: { left: 360 },
              spacing: { after: SPACING.betweenParagraphs, line: 360 },
            })
          ),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
