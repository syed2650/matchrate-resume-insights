
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  convertInchesToTwip,
  BorderStyle,
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
  sectionSpace: 400, // space after each section
  headingAfter: 100, // space after heading before content
  betweenParagraphs: 100,
};

export const generateDocument = async (resumeData: ResumeData) => {
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
          // Name (Header)
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.name,
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
                text: resumeData.contact,
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
                text: Array.isArray(resumeData.summary) ? resumeData.summary.join(" ") : resumeData.summary,
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

          ...resumeData.experiences.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.title} | ${exp.company}`,
                  bold: true,
                  font: FONT.main,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.dates,
                  bold: true,
                  font: FONT.main,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 100 },
            }),
            ...exp.bullets.map(
              (b) =>
                new Paragraph({
                  text: b,
                  bullet: { level: 0 },
                  spacing: { after: SPACING.betweenParagraphs },
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
          ...(resumeData.skills || []).map((skill) =>
            new Paragraph({
              text: skill,
              bullet: { level: 0 },
              spacing: { after: SPACING.betweenParagraphs },
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
          ...(resumeData.education || []).map((edu) =>
            new Paragraph({
              text: edu,
              bullet: { level: 0 },
              spacing: { after: SPACING.betweenParagraphs },
            })
          ),
        ],
      },
    ],
  });

  return Packer.toBlob(doc);
};
