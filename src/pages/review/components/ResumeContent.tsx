
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
  template
}) => {
  // Parse resume content to identify sections
  const resumeSections = parseResumeContent(currentResume);
  
  // Create resume data structure that will be used for both preview and download
  const resumeData = convertToResumeData(resumeSections);

  // Determine template class name
  const templateClass = template ? `resume-template-${template.id}` : 'resume-template-modern';
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
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
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
                      <div className="resume-education-institution">
                        {edu.institution}
                      </div>
                      <div className="resume-education-degree">
                        {edu.degree}
                        {edu.date && <span className="resume-job-date float-right">{edu.date}</span>}
                      </div>
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
            {resumeData.achievements && resumeData.achievements.length > 0 && (
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
                      <div className="resume-job-company">
                        <span>{exp.company}</span>
                        {exp.date && <span className="resume-job-date">{exp.date}</span>}
                      </div>
                      <div className="resume-job-title">{exp.position}</div>
                      
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
                    <div className="resume-job-company">
                      <span>{exp.company}</span>
                      {exp.date && <span className="resume-job-date">{exp.date}</span>}
                    </div>
                    <div className="resume-job-title">{exp.position}</div>
                    
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
                    <div className="resume-education-institution">
                      {edu.institution}
                    </div>
                    <div className="resume-education-degree">
                      {edu.degree}
                      {edu.date && <span className="resume-job-date float-right">{edu.date}</span>}
                    </div>
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
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
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
              <h2 className="resume-section-title">Achievements</h2>
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
    other: ''
  };
  
  // Extract name and contact info from the first few lines
  if (lines.length > 0) {
    sections.name = lines[0];
    if (lines.length > 1) {
      sections.contact = lines.slice(1, 3).join(' | ');
    }
  }
  
  // Simple parsing logic to identify sections
  let currentSection = 'summary';
  let startLine = 3; // Start after name and contact
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Try to identify section headers
    if ((line === line.toUpperCase() && line.length < 30) || 
        line.toLowerCase().includes('experience') || 
        line.toLowerCase().includes('education') ||
        line.toLowerCase().includes('skills') ||
        line.toLowerCase().includes('summary') ||
        line.toLowerCase().includes('projects') ||
        line.toLowerCase().includes('certifications')) {
      
      if (line.toLowerCase().includes('experience')) {
        currentSection = 'experience';
        continue;
      } else if (line.toLowerCase().includes('education')) {
        currentSection = 'education';
        continue;
      } else if (line.toLowerCase().includes('skills')) {
        currentSection = 'skills';
        continue;
      } else if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective')) {
        currentSection = 'summary';
        continue;
      } else if (line.toLowerCase().includes('projects')) {
        currentSection = 'projects';
        continue;
      } else if (line.toLowerCase().includes('certifications')) {
        currentSection = 'certifications';
        continue;
      } else {
        currentSection = 'other';
        continue;
      }
    }
    
    // Add content to current section
    sections[currentSection] += (sections[currentSection] ? '\n' : '') + line;
  }
  
  return sections;
}

