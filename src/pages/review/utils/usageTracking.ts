
/**
 * Utility functions for usage tracking in resume reviews
 */

import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { generateClientFingerprint } from "./fingerprinting";
import { getAnonymousId } from "./idGeneration";

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

// Check if user has reached their daily limit for free feedback
export const canUseFeedback = async (): Promise<boolean> => {
  try {
    const { user } = useAuthUser();
    const anonymousId = getAnonymousId();
    const clientFingerprint = await generateClientFingerprint();
    
    const { data, error } = await supabase.rpc(
      'check_resume_analysis_limit',
      { 
        p_user_id: user?.id || null, 
        p_anonymous_id: anonymousId,
        p_client_fingerprint: clientFingerprint,
        p_ip_address: null // We don't track IP on client side for privacy
      }
    );
    
    if (error) {
      console.error("Error checking usage limit:", error);
      // Default to allowing usage if there's an error checking
      return true;
    }
    
    return data === true;
  } catch (err) {
    console.error("Exception checking usage limit:", err);
    // Default to allowing usage if there's an exception
    return true;
  }
};

// Track usage of the feedback feature
export const trackFeedbackUsage = async (): Promise<void> => {
  try {
    const { user } = useAuthUser();
    const anonymousId = getAnonymousId();
    const clientFingerprint = await generateClientFingerprint();
    
    const { error } = await supabase
      .from('usage_tracking')
      .insert({
        user_id: user?.id || null,
        feature_name: 'resume_analysis',
        anonymous_id: anonymousId,
        client_fingerprint: clientFingerprint,
        ip_address: null,  // We don't track IP on client side for privacy
        action_type: 'used' // Adding required action_type field
      });
    
    if (error) {
      console.error("Error tracking feedback usage:", error);
    }
  } catch (err) {
    console.error("Exception tracking feedback usage:", err);
  }
};

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
