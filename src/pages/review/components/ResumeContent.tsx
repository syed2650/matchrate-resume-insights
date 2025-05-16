
import React from "react";
import { Card } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResumeTemplate } from "@/utils/resumeRewriter";
import { templates } from "@/templates";
import "../../../styles/enhancedResumeTemplates.css";

interface ResumeContentProps {
  currentResume: string;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  isPremiumBlurred?: boolean;
  template?: ResumeTemplate;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ 
  currentResume, 
  jobContext, 
  isPremiumBlurred = false,
  template = templates[0] 
}) => {
  if (!currentResume) return null;
  
  const parseResumeContent = (content: string) => {
    // Split content by sections
    const sections = content.split(/^(#+\s.*|[A-Z\s]{3,})$/m).filter(Boolean);
    
    // Initialize resume structure
    const resumeStructure: {
      name: string;
      contactInfo: string[];
      summary: string[];
      experience: {
        title: string;
        content: string[];
      }[];
      education: {
        title: string;
        content: string[];
      }[];
      skills: {
        title: string;
        content: string[];
      }[];
      additional: {
        title: string;
        content: string[];
      }[];
    } = {
      name: "",
      contactInfo: [],
      summary: [],
      experience: [],
      education: [],
      skills: [],
      additional: [],
    };

    let currentSection = "";
    let isFirstSection = true;
    
    // Parse the resume content into structured sections
    sections.forEach((section, index) => {
      // Check if this is a heading
      const isHeading = /^(#+\s.*|[A-Z\s]{3,})$/m.test(section);
      
      if (isHeading) {
        // Clean up heading formatting
        const headingText = section
          .replace(/^#+\s*/g, '')
          .replace(/^\s+|\s+$/g, '')
          .toUpperCase();
        
        // Determine which section this heading represents
        if (headingText.includes('EXPERIENCE') || headingText.includes('WORK') || headingText.includes('EMPLOYMENT')) {
          currentSection = "experience";
          resumeStructure.experience.push({ title: headingText, content: [] });
        } else if (headingText.includes('EDUCATION') || headingText.includes('ACADEMIC')) {
          currentSection = "education";
          resumeStructure.education.push({ title: headingText, content: [] });
        } else if (headingText.includes('SKILL') || headingText.includes('PROFICIENC') || headingText.includes('TECHNOLOG')) {
          currentSection = "skills";
          resumeStructure.skills.push({ title: headingText, content: [] });
        } else if (headingText.includes('SUMMARY') || headingText.includes('PROFILE') || headingText.includes('ABOUT')) {
          currentSection = "summary";
        } else {
          currentSection = "additional";
          resumeStructure.additional.push({ title: headingText, content: [] });
        }
      } else {
        // This is content for a section
        const lines = section.split('\n').filter(line => line.trim());
        
        // Special handling for the first non-heading section (likely contains name and contact info)
        if (isFirstSection && index < 3) {
          isFirstSection = false;
          // First line is typically the name
          if (lines.length > 0) {
            resumeStructure.name = lines[0].trim();
            
            // Remaining lines are typically contact info
            resumeStructure.contactInfo = lines.slice(1).filter(line => 
              line.includes('@') || line.includes('|') || line.includes('+') || 
              line.includes('linkedin') || /\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}/.test(line)
            );
          }
        } else if (currentSection === "summary") {
          resumeStructure.summary.push(...lines);
        } else if (currentSection === "experience" && resumeStructure.experience.length > 0) {
          resumeStructure.experience[resumeStructure.experience.length - 1].content.push(...lines);
        } else if (currentSection === "education" && resumeStructure.education.length > 0) {
          resumeStructure.education[resumeStructure.education.length - 1].content.push(...lines);
        } else if (currentSection === "skills" && resumeStructure.skills.length > 0) {
          resumeStructure.skills[resumeStructure.skills.length - 1].content.push(...lines);
        } else if (currentSection === "additional" && resumeStructure.additional.length > 0) {
          resumeStructure.additional[resumeStructure.additional.length - 1].content.push(...lines);
        }
      }
    });

    return resumeStructure;
  };

  const renderModernTemplate = (resumeData: any) => {
    // Helper function to create skill bars
    const renderSkillBar = (skill: string, level: number = Math.floor(Math.random() * 30) + 70) => {
      return (
        <div className="skill-item" key={skill}>
          <div className="skill-name">
            <span>{skill}</span>
            <span className="skill-percentage">{level}%</span>
          </div>
          <div className="skill-bar">
            <div className="skill-level" style={{ width: `${level}%` }}></div>
          </div>
        </div>
      );
    };

    // Parse skills to display with visualization
    const parseSkills = (skillsContent: string[]) => {
      const skills: string[] = [];

      skillsContent.forEach(line => {
        // Handle different formats of skill lines
        if (line.includes(':')) {
          // Format: "Category: Skill1, Skill2, Skill3"
          const parts = line.split(':');
          if (parts.length > 1) {
            const skillItems = parts[1].split(',').map(s => s.trim()).filter(Boolean);
            skills.push(...skillItems);
          }
        } else if (line.startsWith('•') || line.startsWith('-')) {
          // Bullet point format
          const skill = line.replace(/^[•-]\s*/, '').trim();
          skills.push(skill);
        } else if (line.trim()) {
          // Simple text line
          skills.push(line.trim());
        }
      });

      return skills.slice(0, 8); // Limit to 8 skills for visualization
    };

    // Process experience items for standardized format
    const processExperience = (content: string[]) => {
      const experiences = [];
      let currentExperience: any = null;
      let inBullets = false;
      
      for (let i = 0; i < content.length; i++) {
        const line = content[i].trim();
        
        // Skip empty lines
        if (!line) continue;
        
        // Check for job title and company (typically first lines of a new job)
        if (!currentExperience || (line.length < 100 && !line.startsWith('•') && !line.startsWith('-'))) {
          // If we detect a new job entry
          if (!currentExperience || 
              /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i.test(line) ||
              /\d{4}\s*(-|–|to)\s*(\d{4}|Present|Current)/i.test(line) ||
              /^[A-Z][a-zA-Z\s,]+$/.test(line)) {
            
            // Create a new job entry
            if (currentExperience) {
              experiences.push(currentExperience);
            }
            
            currentExperience = {
              company: "",
              title: "",
              date: "",
              location: "",
              bullets: []
            };
            
            // Try to determine if this is company, title, or date
            if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i.test(line) ||
                /\d{4}\s*(-|–|to)\s*(\d{4}|Present|Current)/i.test(line)) {
              currentExperience.date = line;
            } else {
              // Likely company name or job title
              if (line.includes(',') || line.includes('|')) {
                // Might be "Company, Location" or "Company | Location" format
                const parts = line.split(/[,|]/);
                currentExperience.company = parts[0].trim();
                if (parts.length > 1) {
                  currentExperience.location = parts[1].trim();
                }
              } else {
                currentExperience.company = line;
              }
            }
            
            inBullets = false;
          } else if (currentExperience.company && !currentExperience.title) {
            // If we have a company but no title, this is probably the title
            currentExperience.title = line;
          } else if (currentExperience.company && currentExperience.title && !currentExperience.date) {
            // If we have company and title but no date, this might be the date
            currentExperience.date = line;
          }
        } else if (line.startsWith('•') || line.startsWith('-')) {
          // This is a bullet point
          inBullets = true;
          if (currentExperience) {
            currentExperience.bullets.push(line.replace(/^[•-]\s*/, ''));
          }
        } else if (inBullets) {
          // Continuation of a bullet point or a non-bulleted description
          if (currentExperience && currentExperience.bullets.length > 0) {
            // Add to the last bullet as it might be a continuation
            currentExperience.bullets[currentExperience.bullets.length - 1] += ' ' + line;
          } else if (currentExperience) {
            // Create a new bullet
            currentExperience.bullets.push(line);
          }
        }
      }
      
      // Add the last experience
      if (currentExperience) {
        experiences.push(currentExperience);
      }
      
      return experiences;
    };

    // Process education items
    const processEducation = (content: string[]) => {
      const educations = [];
      let currentEducation: any = {};
      
      for (let i = 0; i < content.length; i++) {
        const line = content[i].trim();
        if (!line) continue;
        
        // Check for degree or institution patterns
        if (!currentEducation.degree) {
          currentEducation.degree = line;
        } else if (!currentEducation.institution) {
          currentEducation.institution = line;
        } else if (!currentEducation.date) {
          if (/\d{4}/.test(line)) {
            currentEducation.date = line;
          } else {
            currentEducation.location = line;
          }
        } else if (!currentEducation.location) {
          currentEducation.location = line;
        }
      }
      
      if (Object.keys(currentEducation).length > 0) {
        educations.push(currentEducation);
      }
      
      return educations;
    };
    
    // Get skills from the resume if available
    let skills: string[] = [];
    if (resumeData.skills && resumeData.skills.length > 0) {
      const allSkillContent = resumeData.skills.reduce((acc: string[], section: any) => {
        return [...acc, ...section.content];
      }, []);
      skills = parseSkills(allSkillContent);
    }

    // Process experience sections
    let experienceItems: any[] = [];
    if (resumeData.experience && resumeData.experience.length > 0) {
      const allExperienceContent = resumeData.experience.reduce((acc: string[], section: any) => {
        return [...acc, ...section.content];
      }, []);
      experienceItems = processExperience(allExperienceContent);
    }
    
    // Process education sections
    let educationItems: any[] = [];
    if (resumeData.education && resumeData.education.length > 0) {
      const allEducationContent = resumeData.education.reduce((acc: string[], section: any) => {
        return [...acc, ...section.content];
      }, []);
      educationItems = processEducation(allEducationContent);
    }

    return (
      <div className={`resume-container resume-template-modern spacing-${template.spacing}`}>
        <div className="resume-header">
          <h1>{resumeData.name || 'Your Name'}</h1>
          <div className="contact-info">
            {resumeData.contactInfo.map((contact: string, index: number) => (
              <div key={index} className="contact-item">
                {contact.includes('@') && <span>📧</span>}
                {contact.includes('linkedin') && <span>🔗</span>}
                {/\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}/.test(contact) && <span>📱</span>}
                <span>{contact}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="resume-body">
          <div className="resume-main">
            {resumeData.summary.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">Summary</h2>
                <div className="resume-summary">
                  {resumeData.summary.map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            {experienceItems.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">
                  {resumeData.experience[0]?.title || 'Experience'}
                </h2>
                {experienceItems.map((job: any, i: number) => (
                  <div className="resume-job" key={i}>
                    <div className="resume-job-header">
                      <div>
                        <h3 className="resume-job-title">{job.title}</h3>
                        <div className="resume-job-company">{job.company} {job.location && `• ${job.location}`}</div>
                      </div>
                      <div className="resume-job-date">{job.date}</div>
                    </div>
                    <ul className="resume-bullet-list">
                      {job.bullets.map((bullet: string, j: number) => (
                        <li key={j} className="resume-bullet-item">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            
            {/* Additional sections could go here in the main column */}
            {resumeData.additional.map((section: any, i: number) => (
              <div className="resume-section" key={i}>
                <h2 className="resume-section-title">{section.title}</h2>
                <div>
                  {section.content.map((line: string, j: number) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="resume-sidebar">
            {skills.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">
                  {resumeData.skills[0]?.title || 'Skills'}
                </h2>
                <div className="resume-skills">
                  {skills.map((skill, i) => renderSkillBar(skill))}
                </div>
              </div>
            )}
            
            {educationItems.length > 0 && (
              <div className="resume-section">
                <h2 className="resume-section-title">
                  {resumeData.education[0]?.title || 'Education'}
                </h2>
                {educationItems.map((edu: any, i: number) => (
                  <div className="education-item" key={i}>
                    <h3 className="education-degree">{edu.degree}</h3>
                    <div className="education-institution">{edu.institution}</div>
                    {edu.location && <div className="education-institution">{edu.location}</div>}
                    {edu.date && <div className="education-date">{edu.date}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProfessionalTemplate = () => {
    // This will be implemented in the next phase
    // For now, just render a placeholder
    return <div className="resume-template-professional p-6">Professional template will be implemented soon</div>;
  };

  const renderCreativeTemplate = () => {
    // This will be implemented in the next phase
    // For now, just render a placeholder
    return <div className="resume-template-creative p-6">Creative template will be implemented soon</div>;
  };

  const resumeData = parseResumeContent(currentResume);
  
  const renderTemplatedResume = () => {
    switch(template?.id) {
      case "professional":
        return renderProfessionalTemplate();
      case "creative":
        return renderCreativeTemplate();
      case "modern":
      default:
        return renderModernTemplate(resumeData);
    }
  };
  
  const renderContent = () => {
    if (isPremiumBlurred) {
      return (
        <div className="relative">
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-[2px]"
          >
            <div className="text-center p-6 max-w-md">
              <div className="mx-auto bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <LockIcon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
              <p className="text-slate-600 mb-4">
                Resume rewriting is available on our paid plan.
                Upgrade now to access this feature.
              </p>
              <Button asChild>
                <Link to="/pricing">Upgrade to Paid Plan</Link>
              </Button>
            </div>
          </div>
          <div className="blur-sm opacity-60">
            <div className="h-[500px] overflow-auto">
              {renderTemplatedResume()}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="max-h-[600px] overflow-auto">
        {renderTemplatedResume()}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      {jobContext && (
        <div className="bg-slate-50 p-3 border-b border-slate-100 text-xs text-slate-600 flex flex-wrap gap-2">
          <span className="font-semibold">Industry:</span> {jobContext.industry}
          <span className="mx-1">•</span>
          <span className="font-semibold">Tone:</span> {jobContext.tone}
        </div>
      )}
      {renderContent()}
    </Card>
  );
};

export default ResumeContent;
