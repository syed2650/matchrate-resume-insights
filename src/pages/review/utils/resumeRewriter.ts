
import { ResumeTemplate } from '@/utils/resumeRewriter';

// Re-export the resume templates
export { resumeTemplates } from '@/utils/resumeRewriter';

/**
 * Enhanced Resume Data interface - used for template implementation
 */
export interface ResumeData {
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
  projects?: Array<{
    name?: string;
    description?: string;
    bullets?: string[];
  }>;
  certifications?: string[];
  achievements?: string[];
}

/**
 * Parse resume content into structured data for templates
 * @param resumeContent Raw resume text
 * @returns Structured resume data
 */
export function parseResumeContent(resumeContent: string): ResumeData {
  // Basic implementation to parse resume text
  const lines = resumeContent.split('\n').filter(line => line.trim().length > 0);
  
  // Extract name and contact info from the first lines
  const name = lines.length > 0 ? lines[0] : 'John Doe';
  
  // Extract contact info (typically in the second line)
  const contactLine = lines.length > 1 ? lines[1] : '';
  const email = contactLine.match(/[\w.-]+@[\w.-]+\.\w+/) ? 
    contactLine.match(/[\w.-]+@[\w.-]+\.\w+/)![0] : '';
  const phone = contactLine.match(/\+?[\d-\s()]{10,}/) ? 
    contactLine.match(/\+?[\d-\s()]{10,}/)![0] : '';
  
  // Everything else is the location
  const location = contactLine
    .replace(email, '')
    .replace(phone, '')
    .replace(/[|,]\s*/g, '')
    .trim();
  
  // Find sections
  let currentSection = '';
  let sectionContent: string[] = [];
  const sections: Record<string, string[]> = {};
  
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a section header (all caps, at least 4 chars)
    if (line === line.toUpperCase() && line.length > 3 && !/\d/.test(line)) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = sectionContent;
      }
      
      // Start new section
      currentSection = line;
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }
  
  // Save the last section
  if (currentSection) {
    sections[currentSection] = sectionContent;
  }
  
  // Extract summary
  const summary = sections['SUMMARY'] ? sections['SUMMARY'].join(' ') : 
    'Professional with experience in the industry.';
  
  // Parse experience
  const experience = parseExperience(sections['EXPERIENCE'] || []);
  
  // Parse education
  const education = parseEducation(sections['EDUCATION'] || []);
  
  // Parse skills
  const skills = parseSkills(sections['SKILLS'] || []);
  
  return {
    header: {
      name,
      contact: {
        email,
        phone,
        location
      }
    },
    summary,
    experience,
    education,
    skills,
    achievements: sections['ACHIEVEMENTS'] || []
  };
}

/**
 * Parse experience section into structured format
 */
function parseExperience(lines: string[]): ResumeData['experience'] {
  if (lines.length === 0) return [];
  
  const experience: ResumeData['experience'] = [];
  let currentJob: {
    position?: string;
    company?: string;
    date?: string;
    bullets: string[];
  } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a new job entry (contains company and date)
    const isJobHeader = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/.test(line) ||
      /\b\d{4}\s*(-|–|—)\s*(?:\d{4}|Present)\b/i.test(line);
    
    if (isJobHeader) {
      // Save previous job if exists
      if (currentJob) {
        experience.push(currentJob);
      }
      
      // Start new job
      const dateMatch = line.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*(-|–|—)\s*(?:\w+\s+\d{4}|Present)\b/i) ||
        line.match(/\b\d{4}\s*(-|–|—)\s*(?:\d{4}|Present)\b/i);
      
      const date = dateMatch ? dateMatch[0] : '';
      
      // What remains should be company and position
      let remaining = line.replace(date, '').trim();
      remaining = remaining.replace(/[,|]/, '');
      
      // Try to split company and position
      const parts = remaining.split(/\s+[-|]\s+|,\s+/);
      
      currentJob = {
        position: parts.length > 1 ? parts[0] : '',
        company: parts.length > 1 ? parts[1] : parts[0],
        date,
        bullets: []
      };
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
      // This is a bullet point
      if (currentJob) {
        currentJob.bullets.push(line.replace(/^[•\-*]\s*|^\d+\.\s*/, ''));
      }
    } else if (currentJob && !currentJob.position && line) {
      // This might be the position if it wasn't in the header
      currentJob.position = line;
    } else if (currentJob && line) {
      // This is probably a continuation or a non-bullet description
      currentJob.bullets.push(line);
    }
  }
  
  // Add the last job
  if (currentJob) {
    experience.push(currentJob);
  }
  
  return experience;
}

/**
 * Parse education section into structured format
 */
function parseEducation(lines: string[]): ResumeData['education'] {
  if (lines.length === 0) return [];
  
  const education: ResumeData['education'] = [];
  let currentEdu: {
    degree?: string;
    institution?: string;
    date?: string;
    details: string[];
  } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a new education entry
    const isEduHeader = /\b(?:Bachelor|Master|PhD|Associate|Diploma|Certificate|University|College|School)\b/i.test(line) &&
      !/^•\s/.test(line);
    
    if (isEduHeader) {
      // Save previous education if exists
      if (currentEdu) {
        education.push(currentEdu);
      }
      
      // Extract date if present
      const dateMatch = line.match(/\b\d{4}\s*(-|–|—)\s*(?:\d{4}|Present)\b/i) ||
        line.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i);
      
      const date = dateMatch ? dateMatch[0] : '';
      
      // Extract institution and degree
      let remaining = line.replace(date, '').trim();
      remaining = remaining.replace(/[,|]/, '');
      
      const parts = remaining.split(/\s*[,-]\s*/);
      
      currentEdu = {
        degree: parts.length > 0 ? parts[0] : '',
        institution: parts.length > 1 ? parts[1] : '',
        date,
        details: []
      };
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is a bullet point
      if (currentEdu) {
        currentEdu.details.push(line.replace(/^[•\-*]\s*/, ''));
      }
    } else if (currentEdu && line) {
      // This is probably additional information
      if (!currentEdu.institution) {
        currentEdu.institution = line;
      } else {
        currentEdu.details.push(line);
      }
    }
  }
  
  // Add the last education
  if (currentEdu) {
    education.push(currentEdu);
  }
  
  return education;
}

/**
 * Parse skills section into structured format
 */
function parseSkills(lines: string[]): ResumeData['skills'] {
  if (lines.length === 0) return [];
  
  // Flatten all lines into one string
  const skillsStr = lines.join(' ').replace(/\s+/g, ' ');
  
  // Split by common separators
  const skillsSplit = skillsStr.split(/[,|•]/);
  
  // Map to skill objects with randomly assigned proficiency
  return skillsSplit
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map((name, index) => {
      // Assign higher proficiency to earlier skills
      const level = Math.max(60, Math.min(95, 95 - index * 3));
      return { name, level };
    });
}

export default {
  parseResumeContent
};
