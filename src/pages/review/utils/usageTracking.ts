
/**
 * Utility functions for tracking feature usage
 */

import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { generateClientFingerprint, getOrCreateClientId } from "./fingerprinting";

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
export async function trackFeedbackUsage(): Promise<boolean> {
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
