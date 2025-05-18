
import React from 'react';
import '@/styles/resumeTemplates.css';

interface ResumeContentProps {
  resumeData: any;
  template: any;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ resumeData, template }) => {
  if (!resumeData) return null;

  // Calculate skill percentages for visualization
  const skills = resumeData.skills.map((skill: string) => {
    // Generate a realistic percentage based on the skill name
    // In a real app, this would come from assessment data
    const percentage = Math.floor(70 + Math.random() * 30);
    return {
      name: skill,
      percentage
    };
  });

  // Function to render bullet points consistently
  const renderBullets = (bullets: string[]) => {
    return bullets.map((bullet, index) => (
      <li key={index} className="job-bullet">{bullet}</li>
    ));
  };

  // Modern template with two-column layout
  if (template.name === 'Modern') {
    return (
      <div className="resume-template-modern">
        {/* Header - spans both columns */}
        <div className="resume-header">
          <h1 className="resume-name">{resumeData.name}</h1>
          <div className="resume-contact">
            <span>{resumeData.location}</span>
            <span>•</span>
            <span>{resumeData.phone}</span>
            <span>•</span>
            <span>{resumeData.email}</span>
          </div>
        </div>
        
        {/* Main Column - Experience and Education */}
        <div className="resume-main-column">
          {/* Summary Section */}
          <div className="resume-summary">
            <h2 className="section-title">SUMMARY</h2>
            <p>{resumeData.summary}</p>
          </div>
          
          {/* Experience Section */}
          <div className="resume-experience">
            <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
            {resumeData.experience.map((job: any, index: number) => (
              <div key={index} className="job">
                <div className="job-header">
                  <div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-company">{job.company}</div>
                  </div>
                  <div className="job-date">{job.date}</div>
                </div>
                <ul className="job-bullets">
                  {renderBullets(job.bullets || [])}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sidebar - Skills, Education, Awards */}
        <div className="resume-sidebar">
          {/* Skills Section */}
          <div className="resume-skills">
            <h2 className="section-title">SKILLS</h2>
            {skills.map((skill: any, index: number) => (
              <div key={index} className="skill-item">
                <div className="skill-name">{skill.name}</div>
                <div className="skill-bar-container">
                  <div 
                    className="skill-bar" 
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
                <div className="skill-percentage">{skill.percentage}%</div>
              </div>
            ))}
          </div>
          
          {/* Education Section */}
          <div className="resume-education">
            <h2 className="section-title">EDUCATION</h2>
            {resumeData.education.map((edu: any, index: number) => (
              <div key={index} className="education-item">
                <div className="degree">{edu.degree}</div>
                <div className="institution">{edu.institution}</div>
                <div className="education-date">{edu.date}</div>
                {edu.gpa && <div className="education-gpa">CGPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
          
          {/* Additional Information */}
          {resumeData.awards && resumeData.awards.length > 0 && (
            <div className="resume-additional">
              <h2 className="section-title">ADDITIONAL INFORMATION</h2>
              <ul className="resume-awards">
                {resumeData.awards.map((award: string, index: number) => (
                  <li key={index} className="award-item">{award}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default fallback
  return (
    <div className="resume-template-default">
      <h1>{resumeData.name}</h1>
      <p>Template not fully implemented yet. Please select another template.</p>
    </div>
  );
};

export default ResumeContent;
