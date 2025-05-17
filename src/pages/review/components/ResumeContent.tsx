
import React from 'react';
import { ResumeTemplate } from '@/utils/resumeRewriter';

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

  // Determine template class name
  const templateClass = template ? `resume-template-${template.id}` : 'resume-template-modern';
  const layoutClass = template?.layout ? `layout-${template.layout}` : '';
  const spacingClass = template?.spacing ? `spacing-${template.spacing}` : '';

  // Generate skills with progress bars for demonstration
  const skills = generateSkillsFromResume(currentResume);

  return (
    <div className={`border rounded-lg overflow-hidden ${templateClass} ${layoutClass} ${spacingClass}`}>
      {isPremiumBlurred && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <p className="text-lg font-medium text-slate-800">Premium Feature</p>
            <p className="text-sm text-slate-600 mt-1">Upgrade to view and download your optimized resume</p>
          </div>
        </div>
      )}

      <div className="resume-header">
        <h1 className="text-2xl font-bold">{resumeSections.name || 'Your Name'}</h1>
        <div className="mt-2">{resumeSections.contact || 'email@example.com | (123) 456-7890 | Location'}</div>
      </div>

      {template?.layout === 'two-column' ? (
        <div className="resume-body">
          <div className="resume-sidebar">
            {/* Sidebar content - Skills, Education, etc. */}
            <div className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="mt-3">
                {skills.map((skill, index) => (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
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

            {resumeSections.education && (
              <div className="resume-section">
                <h2 className="resume-section-title">Education</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.education) }}></div>
              </div>
            )}
            
            {resumeSections.certifications && (
              <div className="resume-section">
                <h2 className="resume-section-title">Certifications</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.certifications) }}></div>
              </div>
            )}
          </div>
          
          <div className="resume-main">
            {/* Main content - Summary, Experience, etc. */}
            {resumeSections.summary && (
              <div className="resume-section">
                <h2 className="resume-section-title">Summary</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.summary) }}></div>
              </div>
            )}
            
            {resumeSections.experience && (
              <div className="resume-section">
                <h2 className="resume-section-title">Experience</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.experience) }}></div>
              </div>
            )}
            
            {resumeSections.projects && (
              <div className="resume-section">
                <h2 className="resume-section-title">Projects</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.projects) }}></div>
              </div>
            )}
            
            {resumeSections.other && (
              <div className="resume-section">
                <h2 className="resume-section-title">Additional Information</h2>
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.other) }}></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Single column layout
        <div className="resume-content p-6">
          {resumeSections.summary && (
            <div className="resume-section">
              <h2 className="resume-section-title">Summary</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.summary) }}></div>
            </div>
          )}
          
          {resumeSections.experience && (
            <div className="resume-section">
              <h2 className="resume-section-title">Experience</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.experience) }}></div>
            </div>
          )}
          
          {resumeSections.education && (
            <div className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.education) }}></div>
            </div>
          )}
          
          {resumeSections.skills && (
            <div className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.skills) }}></div>
            </div>
          )}
          
          {resumeSections.projects && (
            <div className="resume-section">
              <h2 className="resume-section-title">Projects</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.projects) }}></div>
            </div>
          )}
          
          {resumeSections.other && (
            <div className="resume-section">
              <h2 className="resume-section-title">Additional Information</h2>
              <div className="mt-3" dangerouslySetInnerHTML={{ __html: formatSection(resumeSections.other) }}></div>
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

// Helper function to format section content with HTML
function formatSection(content: string) {
  if (!content) return '';
  
  // Format bullet points
  let formatted = content.replace(/^[\s-]*•[\s]*/gm, '<li class="resume-bullet-item">');
  formatted = formatted.replace(/^[\s-]*-[\s]*/gm, '<li class="resume-bullet-item">');
  
  // Wrap lists in <ul>
  if (formatted.includes('<li class="resume-bullet-item">')) {
    formatted = '<ul class="resume-bullet-list">' + formatted + '</ul>';
  }
  
  // Replace newlines with <br> for non-list content
  formatted = formatted.replace(/\n(?!<li)/g, '<br>');
  
  // Format job titles, companies, dates
  const lines = formatted.split('<br>');
  let inJob = false;
  let formattedLines = lines.map(line => {
    // Try to identify job title lines
    if (line.includes('|') || /\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*(Present|Current)/i.test(line)) {
      inJob = true;
      const parts = line.split('|');
      if (parts.length > 1) {
        return `<div class="resume-job-title">${parts[0].trim()}</div><div class="resume-job-company">${parts[1].trim()}</div>`;
      }
      return `<div class="resume-job-company">${line}</div>`;
    }
    
    // Format strong for job titles
    if (inJob) {
      inJob = false;
      return `<div class="resume-job-title">${line}</div>`;
    }
    
    return line;
  });
  
  formatted = formattedLines.join('<br>');
  
  return formatted;
}

// Generate fake skills with progress bars for demonstration
function generateSkillsFromResume(content: string) {
  // In a real implementation, we would extract skills from the resume
  // For now, we'll return some example skills
  const defaultSkills = [
    { name: 'Communication', level: 90 },
    { name: 'Leadership', level: 85 },
    { name: 'Problem Solving', level: 95 },
    { name: 'Teamwork', level: 90 },
    { name: 'Time Management', level: 80 }
  ];
  
  // Try to extract real skills from the resume content
  const skills: {name: string, level: number}[] = [];
  const skillSection = content.match(/SKILLS[\s\S]*?(?=\n\n\w|\n\w{5,}|$)/i);
  
  if (skillSection) {
    const skillText = skillSection[0];
    const skillLines = skillText.split('\n').slice(1); // Skip the "SKILLS" header
    
    skillLines.forEach(line => {
      const skill = line.replace(/^[-•\s]+/, '').trim();
      if (skill) {
        // Assign a random level between 75 and 95
        const level = Math.floor(Math.random() * 20) + 75;
        skills.push({ name: skill, level });
      }
    });
  }
  
  return skills.length > 0 ? skills : defaultSkills;
}

export default ResumeContent;
