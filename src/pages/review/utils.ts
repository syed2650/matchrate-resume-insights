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
  if (typeof window !== "undefined") {
    localStorage.setItem('user-plan', plan);
  }
};

/**
 * Gets the user's usage statistics
 */
export const getUsageStats = () => {
  if (typeof window === "undefined") return {
    plan: 'free',
    daily: { count: 0, date: '' },
    monthly: { feedbacks: 0, rewrites: 0, month: '', resetDate: '' }
  };

  const plan = localStorage.getItem('user-plan');
  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  const dailyCount = parseInt(localStorage.getItem(dailyKey) || '0', 10);

  const month = new Date().toISOString().slice(0, 7);
  const monthlyKey = `premium-usage-${month}`;
  const monthlyData = JSON.parse(localStorage.getItem(monthlyKey) || '{"feedbacks": 0, "rewrites": 0}');

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
      resetDate: getMonthlyResetDate()
    }
  };
};

/**
 * Get the date when monthly limits reset
 */
export const getMonthlyResetDate = (): string => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
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
  return typeof window !== "undefined"
    ? sessionStorage.getItem('active-resume-ats-hash')
    : null;
};

/**
 * Can use feedback check
 */
export const canUseFeedback = () => {
  const stats = getUsageStats();
  return stats.plan === 'free' ? stats.daily.count < 1 : true;
};

/**
 * Track usage of the resume analysis feature
 */
export const trackFeedbackUsage = () => {
  if (typeof window === "undefined") return;

  const today = new Date().toISOString().split('T')[0];
  const dailyKey = `usage-count-${today}`;
  const currentCount = parseInt(localStorage.getItem(dailyKey) || '0', 10);
  localStorage.setItem(dailyKey, (currentCount + 1).toString());

  const plan = localStorage.getItem('user-plan');
  if (plan === 'paid') {
    const month = new Date().toISOString().slice(0, 7);
    const monthlyKey = `premium-usage-${month}`;
    const monthlyData = JSON.parse(localStorage.getItem(monthlyKey) || '{"feedbacks": 0, "rewrites": 0}');
    monthlyData.feedbacks += 1;
    localStorage.setItem(monthlyKey, JSON.stringify(monthlyData));
  }
};
