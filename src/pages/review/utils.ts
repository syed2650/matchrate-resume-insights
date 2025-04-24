
/**
 * Utility functions for resume reviews
 */

// Hash generation function for caching ATS scores
export function generateHash(resume: string, jobDescription: string): string {
  // Simple hash function for string combination
  const str = `${resume}::${jobDescription}`;
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}

export function getATSScoreExplanation(score: number): string {
  if (score >= 90) {
    return "This resume is highly optimized for ATS systems with excellent keyword matching, clear structure, and professional formatting.";
  } else if (score >= 80) {
    return "This resume has good ATS compatibility with strong keyword usage and proper section formatting.";
  } else if (score >= 70) {
    return "This resume has adequate ATS compatibility but could improve keyword alignment and section structure.";
  } else {
    return "This resume needs optimization for ATS systems, including better keyword matching and clearer section formatting.";
  }
}

// Detailed calculation explanation for transparency
export function getATSScoreDetail(score: number): string {
  if (score >= 90) {
    return "Score calculated based on excellent keyword density, proper section headings, and ATS-friendly formatting. Minimal improvements needed.";
  } else if (score >= 80) {
    return "Score reflects good keyword alignment with job requirements and clear section structure, though some formatting improvements could further optimize scanning.";
  } else if (score >= 70) {
    return "Score indicates adequate keyword presence but suboptimal section organization and formatting that could be improved for better ATS performance.";
  } else {
    return "Score shows significant gaps in keyword alignment, improper formatting, or missing crucial sections that ATS systems require for successful scanning.";
  }
}
