
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
  darkBlue: "000000", // Black for main text
  text: "222222",
  gray: "666666", // Gray for secondary text (dates, locations)
};

const FONT = {
  main: "Calibri",
};

const FONT_SIZE = {
  normal: 24, // 12pt (24 half-points)
  small: 22,  // 11pt (22 half-points)
  bullet: 24, // 12pt for bullets (24 half-points)
};

const SPACING = {
  sectionSpace: 200, // Space after sections
  headingAfter: 120, // Space after heading title
  betweenParagraphs: 20, // Space between bullet points
  betweenExperiences: 60, // Space between experience entries
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
          // Name - centered
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
                  size: FONT_SIZE.small,
                  font: FONT.main,
                  color: COLORS.gray,
                }),
                i < contactParts.length - 1 ? new TextRun({ text: " | ", size: FONT_SIZE.small, font: FONT.main, color: COLORS.gray }) : new TextRun({ text: "" })
              ]).flat(),
              alignment: AlignmentType.CENTER,
              spacing: { after: SPACING.sectionSpace },
            });
          })(),

          // Add a horizontal line separator
          new Table({
            width: { size: 100, type: "pct" },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
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
            spacing: { after: SPACING.sectionSpace / 2 },
          }),

          // SUMMARY - Section heading with border bottom instead of underline
          new Paragraph({
            children: [
              new TextRun({
                text: "SUMMARY",
                bold: true,
                color: COLORS.darkBlue,
                size: FONT_SIZE.normal,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: {
                color: "CCCCCC",
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
            spacing: { after: SPACING.headingAfter },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: data.summary.join(" "),
                font: FONT.main,
                size: FONT_SIZE.normal,
                bold: false,
              }),
            ],
            spacing: { after: SPACING.sectionSpace },
          }),

          // EXPERIENCE - Section heading with border bottom
          new Paragraph({
            children: [
              new TextRun({
                text: "EXPERIENCE",
                bold: true,
                color: COLORS.darkBlue,
                size: FONT_SIZE.normal,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: {
                color: "CCCCCC",
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
            spacing: { after: SPACING.headingAfter },
          }),

          ...data.experiences.flatMap((exp, expIndex) => [
            // Job title - Bold
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.title,
                  bold: true,
                  size: FONT_SIZE.normal,
                  font: FONT.main,
                }),
              ],
              spacing: { after: 20 }, // Reduced spacing
            }),
            
            // Company name - Bold
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  bold: true,
                  size: FONT_SIZE.normal,
                  font: FONT.main,
                }),
              ],
              spacing: { after: 20 }, // Reduced spacing
            }),
            
            // Dates - Not bold, gray color
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.dates,
                  bold: false, // Not bold
                  size: FONT_SIZE.small,
                  font: FONT.main,
                  color: COLORS.gray,
                }),
              ],
              spacing: { after: 20 }, // Reduced spacing
            }),
            
            // Location (if available) - Not bold, gray color
            ...(exp.location ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.location,
                    bold: false, // Not bold
                    size: FONT_SIZE.small,
                    font: FONT.main,
                    color: COLORS.gray,
                  }),
                ],
                spacing: { after: 40 }, // Reduced space before bullet points
              })
            ] : []),
            
            // Bullet points - Using manual bullet character, not bold
            ...exp.bullets.map((bullet) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: "• ", // Manual bullet character
                    size: FONT_SIZE.bullet,
                    font: FONT.main,
                    bold: false,
                  }),
                  new TextRun({
                    text: bullet,
                    size: FONT_SIZE.bullet, // Same font size for bullet content
                    font: FONT.main,
                    bold: false, // Explicitly not bold
                  }),
                ],
                indent: { left: 360 },
                spacing: { after: SPACING.betweenParagraphs, line: 240 }, // Reduced line spacing
              })
            ),
            
            // Add spacing between experiences (except after the last one)
            ...(expIndex < data.experiences.length - 1 ? [
              new Paragraph({ 
                spacing: { after: SPACING.betweenExperiences } // Reduced space between experiences
              })
            ] : []),
          ]),

          // KEY SKILLS - Section heading with border bottom
          new Paragraph({
            children: [
              new TextRun({
                text: "SKILLS",
                bold: true,
                color: COLORS.darkBlue,
                size: FONT_SIZE.normal,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: {
                color: "CCCCCC",
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.skills.map((skill) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: "• ", // Manual bullet character
                  size: FONT_SIZE.bullet,
                  font: FONT.main,
                  bold: false,
                }),
                new TextRun({
                  text: skill,
                  size: FONT_SIZE.bullet,
                  font: FONT.main,
                  bold: false, // Explicitly not bold
                }),
              ],
              indent: { left: 360 },
              spacing: { after: SPACING.betweenParagraphs, line: 240 }, // Reduced line spacing
            })
          ),
          new Paragraph({ spacing: { after: SPACING.sectionSpace } }),

          // EDUCATION - Section heading with border bottom
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                color: COLORS.darkBlue,
                size: FONT_SIZE.normal,
                font: FONT.main,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: {
                color: "CCCCCC",
                style: BorderStyle.SINGLE,
                size: 1,
              },
            },
            spacing: { after: SPACING.headingAfter },
          }),
          ...data.education.flatMap((edu) => {
            // Parse education entry
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
              // Degree - Bold
              new Paragraph({
                children: [
                  new TextRun({
                    text: degree,
                    bold: true,
                    size: FONT_SIZE.normal,
                    font: FONT.main,
                  }),
                ],
                spacing: { after: 20 }, // Reduced spacing
              }),
              // Institution
              new Paragraph({
                children: [
                  new TextRun({
                    text: institution,
                    size: FONT_SIZE.normal,
                    font: FONT.main,
                    bold: false,
                  }),
                ],
                spacing: { after: 20 }, // Reduced spacing
              }),
              // Country on next line
              country && new Paragraph({
                children: [
                  new TextRun({
                    text: country,
                    size: FONT_SIZE.normal,
                    font: FONT.main,
                    italics: true,
                    bold: false,
                  }),
                ],
                spacing: { after: 20 }, // Reduced spacing
              }),
              // Year on next line after country
              year && new Paragraph({
                children: [
                  new TextRun({
                    text: year,
                    bold: false, // Not bold
                    size: FONT_SIZE.normal,
                    font: FONT.main,
                  }),
                ],
                spacing: { after: SPACING.sectionSpace },
              }),
            ];
          }),

          // RECOGNITION (if available) - Section heading with border bottom
          ...(data.recognition && data.recognition.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "RECOGNITION",
                      bold: true,
                      color: COLORS.darkBlue,
                      size: FONT_SIZE.normal,
                      font: FONT.main,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  border: {
                    bottom: {
                      color: "CCCCCC",
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                  spacing: { after: SPACING.headingAfter },
                }),
                ...data.recognition.map((item) =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "• ", // Manual bullet character
                        size: FONT_SIZE.bullet,
                        font: FONT.main,
                        bold: false,
                      }),
                      new TextRun({
                        text: item,
                        size: FONT_SIZE.bullet,
                        font: FONT.main,
                        bold: false, // Explicitly not bold
                      }),
                    ],
                    indent: { left: 360 },
                    spacing: { after: SPACING.betweenParagraphs, line: 240 }, // Reduced line spacing
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
