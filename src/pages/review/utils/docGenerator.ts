
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

          // Contact Info - centered below name
          (() => {
            // Parse contact information (expecting phone, email, location, etc.)
            const contactParts = data.contact.split('|').map(part => part.trim());
            return new Paragraph({
              children: contactParts.map((part, i) => [
                new TextRun({
                  text: part,
                  size: 20,
                  font: FONT.main,
                }),
                i < contactParts.length - 1 ? new TextRun({ text: " | ", size: 20, font: FONT.main }) : new TextRun({ text: "" })
              ]).flat(),
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.sectionSpace },
            });
          })(),

          // Add a horizontal line separator
          new Table({
            width: { size: 100, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [new TableRow({
              children: [new TableCell({
                children: [new Paragraph({ spacing: { after: 0 } })],
              })],
            })],
          }),

          // Space after horizontal line
          new Paragraph({
            spacing: { after: SPACING.sectionSpace },
          }),

          // SUMMARY - Bold heading
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

          // PROFESSIONAL EXPERIENCE - Bold heading
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
            // Company and role in left, dates in extreme right
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
                              text: exp.company, // Just company name without location
                              bold: true, // Make company name bold
                              size: 22,
                              font: FONT.main,
                            }),
                          ],
                        }),
                      ],
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: exp.dates,
                              bold: true, // Make dates bold
                              size: 22,
                              font: FONT.main,
                            }),
                          ],
                        }),
                      ],
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                  ],
                }),
                // Job title in a separate row
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: exp.title,
                              bold: true, // Make job title bold
                              size: 22,
                              font: FONT.main,
                            }),
                          ],
                          spacing: { after: 80 },
                        }),
                      ],
                      columnSpan: 2,
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
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

          // KEY SKILLS - Bold heading
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

          // EDUCATION - Bold heading
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
          ...data.education.map((edu) => {
            // Parse education entry to extract degree, institution, country, and year
            const parts = edu.split('|');
            const degree = parts[0] ? parts[0].trim() : '';
            
            // Extract institution and additional info
            let institution = '';
            let country = '';
            let year = '';
            
            if (parts.length > 1) {
              const institutionParts = parts[1].trim().split('•');
              institution = institutionParts[0] ? institutionParts[0].trim() : '';
              
              if (institutionParts.length > 1) {
                const locationParts = institutionParts[1].trim().split('–');
                country = locationParts[0] ? locationParts[0].trim() : '';
                year = locationParts.length > 1 ? locationParts[1].trim() : '';
              }
            }
            
            return [
              // Degree and Institution
              new Paragraph({
                children: [
                  new TextRun({
                    text: degree,
                    bold: true,
                    size: 22,
                    font: FONT.main,
                  }),
                ],
                spacing: { after: 80 },
              }),
              // Institution
              new Paragraph({
                children: [
                  new TextRun({
                    text: institution,
                    size: 22,
                    font: FONT.main,
                  }),
                ],
                spacing: { after: 80 },
              }),
              // Country on next line
              country && new Paragraph({
                children: [
                  new TextRun({
                    text: country,
                    size: 22,
                    font: FONT.main,
                    italics: true,
                  }),
                ],
                spacing: { after: 80 },
              }),
              // Year on next line
              year && new Paragraph({
                children: [
                  new TextRun({
                    text: year,
                    bold: true,
                    size: 22,
                    font: FONT.main,
                  }),
                ],
                spacing: { after: SPACING.sectionSpace },
              }),
            ];
          }).flat(),

          // RECOGNITION (if available) - Bold heading
          ...(data.recognition && data.recognition.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "RECOGNITION",
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
                ...data.recognition.map((item) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "• ",
                        size: 22,
                        font: FONT.main,
                      }),
                      new TextRun({
                        text: item,
                        size: 22,
                        font: FONT.main,
                      }),
                    ],
                    indent: { left: 360 },
                    spacing: { after: SPACING.betweenParagraphs, line: 360 },
                  })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
