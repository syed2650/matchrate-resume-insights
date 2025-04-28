
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
              <h2 key={index} className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1">{headingText}</h2>
            );
          } else {
            // Process content section
            const processedContent = section
              .split('\n')
              .map((line, lineIndex) => {
                // Check if line is a bullet point
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <li key={lineIndex} className="ml-4 list-disc list-outside mb-1">
                      {line.replace(/^[•-]\s*/, '')}
                    </li>
                  );
                }
                
                // Check if line is part of contact info or job title (usually at the top)
                if (index < 4 && (line.includes('@') || line.includes('linkedin.com') || line.includes('+') || 
                    line.match(/^\s*[A-Z][a-zA-Z\s]+(\||\-|—)/) || line.trim().length === 0)) {
                  return (
                    <div key={lineIndex} className={line.trim() ? "mb-1" : "my-3"}>
                      {line.trim() ? line : <br/>}
                    </div>
                  );
                }
                
                // Check if line is empty (spacer)
                if (!line.trim()) {
                  return <div key={lineIndex} className="h-2"></div>;
                }
                
                // Check if line is a date range or company name
                if (line.match(/^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}/) || 
                    line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i)) {
                  return <div key={lineIndex} className="text-slate-500 italic mb-1">{line}</div>;
                }
                
                // Check if line is a job title or organization
                if (line.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/)) {
                  return <div key={lineIndex} className="font-medium mb-1">{line}</div>;
                }

                // Default formatting
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
