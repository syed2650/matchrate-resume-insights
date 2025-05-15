
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } from "docx";

type ResumeTheme = "teal" | "modern" | "minimal";

export async function generateFormattedDocx(resumeText: string, theme: ResumeTheme = "modern"): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== "string") return null;

    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }
          },
        },
        children: createThemeLayout(resumeText, theme)
      }]
    });

    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
}

function createThemeLayout(content: string, theme: ResumeTheme) {
  const lines = content.split("\n").filter(line => line.trim().length > 0);
  const paragraphs: Paragraph[] = [];

  // Sample name and contact info
  if (lines.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: lines[0],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      })
    );

    if (lines.length > 1) {
      paragraphs.push(new Paragraph({
        text: lines[1],
        alignment: AlignmentType.CENTER
      }));
    }
  }

  const sectionTitles = ["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS"];
  let currentSection = "";

  lines.slice(2).forEach(line => {
    if (sectionTitles.includes(line.toUpperCase())) {
      currentSection = line.toUpperCase();
      paragraphs.push(new Paragraph({
        text: currentSection,
        heading: HeadingLevel.HEADING_2
      }));
    } else if (line.startsWith("•") || line.startsWith("-")) {
      paragraphs.push(new Paragraph({
        text: line.replace(/^[-•]\s*/, ""),
        bullet: { level: 0 }
      }));
    } else {
      paragraphs.push(new Paragraph({ text: line }));
    }
  });

  return paragraphs;
}
