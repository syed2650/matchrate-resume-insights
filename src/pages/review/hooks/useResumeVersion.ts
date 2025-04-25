
import { useState, useEffect } from "react";
import { getActiveResumeATSHash } from "../utils";

interface UseResumeVersionProps {
  rewrittenResume: any;
  activeVersion?: string;
  scoreHash?: string | null;
}

export const useResumeVersion = ({ 
  rewrittenResume, 
  activeVersion = "startup",
  scoreHash = null
}: UseResumeVersionProps) => {
  const [suggestedBulletPoints, setSuggestedBulletPoints] = useState<string[]>([]);
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("");
  const [sessionHash, setSessionHash] = useState<string | null>(null);

  useEffect(() => {
    // Try to get hash from session if not provided
    if (!scoreHash) {
      const activeHash = getActiveResumeATSHash();
      if (activeHash) {
        setSessionHash(activeHash);
      }
    }
    
    if (!generatedTimestamp) {
      setGeneratedTimestamp(new Date().toLocaleString());
    }
  }, [rewrittenResume, generatedTimestamp, scoreHash]);

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
    generatedTimestamp,
    activeScoreHash: scoreHash || sessionHash
  };
};
