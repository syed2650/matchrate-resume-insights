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

// Cache management functions for ATS scores with improved error handling
export function saveATSScoreToCache(hash: string, scores: Record<string, number>) {
  try {
    // Get existing cache
    let cachedScores = getATSScoresFromCache();
    
    // Find existing entry or add new one
    const existingIndex = cachedScores.findIndex(item => item.hash === hash);
    if (existingIndex >= 0) {
      cachedScores[existingIndex] = {
        hash,
        scores,
        timestamp: new Date().toISOString() // Use ISO string format for better consistency
      };
    } else {
      cachedScores.push({
        hash,
        scores,
        timestamp: new Date().toISOString()
      });
    }
    
    // Limit cache size to prevent localStorage bloat
    if (cachedScores.length > 50) {
      cachedScores = cachedScores.slice(-50);
    }
    
    // Save updated cache
    localStorage.setItem('cachedATSScores', JSON.stringify(cachedScores));
    console.log(`Saved ATS scores for hash: ${hash} to cache`);
    return true;
  } catch (error) {
    console.error("Error saving ATS score to cache:", error);
    return false;
  }
}

export function getATSScoresFromCache() {
  try {
    const storedScores = localStorage.getItem('cachedATSScores');
    const parsedScores = storedScores ? JSON.parse(storedScores) : [];
    console.log(`Retrieved ${parsedScores.length} cached ATS scores`);
    return parsedScores;
  } catch (error) {
    console.error("Error loading cached scores:", error);
    return [];
  }
}

export function getATSScoreFromCache(hash: string) {
  try {
    const cachedScores = getATSScoresFromCache();
    const result = cachedScores.find(item => item.hash === hash);
    if (result) {
      console.log(`Found cached ATS scores for hash: ${hash} from ${result.timestamp}`);
    } else {
      console.log(`No cached ATS scores found for hash: ${hash}`);
    }
    return result;
  } catch (error) {
    console.error("Error retrieving ATS score from cache:", error);
    return null;
  }
}

export function clearATSScoreCache() {
  try {
    localStorage.removeItem('cachedATSScores');
    return true;
  } catch (error) {
    console.error("Error clearing ATS score cache:", error);
    return false;
  }
}

// Session storage function to maintain score during session
export function storeActiveResumeATSScore(resumeJobHash: string) {
  try {
    sessionStorage.setItem('activeResumeATSHash', resumeJobHash);
    return true;
  } catch (error) {
    console.error("Error storing active resume hash:", error);
    return false;
  }
}

export function getActiveResumeATSHash() {
  return sessionStorage.getItem('activeResumeATSHash');
}
