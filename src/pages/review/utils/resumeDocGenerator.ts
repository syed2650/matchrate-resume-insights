
import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  BorderStyle, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  AlignmentType,
  UnderlineType,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  PageBreak,
  ShadingType,
  ExternalHyperlink,
  IStylesOptions,
  IRunOptions
} from 'docx';
import { ResumeTemplate } from '@/utils/resumeRewriter';

// Define a simple ResumeData interface for this file
interface ResumeData {
  header: {
    name: string;
    contact: {
      email: string;
      phone: string;
      location: string;
    }
  };
  summary: string;
  experience: Array<{
    position?: string;
    company?: string;
    date?: string;
    bullets?: string[];
  }>;
  education: Array<{
    degree?: string;
    institution?: string;
    date?: string;
    details?: string[];
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  achievements?: string[];
}

/**
 * Generate a DOCX document from resume data using the specified template
 * @param resumeData Resume data
 * @param template Template to use
 * @returns DOCX Document object
 */
export const generateResumeDocx = (resumeData: ResumeData, template: ResumeTemplate): Document => {
  // Define document properties
  const documentProperties = {
    title: `${resumeData.header.name} - Resume`,
    creator: "MatchRate Resume Builder",
    description: "Professional resume created with MatchRate",
    lastModifiedBy: "MatchRate",
  };

  // Select template-specific generator
  switch (template.id) {
    case 'modern':
      return generateModernDocx(resumeData, template, documentProperties);
    case 'professional':
      return generateProfessionalDocx(resumeData, template, documentProperties);
    case 'creative':
      return generateCreativeDocx(resumeData, template, documentProperties);
    default:
      return generateModernDocx(resumeData, template, documentProperties);
  }
};

/**
 * Generate a Modern template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateModernDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: any
): Document {
  // Set primary and secondary colors from template
  const primaryColor = template.primaryColor.replace('#', '');
  const secondaryColor = template.secondaryColor.replace('#', '');
  
  // Document styles
  const styles: IStylesOptions = {
    paragraphStyles: [
      {
        id: 'Normal',
        name: 'Normal',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 120
          }
        }
      },
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 36,
          bold: true,
          color: 'FFFFFF'
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200,
          },
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 28,
          bold: true,
          color: primaryColor,
          allCaps: template.sectionTitleCase === 'uppercase',
        },
        paragraph: {
          spacing: {
            before: 240,
            after: 120,
          },
          border: {
            bottom: {
              color: primaryColor,
              style: BorderStyle.SINGLE,
              size: 1,
            },
          },
        },
      },
      {
        id: 'JobTitle',
        name: 'Job Title',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 24,
          bold: true,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 60,
          },
        },
      },
      {
        id: 'JobCompany',
        name: 'Job Company',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          italics: true, // Fixed from italic to italics
          color: '444444'
        },
        paragraph: {
          spacing: {
            after: 60,
          },
        },
      },
      {
        id: 'BulletList',
        name: 'Bullet List',
        basedOn: 'Normal',
        quickFormat: true,
        run: {
          font: template.fontFamily.replace(/'/g, '').split(',')[0].trim(),
          size: 22,
          color: '333333'
        },
        paragraph: {
          spacing: {
            after: 80,
          },
          numbering: {
            reference: 'bulletList',
            level: 0,
          }
        },
      },
    ],
  };

  // Create the document with proper sections
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    styles,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Create a simple header with the name
          new Paragraph({
            text: resumeData.header.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          // Basic resume sections
          new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: resumeData.summary }),
          
          // Experience section
          new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
          
          // Add experience entries
          ...resumeData.experience.flatMap(job => [
            new Paragraph({ 
              text: job.position || '', 
              style: "JobTitle" 
            }),
            new Paragraph({ 
              text: `${job.company || ''} | ${job.date || ''}`,
              style: "JobCompany"
            }),
            ...(job.bullets || []).map(bullet => 
              new Paragraph({
                text: bullet,
                style: "BulletList"
              })
            )
          ]),
          
          // Education section
          new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
          
          // Add education entries
          ...resumeData.education.flatMap(edu => [
            new Paragraph({ 
              text: edu.degree || '', 
              style: "JobTitle"
            }),
            new Paragraph({ 
              text: `${edu.institution || ''} | ${edu.date || ''}`,
              style: "JobCompany"
            }),
            ...(edu.details || []).map(detail => 
              new Paragraph({
                text: detail,
                style: "BulletList"
              })
            )
          ]),
          
          // Skills section
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            text: resumeData.skills.map(skill => skill.name).join(' • ')
          })
        ]
      }
    ],
  });
  
  return document;
}

/**
 * Generate a Professional template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateProfessionalDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: any
): Document {
  // Simplified implementation for Professional template
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Add simple header
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.header.name,
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          // Basic contact info
          new Paragraph({
            text: formatContactString(resumeData),
            alignment: AlignmentType.CENTER,
          })
        ]
      }
    ],
  });
  
  return document;
}

/**
 * Generate a Creative template DOCX document
 * @param resumeData Resume data
 * @param template Template configuration
 * @param properties Document properties
 * @returns DOCX Document object
 */
function generateCreativeDocx(
  resumeData: ResumeData, 
  template: ResumeTemplate, 
  properties: any
): Document {
  // Simplified implementation for Creative template
  const document = new Document({
    creator: properties.creator,
    title: properties.title,
    description: properties.description,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Add simple header
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.header.name,
                bold: true,
                size: 36,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          
          // Basic contact info
          new Paragraph({
            text: formatContactString(resumeData),
            alignment: AlignmentType.CENTER,
          })
        ]
      }
    ],
  });
  
  return document;
}

/**
 * Format contact information as a string
 * @param resumeData Resume data
 * @returns Formatted contact string
 */
function formatContactString(resumeData: ResumeData): string {
  const contactParts = [];
  
  if (resumeData.header.contact.location) {
    contactParts.push(resumeData.header.contact.location);
  }
  
  if (resumeData.header.contact.phone) {
    contactParts.push(resumeData.header.contact.phone);
  }
  
  if (resumeData.header.contact.email) {
    contactParts.push(resumeData.header.contact.email);
  }
  
  return contactParts.join(' | ');
}

export default generateResumeDocx;
