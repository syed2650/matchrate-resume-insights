
/**
 * Main utilities re-export file for resume reviews
 */

// Re-export from the atsScoring module
import { calculateATSScore as computeATSScore, getATSScoreExplanation, getATSScoreDetail } from './atsScoring';

// Re-export from the caching module
export { 
  generateHash,
  saveATSScoreToCache, 
  getATSScoresFromCache,
  getATSScoreFromCache,
  clearATSScoreCache,
  storeActiveResumeATSScore,
  getActiveResumeATSHash
} from './caching';

// Re-export from the keywords module
export { extractKeywords } from './keywords';

// Re-export from the fingerprinting module
export { 
  generateClientFingerprint,
  getOrCreateClientId,
  getClientIp
} from './fingerprinting';

// Re-export from the usageTracking module
export {
  type UsageStats,
  getUsageStats,
  canUseFeedback,
  trackFeedbackUsage,
  trackRewriteUsage,
  canUseRewrite,
  setUserPlan,
  getRemainingUsage,
  resetUsageStats
} from './usageTracking';

// Re-export the ATS score explanation functions for easier access
export { getATSScoreExplanation, getATSScoreDetail };

// Export the ATS score calculation function
export function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  return computeATSScore(resumeText, jobDescriptionText);
}
