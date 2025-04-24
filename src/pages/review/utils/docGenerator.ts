
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer
} from "docx";

interface Section {
  [key: string]: string[];
}

export const parseResumeContent = (content: string) => {
  const sections: Section = {};
  let currentSection = "header";
  sections[currentSection] = [];
  
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.match(/^#{1,2}\s+/) || line.match(/^[A-Z\s]{5,}$/)) {
      currentSection = line.replace(/^#{1,2}\s+/, '').trim();
      sections[currentSection] = [];
    } else if (line.trim()) {
      sections[currentSection].push(line);
    }
  });
  
  return sections;
};

export const generateDocument = async (
  currentResume: string,
  roleSummary: string,
  currentAtsScore: number,
  generatedTimestamp: string,
  activeVersion: string,
  hasMultipleVersions: boolean
) => {
  const sections = parseResumeContent(currentResume);
  const paragraphs = [];
  
  // Add name
  const name = currentResume.split('\n')[0].replace('#', '').trim();
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: 28,
        })
      ],
      spacing: { after: 200 }
    })
  );
  
  // Add role summary if available
  if (roleSummary) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Tailored for: ${roleSummary}`,
            italics: true,
            size: 22,
          })
        ],
        spacing: { after: 300 }
      })
    );
  }

  // Add all resume sections
  Object.keys(sections).forEach(sectionName => {
    if (sectionName === 'header') return;
    
    paragraphs.push(
      new Paragraph({
        text: sectionName.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { after: 200 }
      })
    );
    
    sections[sectionName].forEach(line => {
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletText = line.replace(/^[*-]\s/, '');
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(bulletText)],
            bullet: { level: 0 },
            spacing: { after: 120 }
          })
        );
      } else if (line.match(/^[A-Za-z ]+\s+\|\s+/)) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: true
              })
            ],
            spacing: { after: 120 }
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            text: line,
            spacing: { after: 120 }
          })
        );
      }
    });
    
    paragraphs.push(
      new Paragraph({ spacing: { after: 300 }})
    );
  });
  
  // Add footer
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `ATS Score: ${currentAtsScore}/100 - Generated on ${generatedTimestamp}`,
          size: 16,
          color: "666666",
        })
      ],
      spacing: { before: 300 }
    })
  );

  // Create the document with all paragraphs
  const doc = new Document({
    sections: [
      {
        children: paragraphs
      }
    ]
  });

  return Packer.toBlob(doc);
};
