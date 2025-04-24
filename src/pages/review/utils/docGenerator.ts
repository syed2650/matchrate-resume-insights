
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  ISectionOptions
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
  const doc = new Document({
    sections: [{
      children: []
    }]
  });
  
  // Get the first (and only) section
  const section = doc.sections[0];
  
  // Add name
  const name = currentResume.split('\n')[0].replace('#', '').trim();
  section.children.push(
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
    section.children.push(
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
    
    section.children.push(
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
        section.children.push(
          new Paragraph({
            children: [new TextRun(bulletText)],
            bullet: { level: 0 },
            spacing: { after: 120 }
          })
        );
      } else if (line.match(/^[A-Za-z ]+\s+\|\s+/)) {
        section.children.push(
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
        section.children.push(
          new Paragraph({
            text: line,
            spacing: { after: 120 }
          })
        );
      }
    });
    
    section.children.push(
      new Paragraph({ spacing: { after: 300 }})
    );
  });
  
  // Add footer
  section.children.push(
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

  return Packer.toBlob(doc);
};
