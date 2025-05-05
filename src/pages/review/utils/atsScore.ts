
// Re-export the ATS score calculations from atsScoring.ts
import { calculateATSScore as computeATSScore, getATSScoreExplanation, getATSScoreDetail } from './atsScoring';

// Re-export the ATS score explanation functions for easier access
export { getATSScoreExplanation, getATSScoreDetail };

// Export the ATS score calculation function
export function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  return computeATSScore(resumeText, jobDescriptionText);
}

// Generate a stable hash for caching
export function generateHash(resume: string, jobDescription: string): string {
  const str = `${resume?.substring(0, 1000) || ''}::${jobDescription?.substring(0, 1000) || ''}`;
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}
