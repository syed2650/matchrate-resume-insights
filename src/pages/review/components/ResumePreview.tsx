
import React from "react";
import { Card } from "@/components/ui/card";
import { ResumeData } from "../utils/standardResumeTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  isPremiumBlurred?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  isPremiumBlurred = false 
}) => {
  if (!data) return null;
  
  const renderContactInfo = () => {
    const contactParts = [];
    if (data.header.location) contactParts.push(data.header.location);
    if (data.header.phone) contactParts.push(data.header.phone);
    if (data.header.email) contactParts.push(data.header.email);
    if (data.header.linkedin) contactParts.push(data.header.linkedin);
    if (data.header.website) contactParts.push(data.header.website);
    
    return contactParts.join(' • ');
  };
  
  return (
    <Card className="overflow-hidden">
      <div className={`p-6 max-h-[600px] overflow-auto font-sans text-sm ${isPremiumBlurred ? 'blur-sm opacity-60' : ''}`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">{data.header.name}</h1>
          <p className="text-slate-600">{renderContactInfo()}</p>
          {data.jobTitle && <p className="font-semibold mt-2">{data.jobTitle}</p>}
        </div>
        
        {/* Summary */}
        {data.summary && data.summary.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Summary</h2>
            {data.summary.map((paragraph, i) => (
              <p key={i} className="mb-2">{paragraph}</p>
            ))}
          </div>
        )}
        
        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">{exp.company}{exp.location ? ` • ${exp.location}` : ''}</span>
                  <span>{exp.dates}</span>
                </div>
                <p className="font-bold">{exp.title}</p>
                <ul className="list-disc pl-5 mt-1">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="mb-1">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-bold">{edu.institution}</span>
                  <span>{edu.dates}</span>
                </div>
                {edu.location && <p>{edu.location}</p>}
                <p className="italic">{edu.degree}</p>
                {edu.details && edu.details.length > 0 && (
                  <ul className="list-disc pl-5 mt-1">
                    {edu.details.map((detail, j) => (
                      <li key={j} className="mb-1">{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Skills */}
        {data.skills && (data.skills.technical?.length || data.skills.soft?.length || data.skills.other?.length) && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Skills</h2>
            
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold">Technical Skills</h3>
                <ul className="list-disc pl-5">
                  {data.skills.technical.map((skill, i) => (
                    <li key={i} className="mb-1">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold">Soft Skills</h3>
                <ul className="list-disc pl-5">
                  {data.skills.soft.map((skill, i) => (
                    <li key={i} className="mb-1">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.skills.other && data.skills.other.length > 0 && (
              <div className="mb-2">
                <h3 className="font-semibold">Additional Skills</h3>
                <ul className="list-disc pl-5">
                  {data.skills.other.map((skill, i) => (
                    <li key={i} className="mb-1">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Certifications</h2>
            {data.certifications.map((cert, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold">{cert.name}{cert.issuer ? ` - ${cert.issuer}` : ''}</p>
                {cert.date && <p className="text-sm">{cert.date}</p>}
              </div>
            ))}
          </div>
        )}
        
        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Projects</h2>
            {data.projects.map((project, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-semibold">{project.name}</p>
                  {project.dates && <span>{project.dates}</span>}
                </div>
                {project.url && (
                  <p className="text-blue-600 hover:underline">
                    <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                  </p>
                )}
                {project.description && <p>{project.description}</p>}
                {project.bullets && project.bullets.length > 0 && (
                  <ul className="list-disc pl-5 mt-1">
                    {project.bullets.map((bullet, j) => (
                      <li key={j} className="mb-1">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Volunteering */}
        {data.volunteering && data.volunteering.length > 0 && (
          <div>
            <h2 className="text-lg font-bold uppercase border-b border-slate-200 pb-1 mb-2">Volunteering & Leadership</h2>
            {data.volunteering.map((vol, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-semibold">{vol.organization}</p>
                  {vol.dates && <span>{vol.dates}</span>}
                </div>
                <p className="font-semibold">{vol.role}{vol.location ? ` • ${vol.location}` : ''}</p>
                {vol.bullets && vol.bullets.length > 0 && (
                  <ul className="list-disc pl-5 mt-1">
                    {vol.bullets.map((bullet, j) => (
                      <li key={j} className="mb-1">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumePreview;
