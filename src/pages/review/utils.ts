/**
 * Utility functions for resume reviews
 */

import { calculateATSScore as computeATSScore, getATSScoreExplanation, getATSScoreDetail } from './utils/atsScoring';
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";

// Re-export the ATS score explanation functions for easier access
export { getATSScoreExplanation, getATSScoreDetail };

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
  
  // Return top keywords
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

// Export the ATS score calculation function
export function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  return computeATSScore(resumeText, jobDescriptionText);
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
  // Fixed to return the value from sessionStorage instead of setting it
  return sessionStorage.getItem('activeResumeATSHash');
}

// Client fingerprint generation (basic version)
function generateClientFingerprint(): string {
  try {
    // Use screen properties, timezone, and other browser features
    const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const platform = navigator.platform;
    
    // Combine these values to create a fingerprint
    const combinedData = `${screenData}|${timeZone}|${language}|${platform}`;
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < combinedData.length; i++) {
      const char = combinedData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  } catch (e) {
    // Fallback if anything fails
    return Math.random().toString(36).substring(2, 15);
  }
}

// Get or create a client ID that persists across sessions
function getOrCreateClientId(): string {
  try {
    // Try to get existing client ID from localStorage
    let clientId = localStorage.getItem('client_id');
    
    // If not found, create one and store it
    if (!clientId) {
      clientId = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
      localStorage.setItem('client_id', clientId);
    }
    
    return clientId;
  } catch (e) {
    // If localStorage fails, return a random ID (will not persist)
    return Math.random().toString(36).substring(2, 15);
  }
}

// Function to get the client's IP address (will use the edge function to get it)
async function getClientIp(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (e) {
    return null;
  }
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
      
      // Set next reset date to first day of next month
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      stats.monthly.resetDate = nextMonth.toISOString();
      
      // Save the updated stats with reset counters
      localStorage.setItem('usageStats', JSON.stringify(stats));
    }
    
    return stats;
  } catch (error) {
    console.error("Error retrieving usage stats:", error);
    return defaultStats;
  }
}

// Check if user can use feedback - enhanced with server-side validation
export async function canUseFeedback(): Promise<boolean> {
  try {
    // Get user information if logged in
    const { user } = useAuthUser();
    
    // Get client fingerprinting data
    const clientFingerprint = generateClientFingerprint();
    const clientId = getOrCreateClientId();
    
    // Call the edge function to check if usage is allowed
    const response = await fetch('https://rodkrpeqxgqizngdypbl.functions.supabase.co/check-usage-limits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': user ? `Bearer ${supabase.auth.getSession()}` : '',
      },
      body: JSON.stringify({
        anonymousId: clientId,
        fingerprint: {
          data: clientFingerprint
        },
        feature: 'resume_analysis'
      })
    });
    
    if (!response.ok) {
      // If server-side check fails, fall back to client-side check
      console.error('Failed to verify usage limits with server, falling back to local check');
      return fallbackCanUseFeedback();
    }
    
    const data = await response.json();
    return data.canUse;
    
  } catch (error) {
    console.error("Error checking feedback usage limits:", error);
    // On error, fall back to client-side check
    return fallbackCanUseFeedback();
  }
}

// Fallback to client-side check when server check fails
function fallbackCanUseFeedback(): boolean {
  const stats = getUsageStats();
  
  // For free users, limit to 1 per day
  if (stats.plan === 'free') {
    return stats.daily.count < 1;
  }
  
  // For paid users, limit to 30 per month
  return stats.monthly.feedbacks < 30;
}

// Track a feedback usage with enhanced server tracking
export async function trackFeedbackUsage(): boolean {
  try {
    // Always update local stats first for immediate feedback
    const stats = getUsageStats();
    stats.daily.count += 1;
    stats.monthly.feedbacks += 1;
    localStorage.setItem('usageStats', JSON.stringify(stats));
    
    // Return true as we've updated local stats
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

// Check if user can perform more rewrite operations
export function canUseRewrite(): boolean {
  const stats = getUsageStats();
  
  // Rewrite feature is only available for paid users
  if (stats.plan === 'free') {
    return false;
  }
  
  // For paid users, limit to 15 rewrites per month
  return stats.monthly.rewrites < 15;
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

// Get remaining usage counts
export function getRemainingUsage(): { feedbacks: number; rewrites: number } {
  const stats = getUsageStats();
  
  if (stats.plan === 'free') {
    // Free plan: 1 per day, no rewrites
    return {
      feedbacks: Math.max(0, 1 - stats.daily.count),
      rewrites: 0
    };
  } else {
    // Paid plan: 30 feedbacks, 15 rewrites per month
    return {
      feedbacks: Math.max(0, 30 - stats.monthly.feedbacks),
      rewrites: Math.max(0, 15 - stats.monthly.rewrites)
    };
  }
}

// Reset usage stats (for testing)
export function resetUsageStats(): void {
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
  
  localStorage.setItem('usageStats', JSON.stringify(defaultStats));
}
