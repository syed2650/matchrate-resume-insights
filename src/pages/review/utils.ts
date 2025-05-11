import { supabase } from "@/integrations/supabase/client";

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
    const { data: authData } = await supabase.auth.getSession();
    if (authData.session) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_lifetime_premium')
        .eq('id', authData.session.user.id)
        .single();
      
      if (profileData && profileData.is_lifetime_premium) {
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
      month: month
    }
  };
};

export const canUseFeedback = () => {
  const stats = getUsageStats();
  return stats.plan === 'free' ? stats.daily.count < 1 : true;
};

export const canUseRewrite = () => {
  const stats = getUsageStats();
  
  // Check for lifetime premium users
  if (stats.plan === 'paid') {
    const { data: authData } = supabase.auth.getSession();
    if (authData.session) {
      const { data: profileData } = supabase
        .from('profiles')
        .select('is_lifetime_premium')
        .eq('id', authData.session.user.id)
        .single();
      
      // Lifetime premium users have unlimited rewrites
      if (profileData && profileData.is_lifetime_premium) {
        return true;
      }
    }
    
    // Regular premium users have 15 rewrites per month
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
      const { data: authData } = await supabase.auth.getSession();
      if (authData.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_lifetime_premium')
          .eq('id', authData.session.user.id)
          .single();
        
        // Reset counters for lifetime premium users
        if (profileData && profileData.is_lifetime_premium) {
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
export const trackRewriteUsage = () => {
  const plan = localStorage.getItem('user-plan');
  if (plan === 'paid') {
    // Check if the user is lifetime premium
    const checkAndTrack = async () => {
      const { data: authData } = await supabase.auth.getSession();
      if (authData.session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('is_lifetime_premium')
          .eq('id', authData.session.user.id)
          .single();
        
        // Don't track usage for lifetime premium users
        if (profileData && profileData.is_lifetime_premium) {
          return;
        }
        
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