// Helper function to convert parsed sections to ResumeData structure
function convertToResumeData(sections: Record<string, string>): ResumeData {
  const resumeData: ResumeData = {
    header: {
      name: sections.name,
      contact: {
        email: '',
        phone: '',
        location: ''
      }
    },
    summary: sections.summary,
    experience: [],
    education: [],
    skills: []
  };
  
  // Parse experience section
  if (sections.experience) {
    const experienceBlocks = sections.experience.split(/\n\n+/);
    resumeData.experience = experienceBlocks.map(block => {
      const lines = block.split('\n');
      const exp: { company?: string; position?: string; date?: string; bullets?: string[] } = {};
      
      // First line often contains company name
      if (lines.length > 0) {
        // Check if first line has a company and date separated by a pipe or dash
        const firstLine = lines[0];
        if (firstLine.includes('|')) {
          const [company, date] = firstLine.split('|').map(s => s.trim());
          exp.company = company;
          exp.date = date;
        } else if (firstLine.match(/\(?\d{4}\)?(\s*[-–—]\s*\(?\d{4}\)?|\s*[-–—]\s*(Present|Current|Now))/i)) {
          // Line contains a date range, likely a company with date on same line
          const dateMatch = firstLine.match(/\(?\d{4}\)?(\s*[-–—]\s*\(?\d{4}\)?|\s*[-–—]\s*(Present|Current|Now))/i);
          if (dateMatch && dateMatch.index) {
            exp.company = firstLine.substring(0, dateMatch.index).trim();
            exp.date = firstLine.substring(dateMatch.index).trim();
          } else {
            exp.company = firstLine;
          }
        } else {
          exp.company = firstLine;
        }
      }
      
      // Second line might be position
      if (lines.length > 1 && !lines[1].startsWith('•') && !lines[1].startsWith('-')) {
        exp.position = lines[1];
        
        // Check if position contains date
        if (exp.position.includes('|')) {
          const [position, date] = exp.position.split('|').map(s => s.trim());
          exp.position = position;
          if (!exp.date) exp.date = date;
        }
      }
      
      // Remaining lines are bullet points
      const startBullets = exp.position ? 2 : 1;
      const bullets = lines.slice(startBullets)
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•\-]\s*/, '').trim());
      
      if (bullets.length > 0) {
        exp.bullets = bullets;
      } else if (lines.length > startBullets) {
        // If no bullets are found but there are more lines, use them as description
        exp.bullets = [lines.slice(startBullets).join(' ')];
      }
      
      return exp;
    });
  }
  
  // Parse education section
  if (sections.education) {
    const educationBlocks = sections.education.split(/\n\n+/);
    resumeData.education = educationBlocks.map(block => {
      const lines = block.split('\n');
      const edu: { institution?: string; degree?: string; date?: string; details?: string[] } = {};
      
      // First line is usually institution name
      if (lines.length > 0) {
        edu.institution = lines[0];
      }
      
      // Second line might be degree
      if (lines.length > 1) {
        // Check if it contains a date
        if (lines[1].includes('|')) {
          const [degree, date] = lines[1].split('|').map(s => s.trim());
          edu.degree = degree;
          edu.date = date;
        } else if (lines[1].match(/\d{4}/)) {
          // Try to extract date if it appears in the string
          const dateMatch = lines[1].match(/\d{4}/g);
          if (dateMatch && dateMatch.length > 0) {
            const yearPart = lines[1].substring(lines[1].lastIndexOf(dateMatch[dateMatch.length-1])-2);
            edu.degree = lines[1].replace(yearPart, '').trim();
            edu.date = yearPart;
          } else {
            edu.degree = lines[1];
          }
        } else {
          edu.degree = lines[1];
        }
      }
      
      // Remaining lines are details
      if (lines.length > 2) {
        edu.details = lines.slice(2)
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^[•\-]\s*/, '').trim());
      }
      
      return edu;
    });
  }
  
  // Parse skills section
  if (sections.skills) {
    const skillLines = sections.skills.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-]\s*/, '').trim());
    
    resumeData.skills = skillLines.map(skill => ({
      name: skill,
      // Assign a random skill level between 75% and 95%
      level: Math.floor(Math.random() * 21) + 75
    }));
  }
  
  // Parse projects section if it exists
  if (sections.projects) {
    const projectBlocks = sections.projects.split(/\n\n+/);
    resumeData.projects = projectBlocks.map(block => {
      const lines = block.split('\n');
      const project: { name?: string; description?: string; bullets?: string[] } = {};
      
      if (lines.length > 0) {
        project.name = lines[0];
      }
      
      if (lines.length > 1 && !lines[1].startsWith('•') && !lines[1].startsWith('-')) {
        project.description = lines[1];
      }
      
      const startBullets = project.description ? 2 : 1;
      const bullets = lines.slice(startBullets)
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•\-]\s*/, '').trim());
      
      if (bullets.length > 0) {
        project.bullets = bullets;
      }
      
      return project;
    });
  }
  
  // Parse certifications if they exist
  if (sections.certifications) {
    resumeData.certifications = sections.certifications.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-]\s*/, '').trim());
  }
  
  return resumeData;
}

// Format contact information into separate elements
function formatContactInfo(contactStr: string) {
  const parts = contactStr.split(/\||\s{2,}/).map(part => part.trim());
  
  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={idx}>
          <span>{part}</span>
          {idx < parts.length - 1 && <span className="hidden sm:inline">•</span>}
        </React.Fragment>
      ))}
    </>
  );
}

export default ResumeContent;
