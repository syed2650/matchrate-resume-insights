
import { useState, useEffect } from "react";

interface UseResumeVersionProps {
  rewrittenResume: any;
  activeVersion?: string;
  scoreHash?: string | null;
}

export const useResumeVersion = ({ 
  rewrittenResume, 
  activeVersion = "general",
  scoreHash = null
}: UseResumeVersionProps) => {
  const [suggestedBulletPoints, setSuggestedBulletPoints] = useState<string[]>([]);
  const [generatedTimestamp, setGeneratedTimestamp] = useState<string>("");
  const [sessionHash, setSessionHash] = useState<string | null>(null);

  useEffect(() => {
    // Try to get hash from session if not provided
    if (!scoreHash) {
      const activeHash = sessionStorage.getItem('active-resume-ats-hash');
      if (activeHash !== null) {
        setSessionHash(activeHash);
      }
    } else if (scoreHash !== sessionHash) {
      // Update session hash when score hash changes to maintain consistency
      setSessionHash(scoreHash);
    }
    
    if (!generatedTimestamp) {
      setGeneratedTimestamp(new Date().toLocaleString());
    }
  }, [rewrittenResume, generatedTimestamp, scoreHash, sessionHash]);

  // Simplify the implementation to only support a single version
  const hasMultipleVersions = false;
  
  const currentResume = typeof rewrittenResume === 'string' 
    ? rewrittenResume 
    : (typeof rewrittenResume === 'object' && rewrittenResume !== null && !Array.isArray(rewrittenResume)
        ? rewrittenResume[activeVersion] || ''
        : '');

  return {
    hasMultipleVersions,
    currentResume,
    suggestedBulletPoints: [],
    generatedTimestamp,
    activeScoreHash: scoreHash || sessionHash
  };
};
