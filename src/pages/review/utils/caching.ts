
/**
 * Utility functions for ATS score caching
 */

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

// Cache management functions for ATS scores
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
        timestamp: new Date().toISOString()
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

export function getActiveResumeATSHash(): string | null {
  return sessionStorage.getItem('activeResumeATSHash');
}
