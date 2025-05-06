
import { supabase } from "@/integrations/supabase/client";
import { getOrCreateClientId } from "./fingerprinting";

// Define the shape of our usage stats
export interface UsageStats {
  feedback: number;
  rewrite: number;
  timestamp: string;
  lastUsedFeedback?: string;
  lastUsedRewrite?: string;
  plan?: string;
}

// Constants for usage limits
const FREE_FEEDBACK_LIMIT = 1;
const FREE_REWRITE_LIMIT = 0;
const PREMIUM_FEEDBACK_LIMIT = 999;
const PREMIUM_REWRITE_LIMIT = 999;

// Local storage keys
const USAGE_KEY = 'usage_stats';
const PLAN_KEY = 'user_plan';

// Get usage stats from local storage or create new ones
export function getUsageStats(): UsageStats {
  try {
    const storedStats = localStorage.getItem(USAGE_KEY);
    if (storedStats) {
      return JSON.parse(storedStats);
    }
  } catch (e) {
    console.error("Error retrieving usage stats:", e);
  }

  // Default empty stats
  return {
    feedback: 0,
    rewrite: 0,
    timestamp: new Date().toISOString().split('T')[0], // current date
    plan: getPlan()
  };
}

// Save updated usage stats to local storage
function saveUsageStats(stats: UsageStats): void {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Error saving usage stats:", e);
  }
}

// Get the user's current plan
function getPlan(): string {
  try {
    return localStorage.getItem(PLAN_KEY) || 'free';
  } catch (e) {
    return 'free';
  }
}

// Set the user's plan
export function setUserPlan(plan: string): void {
  try {
    localStorage.setItem(PLAN_KEY, plan);
    const stats = getUsageStats();
    stats.plan = plan;
    saveUsageStats(stats);
  } catch (e) {
    console.error("Error setting user plan:", e);
  }
}

// Check if the user has used up their feedback quota
export async function canUseFeedback(): Promise<boolean> {
  try {
    // Get the client ID for tracking
    const clientId = getOrCreateClientId();
    const stats = getUsageStats();
    const plan = stats.plan || 'free';
    
    // Check if usage limits need to be reset (new day)
    const today = new Date().toISOString().split('T')[0];
    if (stats.timestamp !== today) {
      // Reset counts for a new day
      stats.feedback = 0;
      stats.rewrite = 0;
      stats.timestamp = today;
      saveUsageStats(stats);
      return true;
    }
    
    // Check against the appropriate limit based on plan
    const limit = plan === 'premium' ? PREMIUM_FEEDBACK_LIMIT : FREE_FEEDBACK_LIMIT;
    return stats.feedback < limit;
  } catch (error) {
    console.error("Error checking feedback usage limits:", error);
    // Default to allowing usage if there's an error checking
    return true;
  }
}

// Track usage of the feedback feature
export async function trackFeedbackUsage(): Promise<void> {
  try {
    const stats = getUsageStats();
    stats.feedback += 1;
    stats.lastUsedFeedback = new Date().toISOString();
    saveUsageStats(stats);
  } catch (error) {
    console.error("Error tracking feedback usage:", error);
  }
}

// Check if the user has used up their rewrite quota
export async function canUseRewrite(): Promise<boolean> {
  try {
    const stats = getUsageStats();
    const plan = stats.plan || 'free';
    
    // Check if usage limits need to be reset (new day)
    const today = new Date().toISOString().split('T')[0];
    if (stats.timestamp !== today) {
      // Reset counts for a new day
      stats.feedback = 0;
      stats.rewrite = 0;
      stats.timestamp = today;
      saveUsageStats(stats);
      return plan === 'premium'; // Only premium users can use rewrite
    }
    
    // Check against the appropriate limit based on plan
    const limit = plan === 'premium' ? PREMIUM_REWRITE_LIMIT : FREE_REWRITE_LIMIT;
    return stats.rewrite < limit;
  } catch (error) {
    console.error("Error checking rewrite usage limits:", error);
    return false;
  }
}

// Track usage of the rewrite feature
export async function trackRewriteUsage(): Promise<void> {
  try {
    const stats = getUsageStats();
    stats.rewrite += 1;
    stats.lastUsedRewrite = new Date().toISOString();
    saveUsageStats(stats);
  } catch (error) {
    console.error("Error tracking rewrite usage:", error);
  }
}

// Get remaining usage for the current day
export function getRemainingUsage(): { feedback: number; rewrite: number } {
  try {
    const stats = getUsageStats();
    const plan = stats.plan || 'free';
    
    const feedbackLimit = plan === 'premium' ? PREMIUM_FEEDBACK_LIMIT : FREE_FEEDBACK_LIMIT;
    const rewriteLimit = plan === 'premium' ? PREMIUM_REWRITE_LIMIT : FREE_REWRITE_LIMIT;
    
    return {
      feedback: Math.max(0, feedbackLimit - stats.feedback),
      rewrite: Math.max(0, rewriteLimit - stats.rewrite)
    };
  } catch (error) {
    console.error("Error calculating remaining usage:", error);
    return { feedback: 0, rewrite: 0 };
  }
}

// Reset usage stats (for testing)
export function resetUsageStats(): void {
  try {
    const plan = getPlan();
    const emptyStats: UsageStats = {
      feedback: 0,
      rewrite: 0,
      timestamp: new Date().toISOString().split('T')[0],
      plan
    };
    saveUsageStats(emptyStats);
  } catch (error) {
    console.error("Error resetting usage stats:", error);
  }
}
