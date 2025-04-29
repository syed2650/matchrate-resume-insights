
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
              <h2 key={index} className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase">{headingText.toUpperCase()}</h2>
            );
          } else {
            // Process content section
            const processedContent = section
              .split('\n')
              .map((line, lineIndex) => {
                // Check if line is part of header (name) - usually at the very top
                if (index === 1 && lineIndex === 0) {
                  return (
                    <div key={lineIndex} className="text-center font-bold text-xl mb-1">
                      {line}
                    </div>
                  );
                }
                
                // Check if line is part of contact info (second line of the resume)
                if (index === 1 && (lineIndex === 1 || lineIndex === 2) && (line.includes('@') || line.includes('|') || line.includes('+') || line.includes('Harrow'))) {
                  return (
                    <div key={lineIndex} className="text-center mb-1">
                      {line}
                    </div>
                  );
                }
                
                // Check if line is a bullet point
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <li key={lineIndex} className="ml-4 list-disc list-outside mb-1">
                      {line.replace(/^[•-]\s*/, '')}
                    </li>
                  );
                }
                
                // Check if line is empty (spacer)
                if (!line.trim()) {
                  return <div key={lineIndex} className="h-2"></div>;
                }
                
                // Check if line is a date range (format varies)
                if (line.match(/^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}/) || 
                    line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i)) {
                  return (
                    <div key={lineIndex} className="text-right font-bold mb-1">
                      {line}
                    </div>
                  );
                }
                
                // Check if line is a company name (usually followed by dates or job title)
                // We'll remove any location info after '•' character
                if ((index > 2 && lineIndex === 0) || 
                    (line.match(/^[A-Z][a-zA-Z\s]+/) && 
                    !line.match(/^(EDUCATION|SUMMARY|EXPERIENCE|SKILLS|RECOGNITION|PROJECTS)/i))) {
                  // Remove location info if present (after the • symbol)
                  const companyNameOnly = line.split('•')[0].trim();
                  return <div key={lineIndex} className="font-bold mb-1">{companyNameOnly}</div>;
                }
                
                // Check if line is job title (usually after company name)
                if (index > 2 && lineIndex === 1 && line.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*/)) {
                  return <div key={lineIndex} className="font-bold mb-2">{line}</div>;
                }
                
                // Education section special formatting
                // Check for education degree
                if (index > 6 && line.match(/^[A-Z][a-zA-Z\s,]+$/) && !line.includes('•')) {
                  return <div key={lineIndex} className="font-bold mb-1">{line}</div>;
                }
                
                // Check for institution name in education section
                if (index > 6 && lineIndex === 1) {
                  return <div key={lineIndex} className="mb-1">{line}</div>;
                }
                
                // Check for country in education (put on next line)
                if (index > 6 && lineIndex === 2 && line.trim()) {
                  return <div key={lineIndex} className="italic mb-1">{line}</div>;
                }
                
                // Check for year in education (put on next line)
                if (index > 6 && lineIndex === 3 && line.trim()) {
                  return <div key={lineIndex} className="font-bold mb-3">{line}</div>;
                }

                // Default formatting - not make all summary text bold
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
