
import { useState, useEffect } from "react";

interface UseResumeVersionProps {
  rewrittenResume: any;
  activeVersion?: string;
}

export const useResumeVersion = ({ rewrittenResume, activeVersion = "startup" }: UseResumeVersionProps) => {
  const [suggestedBulletPoints, setSuggestedBulletPoints] = useState<string[]>([]);
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("");

  useEffect(() => {
    if (!generatedTimestamp) {
      setGeneratedTimestamp(new Date().toLocaleString());
    }
  }, [rewrittenResume, generatedTimestamp]);

  useEffect(() => {
    if (rewrittenResume) {
      const extractBullets = (text: string): string[] => {
        const bulletPattern = /^(?:\*|\-)\s+(.+?)$/gm;
        const bullets: string[] = [];
        let match;
        
        while ((match = bulletPattern.exec(text)) !== null) {
          if (match[1]) bullets.push(match[1]);
        }
        
        return bullets.slice(0, 8);
      };
      
      const hasMultipleVersions = typeof rewrittenResume === 'object' && 
                             rewrittenResume !== null &&
                             !Array.isArray(rewrittenResume) &&
                             Object.keys(rewrittenResume).length > 1;
      
      const currentResumeText = hasMultipleVersions 
        ? rewrittenResume[activeVersion] || ''
        : (typeof rewrittenResume === 'string' ? rewrittenResume : '');
      
      setSuggestedBulletPoints(extractBullets(currentResumeText));
    }
  }, [rewrittenResume, activeVersion]);

  const hasMultipleVersions = typeof rewrittenResume === 'object' && 
                             rewrittenResume !== null &&
                             !Array.isArray(rewrittenResume) &&
                             Object.keys(rewrittenResume).length > 1;
  
  const currentResume = hasMultipleVersions 
    ? rewrittenResume[activeVersion] || ''
    : typeof rewrittenResume === 'string' ? rewrittenResume : '';

  return {
    hasMultipleVersions,
    currentResume,
    suggestedBulletPoints,
    generatedTimestamp
  };
};
