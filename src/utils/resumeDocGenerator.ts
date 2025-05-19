
import { Document, Paragraph, TextRun, AlignmentType, Packer } from "docx";
import { ResumeTemplate, ResumeData } from "./resumeRewriter";

/**
 * Generate a formatted DOCX document from resume content using the specified template
 * @param resumeContent Resume content as text
 * @param template Template to use for formatting
 * @returns Blob containing the DOCX document
 */
export const generateFormattedDocx = async (resumeContent: string, template: ResumeTemplate): Promise<Blob | null> => {
  try {
    // Parse resume content to structured format
    const parsedResume = parseResumeContent(resumeContent);
    
    // Generate the document using the right template
    const doc = generateResumeDocx(parsedResume, template);
    
    // Convert document to blob
    const blob = await docToBlob(doc);
    return blob;
  } catch (error) {
    console.error("Error generating document:", error);
    return null;
  }
};

/**
 * Generate a DOCX document from parsed resume data using the specified template
 * @param resumeData Parsed resume data
 * @param template Template to use
 * @returns DOCX Document object
 */
const generateResumeDocx = (resumeData: ResumeData, template: ResumeTemplate): Document => {
  // Create basic document with proper styles
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with name
        new Paragraph({
          text: resumeData.header.name || "Your Name",
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200,
          },
          children: [
            new TextRun({
              text: resumeData.header.name || "Your Name",
              bold: true,
              size: 36, // 18pt
            }),
          ],
        }),
        
        // Contact info
        new Paragraph({
          text: resumeData.contact || "",
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400,
          },
        }),
        
        // Summary section
        new Paragraph({
          text: "SUMMARY",
          spacing: {
            before: 200,
            after: 80,
          },
          children: [
            new TextRun({
              text: "SUMMARY",
              bold: true,
              size: 28, // 14pt
            }),
          ],
        }),
        new Paragraph({
          text: resumeData.summary || "",
          spacing: {
            after: 200,
          },
        }),
        
        // More sections could be added here...
      ],
    }],
  });
  
  return doc;
};

/**
 * Convert a DOCX Document to a Blob for download
 * @param doc DOCX Document
 * @returns Blob
 */
const docToBlob = async (doc: Document): Promise<Blob> => {
  return await Packer.toBlob(doc);
};

/**
 * Parse resume content into structured sections
 * @param content Resume content as text
 * @returns Parsed resume data
 */
const parseResumeContent = (content: string): ResumeData => {
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
  
  const parsedData: ResumeData = {
    header: {
      name: '',
      contact: {
        email: '',
        phone: '',
        location: ''
      }
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  };
  
  // Basic parsing - extract name from first line
  if (lines.length > 0) {
    parsedData.header.name = lines[0];
    
    // Get contact info (typically line 2)
    if (lines.length > 1) {
      const contactLine = lines[1];
      // Extract email
      const emailMatch = contactLine.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        parsedData.header.contact.email = emailMatch[0];
      }
      
      // Extract phone
      const phoneMatch = contactLine.match(/\+?[\d-\s()]{10,}/);
      if (phoneMatch) {
        parsedData.header.contact.phone = phoneMatch[0];
      }
      
      // Extract location (anything remaining)
      let location = contactLine
        .replace(parsedData.header.contact.email, '')
        .replace(parsedData.header.contact.phone, '')
        .replace(/[|,]\s*/g, '')
        .trim();
      
      parsedData.header.contact.location = location;
    }
  }
  
  // Find summary section
  let currentSection = '';
  let sectionContent: string[] = [];
  
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section headers
    if (line.toUpperCase() === line && line.length > 3) {
      // Save previous section
      if (currentSection === 'SUMMARY') {
        parsedData.summary = sectionContent.join('\n');
      } else if (currentSection === 'EXPERIENCE') {
        parsedData.experience = processExperienceSection(sectionContent);
      } else if (currentSection === 'EDUCATION') {
        parsedData.education = processEducationSection(sectionContent);
      } else if (currentSection === 'SKILLS') {
        parsedData.skills = sectionContent.map((skill, index) => ({
          name: skill,
          level: Math.max(60, Math.min(95, 95 - index * 3)) // Assign higher proficiency to earlier skills
        }));
      }
      
      // Start new section
      currentSection = line;
      sectionContent = [];
    } else {
      // Add to current section
      sectionContent.push(line);
    }
  }
  
  // Process the last section
  if (currentSection === 'SUMMARY') {
    parsedData.summary = sectionContent.join('\n');
  } else if (currentSection === 'EXPERIENCE') {
    parsedData.experience = processExperienceSection(sectionContent);
  } else if (currentSection === 'EDUCATION') {
    parsedData.education = processEducationSection(sectionContent);
  } else if (currentSection === 'SKILLS') {
    parsedData.skills = sectionContent.map((skill, index) => ({
      name: skill,
      level: Math.max(60, Math.min(95, 95 - index * 3))
    }));
  }
  
  return parsedData;
};

/**
 * Process experience section content into structured format
 * @param lines Lines of text from experience section
 * @returns Structured experience data
 */
const processExperienceSection = (lines: string[]): any[] => {
  // Very basic processing - in real implementation, this would parse job entries
  return [{
    title: 'Job Title',
    company: 'Company Name',
    dates: '2020 - Present',
    description: lines.join('\n')
  }];
};

/**
 * Process education section content into structured format
 * @param lines Lines of text from education section
 * @returns Structured education data
 */
const processEducationSection = (lines: string[]): any[] => {
  // Very basic processing - in real implementation, this would parse education entries
  return [{
    degree: 'Degree Name',
    institution: 'Institution Name',
    dates: '2016 - 2020',
    description: lines.join('\n')
  }];
};

/**
 * Format contact string for display in document
 * @param contactData Contact data object
 * @returns Formatted contact string
 */
export const formatContactString = (contactData: { email?: string; phone?: string; location?: string }): string => {
  const parts = [];
  if (contactData.email) parts.push(contactData.email);
  if (contactData.phone) parts.push(contactData.phone);
  if (contactData.location) parts.push(contactData.location);
  return parts.join(' | ');
};
