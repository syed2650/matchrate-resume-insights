
import React from "react";
import { Card } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ResumeContentProps {
  currentResume: string;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  isPremiumBlurred?: boolean;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ currentResume, jobContext, isPremiumBlurred = false }) => {
  if (!currentResume) return null;
  
  const formatResume = (content: string) => {
    // Split content by sections
    const sections = content.split(/^(#+\s.*|[A-Z\s]{5,})$/m).filter(Boolean);
    if (sections.length <= 1) {
      return <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</pre>;
    }

    return (
      <div className="space-y-6 font-sans text-sm leading-relaxed">
        {sections.map((section, index) => {
          // Check if this is a heading
          const isHeading = /^(#+\s.*|[A-Z\s]{5,})$/m.test(section);
          
          if (isHeading) {
            // Clean up heading formatting
            const headingText = section
              .replace(/^#+\s*/g, '')
              .replace(/^\s+|\s+$/g, '');
            
            return (
              <h2 
                key={index} 
                className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase"
                id={`section-${headingText.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {headingText}
              </h2>
            );
          } else {
            // Process content section
            const processedContent = section
              .split('\n')
              .map((line, lineIndex) => {
                // Process name at the top (first section, first line)
                if (index === 1 && lineIndex === 0) {
                  return (
                    <div key={lineIndex} className="text-center font-bold text-xl mb-2">
                      {line}
                    </div>
                  );
                }
                
                // Process contact info (typically in the header section)
                if (index === 1 && (lineIndex === 1 || lineIndex === 2) && 
                    (line.includes('@') || line.includes('|') || line.includes('+') || 
                     line.includes('linkedin'))) {
                  return (
                    <div key={lineIndex} className="text-center mb-1 text-slate-700">
                      {line}
                    </div>
                  );
                }
                
                // Check if line is a company or major section header
                if ((line.match(/^[A-Z][a-zA-Z\s]+/) && 
                     !line.match(/^(EDUCATION|SUMMARY|EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS)/i)) ||
                    (line.includes('|') && line.match(/\b(Inc|LLC|Ltd|Company|GmbH)\b/i))) {
                  return (
                    <div key={lineIndex} className="font-bold text-md mt-4 mb-1 flex justify-between">
                      <span>{line.split('|')[0].trim()}</span>
                      {line.includes('|') && (
                        <span className="text-slate-600">{line.split('|')[1].trim()}</span>
                      )}
                    </div>
                  );
                }

                // Check if line is a date range, align to right
                if (line.match(/^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}/) || 
                    line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i) ||
                    line.match(/\d{4}\s*-\s*(Present|Current|\d{4})/i)) {
                  return (
                    <div key={lineIndex} className="text-right text-slate-600 text-sm">
                      {line}
                    </div>
                  );
                }
                
                // Check if line is a job title (usually capitalized and follows company name)
                if (line.match(/^[A-Z][a-zA-Z\s]+$/) && 
                    !line.match(/^(Education|Summary|Experience|Skills|Projects|Certifications)/i)) {
                  return <div key={lineIndex} className="font-semibold mb-2">{line}</div>;
                }

                // Format bullet points consistently
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <div key={lineIndex} className="ml-4 pl-2 relative mb-1.5">
                      <span className="absolute left-0 top-0">•</span>
                      <span>{line.replace(/^[•-]\s*/, '')}</span>
                    </div>
                  );
                }
                
                // Check if line is empty (spacer)
                if (!line.trim()) {
                  return <div key={lineIndex} className="h-2"></div>;
                }
                
                // Default text formatting
                return <div key={lineIndex} className="mb-1">{line}</div>;
              });

            return (
              <div key={index} className="space-y-1">
                {processedContent}
              </div>
            );
          }
        })}
      </div>
    );
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
            <div className="p-6 h-[500px] overflow-auto">
              {formatResume(currentResume)}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6 max-h-[600px] overflow-auto">
        {formatResume(currentResume)}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm print:shadow-none">
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
