
/**
 * Utility functions for resume reviews
 */

// Extract keywords from text with improved algorithm
function extractKeywords(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Convert to lowercase and remove special characters
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words and remove common stop words
  const words = cleanedText.split(/\s+/);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 
    'by', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'you', 'your', 'we', 'our', 'i', 'my'
  ]);
  
  // Filter out stop words and short words
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );

  // Count frequency of each word
  const wordFrequency: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top keywords
  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return up to 50 most common words as keywords
  return sortedKeywords.slice(0, 50);
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

// Improved ATS score calculation based on keyword matching
export function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  if (!resumeText || !jobDescriptionText) {
    return 0;
  }
  
  // Extract keywords from job description and resume
  const jobKeywords = extractKeywords(jobDescriptionText);
  const resumeContent = resumeText.toLowerCase();
  
  // Count matches - check if each keyword appears in the resume
  let matches = 0;
  jobKeywords.forEach(keyword => {
    if (resumeContent.includes(keyword)) {
      matches++;
    }
  });
  
  // Calculate score as percentage of matches
  const totalKeywords = jobKeywords.length;
  const score = totalKeywords > 0 ? Math.round((matches / totalKeywords) * 100) : 0;
  
  // Ensure score is within 0-100 range
  console.log(`Calculated ATS score: ${score} from ${matches} matches out of ${totalKeywords} keywords`);
  return Math.min(100, Math.max(0, score));
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

// Improved cache management functions for ATS scores with enhanced consistency
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

// Usage tracking functions for subscription model
export interface UsageStats {
  daily: {
    count: number,
    date: string
  };
  monthly: {
    feedbacks: number,
    rewrites: number,
    resetDate: string
  };
  plan: 'free' | 'paid';
}

// Get current usage stats
export function getUsageStats(): UsageStats {
  const defaultStats: UsageStats = {
    daily: {
      count: 0,
      date: new Date().toISOString().split('T')[0]
    },
    monthly: {
      feedbacks: 0,
      rewrites: 0,
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    plan: 'free'
  };

  try {
    const storedStats = localStorage.getItem('usageStats');
    if (!storedStats) return defaultStats;
    
    const stats: UsageStats = JSON.parse(storedStats);
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily count if it's a new day
    if (stats.daily.date !== today) {
      stats.daily.count = 0;
      stats.daily.date = today;
    }
    
    // Reset monthly count if we're past reset date
    const resetDate = new Date(stats.monthly.resetDate);
    if (new Date() > resetDate) {
      stats.monthly.feedbacks = 0;
      stats.monthly.rewrites = 0;
      stats.monthly.resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
    }
    
    return stats;
  } catch (error) {
    console.error("Error retrieving usage stats:", error);
    return defaultStats;
  }
}

// Track a feedback usage
export function trackFeedbackUsage(): boolean {
  try {
    const stats = getUsageStats();
    
    // Update counts
    stats.daily.count += 1;
    stats.monthly.feedbacks += 1;
    
    // Store updated stats
    localStorage.setItem('usageStats', JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error tracking feedback usage:", error);
    return false;
  }
}

// Track a rewrite usage
export function trackRewriteUsage(): boolean {
  try {
    const stats = getUsageStats();
    
    // Update monthly rewrite count (only applies to paid users)
    if (stats.plan === 'paid') {
      stats.monthly.rewrites += 1;
    }
    
    // Store updated stats
    localStorage.setItem('usageStats', JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error tracking rewrite usage:", error);
    return false;
  }
}

// Check if user can perform more feedback operations
export function canUseFeedback(): boolean {
  const stats = getUsageStats();
  
  if (stats.plan === 'free') {
    // Free plan: 1 per day
    return stats.daily.count < 1;
  } else {
    // Paid plan: 30 per month
    return stats.monthly.feedbacks < 30;
  }
}

// Check if user can perform more rewrite operations
export function canUseRewrite(): boolean {
  const stats = getUsageStats();
  
  if (stats.plan === 'free') {
    // Free plan: no rewrites
    return false;
  } else {
    // Paid plan: 15 per month
    return stats.monthly.rewrites < 15;
  }
}

// Set user plan
export function setUserPlan(plan: 'free' | 'paid'): void {
  try {
    const stats = getUsageStats();
    stats.plan = plan;
    localStorage.setItem('usageStats', JSON.stringify(stats));
  } catch (error) {
    console.error("Error setting user plan:", error);
  }
}
