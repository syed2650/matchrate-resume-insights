import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  FileText, 
  History,
  Lock,
  Zap,
  Crown,
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUsageStats } from "@/pages/review/utils";
import FloatingOrbs from "@/components/ui/FloatingOrbs";

type Submission = {
  id: string;
  created_at: string;
  job_description: string;
  selected_role: string | null;
  feedback_results: any;
};

type UsageStats = {
  plan: 'free' | 'weekly' | 'monthly';
  checksUsed: number;
  checksTotal: number;
  daysRemaining?: number;
};

export default function Dashboard() {
  const { user, loading } = useAuthUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    plan: 'free',
    checksUsed: 0,
    checksTotal: 1
  });
  const [isLifetimePremium, setIsLifetimePremium] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user) {
      fetchSubmissions();
      const stats = getUsageStats();
      
      // Check if the user has lifetime premium access
      const checkLifetimePremium = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("is_lifetime_premium")
          .eq("id", user.id)
          .single();
        
        if (data && data.is_lifetime_premium) {
          setIsLifetimePremium(true);
        }
      };
      
      checkLifetimePremium().catch(console.error);
      
      // Map to new check-based model
      const checksTotal = stats.plan === 'monthly' ? 25 : stats.plan === 'weekly' ? 5 : 1;
      const checksUsed = stats.plan === 'free' ? stats.daily.count : stats.monthly.feedbacks;
      
      setUsageStats({
        plan: stats.plan as 'free' | 'weekly' | 'monthly',
        checksUsed,
        checksTotal,
        daysRemaining: stats.plan === 'weekly' ? 7 : undefined
      });
    }
  }, [user, loading, navigate, isLifetimePremium]);

  const fetchSubmissions = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("id, created_at, job_description, selected_role, feedback_results")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setSubmissions(data as Submission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error fetching submissions",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getPlanInfo = () => {
    if (isLifetimePremium) {
      return {
        label: 'Lifetime Access',
        icon: <Crown className="w-4 h-4" />,
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-700'
      };
    }
    switch (usageStats.plan) {
      case 'monthly':
        return {
          label: 'Monthly Plan',
          icon: <Crown className="w-4 h-4" />,
          color: 'from-emerald-500 to-teal-500',
          bgColor: 'bg-gradient-to-r from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700'
        };
      case 'weekly':
        return {
          label: 'Weekly Plan',
          icon: <Zap className="w-4 h-4" />,
          color: 'from-amber-500 to-orange-500',
          bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700'
        };
      default:
        return {
          label: 'Free Plan',
          icon: <Target className="w-4 h-4" />,
          color: 'from-slate-400 to-slate-500',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-600'
        };
    }
  };

  const planInfo = getPlanInfo();
  const usagePercentage = isLifetimePremium ? 0 : (usageStats.checksUsed / usageStats.checksTotal) * 100;
  const checksRemaining = isLifetimePremium ? '∞' : usageStats.checksTotal - usageStats.checksUsed;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      <FloatingOrbs variant="hero" />
      
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-warm-text">
              My Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Track your resume analyses and job match checks
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => navigate("/review")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 rounded-xl px-6 py-6 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plan Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-2xl border-2 ${planInfo.borderColor} ${planInfo.bgColor} p-6 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${planInfo.color} text-white text-sm font-medium mb-4`}>
                {planInfo.icon}
                {planInfo.label}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Job Match Checks</p>
                    <p className="text-3xl font-bold text-warm-text">
                      {isLifetimePremium ? '∞' : `${usageStats.checksUsed}/${usageStats.checksTotal}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Remaining</p>
                    <p className={`text-2xl font-bold ${planInfo.textColor}`}>{checksRemaining}</p>
                  </div>
                </div>
                
                {!isLifetimePremium && (
                  <div className="space-y-1">
                    <Progress value={usagePercentage} className="h-2" />
                    {usageStats.plan === 'weekly' && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Resets in {usageStats.daysRemaining} days
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border-2 border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-50">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-warm-text">Quick Stats</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-warm-text">{submissions.length}</p>
                <p className="text-sm text-slate-500">Total Analyses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warm-text">
                  {submissions.length > 0 
                    ? Math.round(submissions.reduce((acc, s) => acc + (s.feedback_results?.score || 0), 0) / submissions.length)
                    : 0}
                </p>
                <p className="text-sm text-slate-500">Avg. Score</p>
              </div>
            </div>
          </motion.div>

          {/* Upgrade Card (for non-premium users) */}
          {usageStats.plan === 'free' && !isLifetimePremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-warm-text">Upgrade to Unlock</h3>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Get up to 25 job match checks, full analysis, and rechecks after edits.
                </p>
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium"
                >
                  <Link to="/#pricing">
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Lifetime Premium Message */}
          {isLifetimePremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-warm-text">Early Supporter</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Thank you for being an early supporter! You have unlimited lifetime access to all features.
                </p>
              </div>
            </motion.div>
          )}

          {/* Weekly/Monthly Plan Status */}
          {(usageStats.plan === 'weekly' || usageStats.plan === 'monthly') && !isLifetimePremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-semibold text-warm-text">Active Subscription</h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {usageStats.plan === 'weekly' 
                    ? 'Your weekly plan is active. Keep optimizing!'
                    : 'Your monthly plan gives you full access to all features.'
                  }
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <Calendar className="w-4 h-4" />
                  {usageStats.plan === 'weekly' ? 'Renews weekly' : 'Renews monthly'}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Submission History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border-2 border-slate-200 bg-white overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="font-semibold text-warm-text">Recent Analyses</h2>
                <p className="text-sm text-slate-500">Your job match check history</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {fetching ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4" />
                <p className="text-slate-500">Loading your analyses...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-medium text-warm-text mb-2">No analyses yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                  Upload your resume and a job description to get your first analysis.
                </p>
                <Button 
                  onClick={() => navigate("/review")}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
                >
                  Start Your First Analysis
                </Button>
              </div>
            ) : (
              submissions.slice(0, 10).map((submission, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => navigate("/review")}
                >
                  <div className="flex items-center gap-4">
                    {/* Score Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0
                      ${(submission.feedback_results?.score || 0) >= 80 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        : (submission.feedback_results?.score || 0) >= 60
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                          : 'bg-gradient-to-br from-rose-500 to-pink-500'
                      }`}
                    >
                      {submission.feedback_results?.score || '-'}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium text-warm-text truncate">
                        {submission.job_description?.slice(0, 60) || 'Job Analysis'}...
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(submission.created_at)}
                        </span>
                        {submission.selected_role && (
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                            {submission.selected_role}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          {submissions.length > 10 && (
            <div className="p-4 border-t border-slate-100 text-center">
              <Button variant="ghost" className="text-slate-600">
                View All {submissions.length} Analyses
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
