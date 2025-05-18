import React from 'react';
import { ResumeTemplate, ResumeData } from '@/utils/resumeRewriter';

interface ResumeContentProps {
  currentResume: string;
  jobContext?: any;
  isPremiumBlurred?: boolean;
  template?: ResumeTemplate;
}

const ResumeContent: React.FC<ResumeContentProps> = ({
  currentResume,
  jobContext,
  isPremiumBlurred = false,
  template = { 
    id: 'modern', 
    name: 'Modern',
    fontFamily: "'Open Sans', sans-serif",
    primaryColor: "#2D74FF",
    secondaryColor: "#E6F0FF",
    headerStyle: "bold",
    sectionDividers: true,
    spacing: "compact",
    layout: "two-column"
  }
}) => {
  // Parse resume content to identify sections
  const resumeSections = parseResumeContent(currentResume);
  
  // Create resume data structure that will be used for both preview and download
  const resumeData = convertToResumeData(resumeSections);

  // Determine template class name
  const templateClass = `resume-template-${template.id}`;
  const layoutClass = template?.layout ? `layout-${template.layout}` : '';
  const spacingClass = template?.spacing ? `spacing-${template.spacing}` : '';

  return (
    <div className={`resume-document ${templateClass} ${layoutClass} ${spacingClass}`}>
      {isPremiumBlurred && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-lg font-medium text-slate-800">Premium Feature</p>
            <p className="text-sm text-slate-600 mt-1">Upgrade to view and download your optimized resume</p>
          </div>
        </div>
      )}

      <div className="resume-header">
        <div className="resume-name">{resumeSections.name || 'Your Name'}</div>
        <div className="resume-contact">{formatContactInfo(resumeSections.contact || '')}</div>
      </div>

      {template?.layout === 'two-column' ? (
        <div className="resume-body">
          <div className="resume-main">
            {/* Main content - Summary, Experience, etc. */}
            
            {/* Summary Section */}
            {resumeData.summary && (
              <div className="resume-section">
                <h2 className="resume-section-title">Professional Summary</h2>
                <div className="resume-summary">{resumeData.summary}</div>
              </div>
            )}
            
            {/* Experience Section */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Professional Experience</h2>
                <div className="mt-3">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="resume-experience-item">
                      <div className="resume-job-title">{exp.position}</div>
                      <div className="resume-job-company">
                        <span>{exp.company}</span>
                        {exp.date && <span className="resume-job-date">{exp.date}</span>}
                      </div>
                      
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="resume-bullet-list">
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="resume-bullet-item">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Projects</h2>
                <div className="mt-3">
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="resume-experience-item">
                      <div className="resume-job-title">{project.name}</div>
                      {project.description && (
                        <div className="mb-2">{project.description}</div>
                      )}
                      
                      {project.bullets && project.bullets.length > 0 && (
                        <ul className="resume-bullet-list">
                          {project.bullets.map((bullet, idx) => (
                            <li key={idx} className="resume-bullet-item">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Achievements Section (if in main column) */}
            {resumeData.achievements && resumeData.achievements.length > 0 && template.id !== 'modern' && (
              <div className="resume-section">
                <h2 className="resume-section-title">Achievements</h2>
                <ul className="resume-bullet-list">
                  {resumeData.achievements.map((achievement, index) => (
                    <li key={index} className="resume-bullet-item">{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="resume-sidebar">
            {/* Sidebar content - Skills, Education, etc. */}
            
            {/* Skills Section */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Skills</h2>
                <div className="mt-3">
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="mb-2">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                <div className="mt-3">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="resume-education-item">
                      <div className="resume-education-degree">
                        {edu.degree}
                      </div>
                      <div className="resume-education-institution">
                        {edu.institution}
                      </div>
                      {edu.date && <div className="resume-job-date">{edu.date}</div>}
                      {edu.details && edu.details.length > 0 && (
                        <ul className="resume-bullet-list">
                          {edu.details.map((detail, idx) => (
                            <li key={idx} className="resume-bullet-item">{detail}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Certifications</h2>
                <ul className="resume-bullet-list">
                  {resumeData.certifications.map((cert, index) => (
                    <li key={index} className="resume-bullet-item">{cert}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Achievements Section (if in sidebar) */}
            {resumeData.achievements && resumeData.achievements.length > 0 && template.id === 'modern' && (
              <div className="resume-section">
                <h2 className="resume-section-title">Additional Information</h2>
                <ul className="resume-bullet-list">
                  {resumeData.achievements.map((achievement, index) => (
                    <li key={index} className="resume-bullet-item">{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Single column layout
        <div className="p-6">
          {/* Summary Section */}
          {resumeData.summary && (
            <div className="resume-section">
              <h2 className="resume-section-title">Professional Summary</h2>
              <div className="resume-summary">{resumeData.summary}</div>
            </div>
          )}
          
          {/* Experience Section */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Professional Experience</h2>
              <div className="mt-3">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="resume-experience-item">
                    <div className="resume-job-title">{exp.position}</div>
                    <div className="resume-job-company">
                      <span>{exp.company}</span>
                      {exp.date && <span className="resume-job-date">{exp.date}</span>}
                    </div>
                    
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="resume-bullet-list">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="resume-bullet-item">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              <div className="mt-3">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="resume-education-item">
                    <div className="resume-education-degree">
                      {edu.degree}
                    </div>
                    <div className="resume-education-institution">
                      {edu.institution}
                    </div>
                    {edu.date && <div className="resume-job-date">{edu.date}</div>}
                    {edu.details && edu.details.length > 0 && (
                      <ul className="resume-bullet-list">
                        {edu.details.map((detail, idx) => (
                          <li key={idx} className="resume-bullet-item">{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="mt-3 grid grid-cols-2 gap-4">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="mb-2">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-progress" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Projects</h2>
              <div className="mt-3">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="resume-experience-item">
                    <div className="resume-job-title">{project.name}</div>
                    {project.description && (
                      <div className="mb-2">{project.description}</div>
                    )}
                    
                    {project.bullets && project.bullets.length > 0 && (
                      <ul className="resume-bullet-list">
                        {project.bullets.map((bullet, idx) => (
                          <li key={idx} className="resume-bullet-item">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications and Achievements */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Certifications</h2>
              <ul className="resume-bullet-list">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="resume-bullet-item">{cert}</li>
                ))}
              </ul>
            </div>
          )}
          
          {resumeData.achievements && resumeData.achievements.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Additional Information</h2>
              <ul className="resume-bullet-list">
                {resumeData.achievements.map((achievement, index) => (
                  <li key={index} className="resume-bullet-item">{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to parse resume content into sections
function parseResumeContent(content: string) {
  const lines = content.split('\n');
  const sections: Record<string, string> = {
    name: '',
    contact: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: '',
    achievements: '',
    other: ''
  };
  
  // Extract name and contact info from the first few lines
  if (lines.length > 0) {
    sections.name = lines[0].trim();
    
    // Get contact info - look for lines with email, phone, location
    let contactLines: string[] = [];
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim();
      if (line && !line.match(/^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS)/i)) {
        // Skip divider lines
        if (!line.match(/^-+$/)) {
          contactLines.push(line);
        }
      } else {
        break;
      }
    }
    sections.contact = contactLines.join(' | ');
  }
  
  // Simple parsing logic to identify sections
  let currentSection = '';
  let inSummary = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Try to identify section headers
    if (line.match(/SUMMARY|PROFESSIONAL\s+SUMMARY/i)) {
      currentSection = 'summary';
      inSummary = true;
      continue;
    } else if (line.match(/EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|WORK\s+EXPERIENCE/i)) {
      currentSection = 'experience';
      inSummary = false;
      continue;
    } else if (line.match(/EDUCATION|ACADEMIC/i)) {
      currentSection = 'education';
      inSummary = false;
      continue;
    } else if (line.match(/SKILLS|TECHNICAL\s+SKILLS|KEY\s+SKILLS/i)) {
      currentSection = 'skills';
      inSummary = false;
      continue;
    } else if (line.match(/PROJECTS|PERSONAL\s+PROJECTS/i)) {
      currentSection = 'projects';
      inSummary = false;
      continue;
    } else if (line.match(/CERTIFICATIONS|CERTIFICATES/i)) {
      currentSection = 'certifications';
      inSummary = false;
      continue;
    } else if (line.match(/ACHIEVEMENTS|AWARDS|RECOGNITION|ADDITIONAL\s+INFORMATION/i)) {
      currentSection = 'achievements';
      inSummary = false;
      continue;
    }
    
    // If no section is identified yet but we're past the contact info,
    // and we haven't found a summary section, this might be the summary
    if (!currentSection && !line.match(/^-+$/) && i > 2) {
      currentSection = 'summary';
      inSummary = true;
    }
    
    // Add content to current section
    if (currentSection) {
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
    }
  }
  
  return sections;
}

// Helper function to convert parsed sections to ResumeData structure
function convertToResumeData(sections: Record<string, string>): ResumeData {
  const resumeData: ResumeData = {
    header: {
      name: sections.name,
      contact: {
        email: extractEmail(sections.contact) || '',
        phone: extractPhone(sections.contact) || '',
        location: extractLocation(sections.contact) || ''
      }
    },
    summary: sections.summary,
    experience: [],
    education: [],
    skills: [],
    achievements: []
  };
  
  // Parse experience section
  if (sections.experience) {
    const experienceLines = sections.experience.split('\n');
    const experiences: any[] = [];
    let currentExp: any = null;
    
    for (let i = 0; i < experienceLines.length; i++) {
      const line = experienceLines[i].trim();
      if (!line) continue;
      
      // Check if this is a new job entry (typically starts with a job title or company)
      if (
        i === 0 || // First line is always a new entry
        line.match(/^\*\*.*\*\*$/) || // Bold text (job title)
        line.match(/^[A-Z][A-Za-z\s]+\s+\|\s+[A-Za-z\s]+$/) || // Title | Company format
        line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+[-–—]\s+(Present|\d{4})$/) || // Date range
        (experienceLines[i-1] && !experienceLines[i-1].trim()) // Line after a blank line
      ) {
        // Save previous experience if exists
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        // Start new experience
        currentExp = {
          position: '',
          company: '',
          date: '',
          bullets: []
        };
        
        // Parse this line
        if (line.match(/^\*\*.*\*\*$/)) {
          // Bold format: **Job Title | Company**
          const content = line.replace(/^\*\*|\*\*$/g, '');
          if (content.includes('|')) {
            const [position, company] = content.split('|').map(s => s.trim());
            currentExp.position = position;
            currentExp.company = company;
          } else {
            currentExp.position = content;
          }
        } else if (line.match(/^[A-Z][A-Za-z\s]+\s+\|\s+[A-Za-z\s]+$/)) {
          // Title | Company format
          const [position, company] = line.split('|').map(s => s.trim());
          currentExp.position = position;
          currentExp.company = company;
        } else if (line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+[-–—]\s+(Present|\d{4})$/)) {
          // Date format
          currentExp.date = line;
        } else {
          // Assume it's a company or job title
          currentExp.position = line;
        }
      } else if (line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+[-–—]\s+(Present|\d{4})$/)) {
        // Date line
        currentExp.date = line;
      } else if (line.startsWith('•') || line.startsWith('-')) {
        // Bullet point
        const bullet = line.substring(1).trim();
        if (currentExp && bullet) {
          currentExp.bullets.push(bullet);
        }
      } else if (currentExp && !currentExp.company) {
        // If we have a position but no company, this might be the company
        currentExp.company = line;
      } else {
        // Otherwise add as a bullet point
        if (currentExp && line) {
          currentExp.bullets.push(line);
        }
      }
    }
    
    // Add the last experience
    if (currentExp) {
      experiences.push(currentExp);
    }
    
    resumeData.experience = experiences;
  }
  
  // Parse education section
  if (sections.education) {
    const educationLines = sections.education.split('\n');
    const educations: any[] = [];
    let currentEdu: any = null;
    
    for (let i = 0; i < educationLines.length; i++) {
      const line = educationLines[i].trim();
      if (!line) continue;
      
      if (i === 0 || (educationLines[i-1] && !educationLines[i-1].trim())) {
        // Save previous education if exists
        if (currentEdu) {
          educations.push(currentEdu);
        }
        
        // Start new education
        currentEdu = {
          degree: '',
          institution: '',
          date: '',
          details: []
        };
        
        // First line is typically the degree
        currentEdu.degree = line;
      } else if (line.match(/^[A-Z]/)) {
        // Capitalized line is likely the institution
        currentEdu.institution = line;
      } else if (line.match(/\d{4}/)) {
        // Line with a year is likely the date
        currentEdu.date = line;
      } else if (line.startsWith('•') || line.startsWith('-')) {
        // Bullet point
        const detail = line.substring(1).trim();
        if (currentEdu && detail) {
          currentEdu.details.push(detail);
        }
      } else {
        // Details
        if (currentEdu && line) {
          currentEdu.details.push(line);
        }
      }
    }
    
    // Add the last education
    if (currentEdu) {
      educations.push(currentEdu);
    }
    
    resumeData.education = educations;
  }
  
  // Parse skills section
  if (sections.skills) {
    const skillLines = sections.skills.split('\n')
      .filter(line => line.trim().length > 0);
    
    resumeData.skills = skillLines.map(skill => {
      // Remove bullet points or other markers
      const cleanSkill = skill.replace(/^[•\-]\s*/, '').trim();
      
      // Assign a realistic skill level based on positioning in resume
      // Earlier skills usually are stronger
      const position = skillLines.indexOf(skill);
      const baseLevel = 90 - (position * 3);
      const level = Math.max(Math.min(baseLevel, 96), 70); // Keep between 70-96%
      
      return {
        name: cleanSkill,
        level
      };
    });
  }
  
  // Parse achievements
  if (sections.achievements) {
    resumeData.achievements = sections.achievements.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-]\s*/, '').trim());
  }
  
  // Parse certifications if they exist
  if (sections.certifications) {
    resumeData.certifications = sections.certifications.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-]\s*/, '').trim());
  }
  
  return resumeData;
}

// Extract email from contact string
function extractEmail(contact: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = contact.match(emailRegex);
  return match ? match[0] : null;
}

// Extract phone from contact string
function extractPhone(contact: string): string | null {
  const phoneRegex = /\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  const match = contact.match(phoneRegex);
  return match ? match[0] : null;
}

// Extract location from contact string
function extractLocation(contact: string): string | null {
  // This is a simple approach - assuming location is part of the contact line
  // A more sophisticated approach would look for city/state patterns
  const parts = contact.split(/\||\•/).map(p => p.trim());
  
  // Remove email and phone parts
  const locationParts = parts.filter(part => 
    !extractEmail(part) && !extractPhone(part)
  );
  
  return locationParts.length > 0 ? locationParts[0] : null;
}

// Format contact information into separate elements
function formatContactInfo(contactStr: string) {
  const parts = contactStr.split(/\||\s{2,}|\•/).map(part => part.trim()).filter(Boolean);
  
  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          <span>{part}</span>
          {idx < parts.length - 1 && <span className="mx-2">•</span>}
        </React.Fragment>
      ))}
    </>
  );
}

export default ResumeContent;
