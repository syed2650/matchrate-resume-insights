// ResumeRewriter TypeScript Interface and Implementation
export interface ResumeTemplate {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  headerStyle: 'uppercase' | 'bold' | 'mixed';
  sectionDividers: boolean;
  spacing: 'compact' | 'standard' | 'airy';
  preview?: string; // Path to preview image
  accent?: string; // Optional accent color
  layout?: 'single-column' | 'two-column' | 'asymmetric';
  columnRatio?: number; // Added this property for two-column layout ratio
  headerSpanColumns?: boolean; // Added this property to control if header spans columns
}

// Define the ResumeData interface that was missing and causing the error
export interface ResumeData {
  header?: {
    name?: string;
    title?: string;
    contact?: {
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      website?: string;
    };
  };
  summary?: string;
  experience?: Array<{
    company?: string;
    position?: string;
    date?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    date?: string;
    details?: string[];
  }>;
  skills?: Array<{
    name?: string;
    level?: number;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    bullets?: string[];
  }>;
  certifications?: string[];
  achievements?: string[];
}

export class ResumeRewriter {
  templates: Record<string, ResumeTemplate>;

  constructor() {
    this.templates = {};
  }

  // Implementation placeholder for future development
  rewriteResume(resumeData: ResumeData, jobDescription: string = "", templateId: string = "modern") {
    // To be implemented
    return {
      content: resumeData,
      template: this.templates[templateId] || this.templates.modern
    };
  }

  // Helper method to parse raw resume text into structured data
  parseResumeText(text: string): ResumeData {
    if (!text) return {};
    
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const data: ResumeData = {
      header: {
        name: lines[0] || '',
        contact: {
          email: '',
          phone: '',
          location: '',
        }
      },
      summary: '',
      experience: [],
      education: [],
      skills: []
    };
    
    // Extract contact info
    if (lines.length > 1) {
      const contactLine = lines[1];
      const contactParts = contactLine.split('|').map(part => part.trim());
      
      if (contactParts.length > 0) {
        contactParts.forEach(part => {
          if (part.includes('@')) data.header!.contact!.email = part;
          else if (part.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) data.header!.contact!.phone = part;
          else data.header!.contact!.location = part;
        });
      }
    }
    
    // Process the rest of the content
    let currentSection = '';
    let sectionContent = '';
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for section headers
      if (line.toUpperCase() === line && line.length < 30 && !line.startsWith('•') && !line.startsWith('-')) {
        // Save previous section
        if (currentSection && sectionContent) {
          this.addSectionToData(data, currentSection, sectionContent);
          sectionContent = '';
        }
        
        // Set new section
        currentSection = this.identifySection(line);
        continue;
      }
      
      // Add line to current section
      sectionContent += (sectionContent ? '\n' : '') + line;
    }
    
    // Add the final section
    if (currentSection && sectionContent) {
      this.addSectionToData(data, currentSection, sectionContent);
    }
    
    return data;
  }
  
  private identifySection(heading: string): string {
    heading = heading.toLowerCase();
    
    if (heading.includes('experience') || heading.includes('work') || heading.includes('employment')) {
      return 'experience';
    } else if (heading.includes('education') || heading.includes('academic')) {
      return 'education';
    } else if (heading.includes('skills') || heading.includes('abilities') || heading.includes('expertise')) {
      return 'skills';
    } else if (heading.includes('summary') || heading.includes('objective') || heading.includes('profile')) {
      return 'summary';
    } else if (heading.includes('project')) {
      return 'projects';
    } else if (heading.includes('certif')) {
      return 'certifications';
    } else if (heading.includes('achieve') || heading.includes('award')) {
      return 'achievements';
    } else {
      return 'other';
    }
  }
  
  private addSectionToData(data: ResumeData, section: string, content: string): void {
    switch (section) {
      case 'summary':
        data.summary = content;
        break;
      
      case 'experience':
        // Parse experience entries
        const expEntries = content.split(/\n(?=\S)/);
        expEntries.forEach(entry => {
          const lines = entry.split('\n');
          const expItem: { company?: string; position?: string; date?: string; bullets?: string[] } = {};
          
          // First line typically contains company and date
          if (lines.length > 0) {
            const firstLine = lines[0];
            if (firstLine.includes('|')) {
              const [company, date] = firstLine.split('|').map(s => s.trim());
              expItem.company = company;
              expItem.date = date;
            } else {
              expItem.company = firstLine;
            }
          }
          
          // Second line often contains position
          if (lines.length > 1 && !lines[1].startsWith('•') && !lines[1].startsWith('-')) {
            expItem.position = lines[1].trim();
          }
          
          // Remaining lines are bullets
          const bullets = lines.slice(expItem.position ? 2 : 1)
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-]\s*/, '').trim());
          
          if (bullets.length > 0) {
            expItem.bullets = bullets;
          }
          
          if (data.experience) {
            data.experience.push(expItem);
          } else {
            data.experience = [expItem];
          }
        });
        break;
      
      case 'education':
        // Parse education entries
        const eduEntries = content.split(/\n(?=\S)/);
        eduEntries.forEach(entry => {
          const lines = entry.split('\n');
          const eduItem: { institution?: string; degree?: string; date?: string; details?: string[] } = {};
          
          // First line typically contains institution
          if (lines.length > 0) {
            eduItem.institution = lines[0].trim();
          }
          
          // Second line often contains degree and date
          if (lines.length > 1) {
            const degreeLine = lines[1];
            if (degreeLine.includes('|')) {
              const [degree, date] = degreeLine.split('|').map(s => s.trim());
              eduItem.degree = degree;
              eduItem.date = date;
            } else {
              eduItem.degree = degreeLine.trim();
            }
          }
          
          // Remaining lines are details
          const details = lines.slice(2)
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-]\s*/, '').trim());
          
          if (details.length > 0) {
            eduItem.details = details;
          }
          
          if (data.education) {
            data.education.push(eduItem);
          } else {
            data.education = [eduItem];
          }
        });
        break;
      
      case 'skills':
        // Parse skills
        const skillLines = content.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[•\-]\s*/, '').trim());
        
        data.skills = skillLines.map(skill => ({
          name: skill,
          // Generate a random level between 75 and 98
          level: Math.floor(Math.random() * 24) + 75
        }));
        break;
      
      case 'projects':
        // Parse project entries
        const projectEntries = content.split(/\n(?=\S)/);
        projectEntries.forEach(entry => {
          const lines = entry.split('\n');
          const projectItem: { name?: string; description?: string; bullets?: string[] } = {};
          
          // First line is project name
          if (lines.length > 0) {
            projectItem.name = lines[0].trim();
          }
          
          // Second line might be description
          if (lines.length > 1 && !lines[1].startsWith('•') && !lines[1].startsWith('-')) {
            projectItem.description = lines[1].trim();
          }
          
          // Remaining lines are bullets
          const bullets = lines.slice(projectItem.description ? 2 : 1)
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-]\s*/, '').trim());
          
          if (bullets.length > 0) {
            projectItem.bullets = bullets;
          }
          
          if (data.projects) {
            data.projects.push(projectItem);
          } else {
            data.projects = [projectItem];
          }
        });
        break;
      
      case 'certifications':
        data.certifications = content.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[•\-]\s*/, '').trim());
        break;
      
      case 'achievements':
        data.achievements = content.split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[•\-]\s*/, '').trim());
        break;
        
      default:
        // Handle any other sections
        break;
    }
  }
}
