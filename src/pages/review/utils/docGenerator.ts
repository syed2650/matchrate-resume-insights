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

const FONT_MAIN = "Calibri";

const COLORS = {
  dark: "1E293B", // Dark blue (same as tealhq)
  light: "666666",
  accent: "2563eb",
};

const FONT_SIZES = {
  heading: 32,
  subheading: 24,
  normal: 22,
  small: 18,
};

export async function generateDocument(
  resumeText: string,
  roleSummary: string,
  atsScore: number,
  generatedTimestamp: string
) {
  const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);

  const children: Paragraph[] = [];

  // 1. Name (First line)
  const name = lines.shift() || "Candidate";
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: name, bold: true, size: FONT_SIZES.heading, font: FONT_MAIN }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // 2. Contact Info (Second line)
  if (lines.length > 0) {
    const contact = lines.shift();
    if (contact) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: contact, size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );
    }
  }

  // 3. Role Summary
  if (roleSummary) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: roleSummary, italics: true, color: COLORS.accent, size: FONT_SIZES.subheading, font: FONT_MAIN }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // 4. Rest of Resume (Dynamic Parsing)
  lines.forEach((line) => {
    if (line.toUpperCase() === line && line.length > 4) {
      // Section Header
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: line, bold: true, color: COLORS.dark, size: FONT_SIZES.subheading, font: FONT_MAIN }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200 },
          border: { bottom: { color: COLORS.light, style: BorderStyle.SINGLE, size: 4 } },
        })
      );
    } else if (line.startsWith("•") || line.startsWith("-")) {
      // Bullet Point
      const bullet = line.replace(/^[-•]\s*/, "");
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: bullet, font: FONT_MAIN, size: FONT_SIZES.normal }),
          ],
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
    } else {
      // Normal paragraph
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: line, font: FONT_MAIN, size: FONT_SIZES.normal }),
          ],
          spacing: { after: 150 },
        })
      );
    }
  });

  // 5. Footer with ATS score and Page numbering
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `ATS Score: ${atsScore}/100 | `, size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
          new TextRun({ children: [PageNumber.CURRENT], size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
          new TextRun({ text: " of ", size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
          new TextRun({ text: ` | Generated on ${generatedTimestamp}`, size: FONT_SIZES.small, font: FONT_MAIN, color: COLORS.light }),
        ],
      }),
    ],
  });

  // 6. Build and return
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
            },
          },
        },
        footers: { default: footer },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}
