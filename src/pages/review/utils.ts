
import { supabase } from "@/integrations/supabase/client";

/**
 * Converts bytes to a human-readable file size string
 */
export const bytesToSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets the user's current plan
 */
export const getUserPlan = async () => {
  try {
    // Check local storage first for faster response
    const storedPlan = localStorage.getItem('user-plan');
    if (storedPlan) {
      return storedPlan;
    }

    // Check if the user is lifetime premium
    const authData = await supabase.auth.getSession();
    if (authData.data.session) {
      const profileData = await supabase
        .from('profiles')
        .select('is_lifetime_premium')
        .eq('id', authData.data.session.user.id)
        .single();
      
      if (profileData.data && profileData.data.is_lifetime_premium) {
        setUserPlan('paid'); // Set paid plan for lifetime premium users
        return 'paid';
      }
    }

    return 'free';
  } catch (error) {
    console.error("Error checking user plan:", error);
    return 'free';
  }
};

/**
 * Sets the user's plan
 */
export const setUserPlan = (plan: string) => {
  localStorage.setItem('user-plan', plan);
};

/**
 * Resets the usage stats for the current day
 */
export const resetUsageStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  localStorage.removeItem(dailyKey);
};

/**
 * Gets the user's usage statistics
 */
export const getUsageStats = () => {
  // Check if the user has a premium plan
  const plan = localStorage.getItem('user-plan');
  
  // Daily usage tracking
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyKey = `usage-count-${today}`;
  const dailyCount = parseInt(localStorage.getItem(dailyKey) || '0', 10);
  
  // Monthly usage tracking (for premium features)
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyKey = `premium-usage-${month}`;
  const monthlyData = JSON.parse(localStorage.getItem(monthlyKey) || '{"feedbacks": 0, "rewrites": 0}');
  
  // Get updated plan status from server
  getUserPlan().catch(console.error); // Refresh plan status in background
  
  return {
    plan: plan || 'free',
    daily: {
      count: dailyCount,
      date: today
    },
    monthly: {
      feedbacks: monthlyData.feedbacks || 0,
      rewrites: monthlyData.rewrites || 0,
      month: month,
      resetDate: getMonthlyResetDate() // Add reset date
    }
  };
};

/**
 * Get the date when monthly limits reset
 */
export const getMonthlyResetDate = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * For debugging usage stats
 */
export const debugUsageStats = () => {
  const stats = getUsageStats();
  console.log('Usage Stats:', stats);
  return stats;
};

/**
 * Get active resume ATS hash from session
 */
export const getActiveResumeATSHash = (): string | null => {
  return sessionStorage.getItem('active-resume-ats-hash');
};

export const canUseFeedback = () => {
  const stats = getUsageStats();
  return stats.plan === 'free' ? stats.daily.count < 1 : true;
};

}
      
      // Regular premium users have 15 rewrites per month
      return stats.monthly.rewrites < 15;
    };
    
    // For immediate response, check based on current data
    // The async check will update in the background
    checkLifetimePremium().catch(console.error);
    return stats.monthly.rewrites < 15;
  }
  
  // Free plan users cannot use rewrites
  return false;
};

/**
 * Track usage of the resume analysis feature
 */
export const trackFeedbackUsage = () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyKey = `usage-count-${today}`;
  const currentCount = parseInt(localStorage.getItem(dailyKey) || '0', 10);
  localStorage.setItem(dailyKey, (currentCount + 1).toString());
  
  // For premium users, also track monthly usage
  const plan = localStorage.getItem('user-plan');
  if (plan === 'paid') {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyKey = `premium-usage-${month}`;
    const monthlyData = JSON.parse(localStorage.getItem(monthlyKey) || '{"feedbacks": 0, "rewrites": 0}');
    monthlyData.feedbacks += 1;
    localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));
    
    // But don't count usages for lifetime premium users
    const checkLifetimePremium = async () => {
      const authData = await supabase.auth.getSession();
      if (authData.data.session) {
        const profileData = await supabase
          .from('profiles')
          .select('is_lifetime_premium')
          .eq('id', authData.data.session.user.id)
          .single();
        
        // Reset counters for lifetime premium users
        if (profileData.data && profileData.data.is_lifetime_premium) {
          const monthlyData = {"feedbacks": 0, "rewrites": 0};
          localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));
        }
      }
    };
    
    // Check in the background
    checkLifetimePremium().catch(console.error);
  }
};

/**
 * Track usage of the resume rewrite feature
 */
// For regular premium users, track monthly usage
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const monthlyKey = `premium-usage-${month}`;
        const monthlyData = JSON.parse(localStorage.getItem(monthlyKey) || '{"feedbacks": 0, "rewrites": 0}');
        monthlyData.rewrites += 1;
        localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));
      }
    };
    
    checkAndTrack().catch(console.error);
  }
};
