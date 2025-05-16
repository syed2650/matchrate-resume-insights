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
 * Sets the user's plan
 */
export const setUserPlan = (plan: string) => {
  if (typeof window !== "undefined") localStorage.setItem('user-plan', plan);
};

/**
 * Gets the user's current plan
 */
export const getUserPlan = async () => {
  try {
    const storedPlan = typeof window !== "undefined" && localStorage.getItem('user-plan');
    if (storedPlan) return storedPlan;

    const authData = typeof window !== "undefined"
      ? await supabase.auth.getSession()
      : { data: { session: null } };

    if (authData?.data?.session) {
      const profileData = await supabase
        .from('profiles')
        .select('is_lifetime_premium')
        .eq('id', authData.data.session.user.id)
        .single();

      if (profileData?.data?.is_lifetime_premium) {
        setUserPlan('paid');
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
 * Resets daily usage count
 */
export const resetUsageStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  if (typeof window !== "undefined") localStorage.removeItem(dailyKey);
};

/**
 * Gets the user's usage statistics
 */
export const getUsageStats = () => {
  const plan = typeof window !== "undefined" ? localStorage.getItem('user-plan') : 'free';

  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  const dailyCount = parseInt(
    (typeof window !== "undefined" && localStorage.getItem(dailyKey)) || '0',
    10
  );

  const month = new Date().toISOString().slice(0, 7);
  const monthlyKey = `premium-usage-${month}`;
  const monthlyData = JSON.parse(
    (typeof window !== "undefined" && localStorage.getItem(monthlyKey)) || '{"feedbacks":0,"rewrites":0}'
  );

  getUserPlan().catch(console.error);

  return {
    plan: plan || 'free',
    daily: {
      count: dailyCount,
      date: today,
    },
    monthly: {
      feedbacks: monthlyData.feedbacks || 0,
      rewrites: monthlyData.rewrites || 0,
      month: month,
      resetDate: getMonthlyResetDate(),
    },
  };
};

/**
 * Returns the monthly reset date
 */
export const getMonthlyResetDate = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
};

/**
 * Debug helper
 */
export const debugUsageStats = () => {
  const stats = getUsageStats();
  console.log('Usage Stats:', stats);
  return stats;
};

/**
 * Resume ATS hash
 */
export const getActiveResumeATSHash = (): string | null => {
  return typeof window !== "undefined" ? sessionStorage.getItem('active-resume-ats-hash') : null;
};

export const canUseFeedback = () => {
  const stats = getUsageStats();
  return stats.plan === 'free' ? stats.daily.count < 1 : true;
};

/**
 * Track resume analysis usage
 */
export const trackFeedbackUsage = () => {
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  const currentCount = parseInt(
    (typeof window !== "undefined" && localStorage.getItem(dailyKey)) || '0',
    10
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(dailyKey, (currentCount + 1).toString());
  }

  const plan = typeof window !== "undefined" && localStorage.getItem('user-plan');
  if (plan === 'paid') {
    const month = new Date().toISOString().slice(0, 7);
    const monthlyKey = `premium-usage-${month}`;
    const monthlyData = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem(monthlyKey)) || '{"feedbacks":0,"rewrites":0}'
    );
    monthlyData.feedbacks += 1;
    typeof window !== "undefined" && localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));

    const checkLifetimePremium = async () => {
      const authData = await supabase.auth.getSession();
      if (authData.data.session) {
        const profileData = await supabase
          .from('profiles')
          .select('is_lifetime_premium')
          .eq('id', authData.data.session.user.id)
          .single();

        if (profileData.data?.is_lifetime_premium) {
          const resetData = { feedbacks: 0, rewrites: 0 };
          typeof window !== "undefined" &&
            localStorage.setItem(monthlyKey, JSON.stringify(resetData));
        }
      }
    };

    checkLifetimePremium().catch(console.error);
  }
};

/**
 * Track resume rewrite usage
 */
export const trackRewriteUsage = () => {
  const plan = typeof window !== "undefined" && localStorage.getItem('user-plan');
  if (plan === 'paid') {
    const month = new Date().toISOString().slice(0, 7);
    const monthlyKey = `premium-usage-${month}`;
    const monthlyData = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem(monthlyKey)) || '{"feedbacks":0,"rewrites":0}'
    );
    monthlyData.rewrites += 1;
    typeof window !== "undefined" &&
      localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));
  }
};
