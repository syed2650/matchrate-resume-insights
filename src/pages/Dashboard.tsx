
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Download, 
  FileText, 
  Settings, 
  User,
  History,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UpgradeBanner from "@/pages/review/components/UpgradeBanner";
import { getUsageStats, resetUsageStats } from "@/pages/review/utils";

type Submission = {
  id: string;
  created_at: string;
  job_description: string;
  selected_role: string | null;
  feedback_results: any;
};

type UsageCount = {
  used: number;
  total: number | string;
  remaining: number | string;
};

type UsageStats = {
  plan: string;
  feedbacks: UsageCount;
  rewrites: UsageCount;
};

export default function Dashboard() {
  const { user, loading } = useAuthUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [fetching, setFetching] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    plan: 'free',
    feedbacks: { used: 0, total: 1, remaining: 1 },
    rewrites: { used: 0, total: 0, remaining: 0 }
  });
  const [isLifetimePremium, setIsLifetimePremium] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isPaid = usageStats.plan === 'paid';

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
      
      // For free plan: 1 feedback per day, 0 rewrites
      // For paid plan: 30 feedback per month, 15 rewrites per month
      const feedbackTotal = stats.plan === 'paid' ? 30 : 1;
      const rewriteTotal = stats.plan === 'paid' ? 15 : 0;
      
      // Calculate used amounts
      const feedbackUsed = stats.plan === 'paid' ? stats.monthly.feedbacks : stats.daily.count;
      const rewritesUsed = stats.plan === 'paid' ? stats.monthly.rewrites : 0;
      
      // Calculate remaining
      const feedbackRemaining = isLifetimePremium ? "∞" : Math.max(0, feedbackTotal - feedbackUsed);
      const rewriteRemaining = isLifetimePremium ? "∞" : Math.max(0, rewriteTotal - rewritesUsed);
      
      setUsageStats({
        plan: stats.plan,
        feedbacks: { 
          used: feedbackUsed, 
          total: isLifetimePremium ? "∞" : feedbackTotal,
          remaining: feedbackRemaining
        },
        rewrites: { 
          used: rewritesUsed, 
          total: isLifetimePremium ? "∞" : rewriteTotal,
          remaining: rewriteRemaining
        }
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
      if (data) {
        setSubmissions(data as Submission[]);
        if (data.length > 0) setSelectedSubmission(data[0]);
      }
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

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleDownloadReport = () => {
    if (!selectedSubmission) return;
    
    if (!isPaid) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to our premium plan to download reports",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Downloading report",
      description: "Your report is being prepared for download"
    });
    
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "Your report has been downloaded"
      });
    }, 1500);
  };

  const handleNewAnalysis = () => {
    navigate("/review");
  };

  const handleUpgrade = async () => {
    try {
      toast({
        title: "Preparing checkout...",
        description: "You'll be redirected to the payment page shortly."
      });
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: "premium" }
      });
      
      if (error) {
        console.error("Checkout error:", error);
        throw error;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSubmissionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateSuggestion = () => {
    if (!submissions || submissions.length === 0) return null;

    // Analyze submission patterns to generate helpful suggestions
    const roles = submissions.map(s => s.selected_role).filter(Boolean);
    const mostCommonRole = roles.length > 0 
      ? roles.sort((a, b) => 
          roles.filter(r => r === a).length - roles.filter(r => r === b).length
        ).pop() 
      : null;

    const latestScore = submissions[0]?.feedback_results?.score || 0;

    if (isLifetimePremium) {
      return "You have Lifetime Premium Access — thank you for being an early supporter!";
    } else if (!isPaid) {
      return "Upgrade to Premium to unlock 30 resume reviews and 15 resume rewrites per month, plus additional features like report downloads.";
    } else if (mostCommonRole && submissions.length >= 3) {
      return `Based on your ${submissions.length} submissions, you seem focused on ${mostCommonRole} roles. Consider optimizing your resume specifically for this career path.`;
    } else if (latestScore < 70 && submissions.length > 0) {
      return "Your latest resume received a score below 70. Consider implementing the feedback suggestions to improve your match rate.";
    } else if (submissions.length === 0) {
      return "Get started by submitting your resume for analysis on the Resume Review page.";
    }
    
    return "Keep submitting your resume for different job descriptions to optimize your applications.";
  };

  const renderUsageStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Resume Feedback</h3>
          <span className="text-sm text-muted-foreground">
            {usageStats.feedbacks.used} / {usageStats.feedbacks.total}
          </span>
        </div>
        <Progress 
          value={isLifetimePremium ? 0 : typeof usageStats.feedbacks.used === 'number' && typeof usageStats.feedbacks.total === 'number' 
            ? (usageStats.feedbacks.used / usageStats.feedbacks.total) * 100 
            : 0} 
          className="h-2 mb-2" 
        />
        <p className="text-sm text-muted-foreground">
          {isLifetimePremium ? (
            "Unlimited feedback analyses — lifetime premium access"
          ) : (
            `${usageStats.feedbacks.remaining} feedback analyses remaining ${isPaid ? 'this month' : ''}`
          )}
        </p>
        {!isPaid && !isLifetimePremium && (
          <Button 
            onClick={handleUpgrade}
            variant="outline" 
            size="sm" 
            className="mt-3"
          >
            Upgrade to Premium
          </Button>
        )}
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Resume Rewrites</h3>
          <span className="text-sm text-muted-foreground">
            {usageStats.rewrites.used} / {usageStats.rewrites.total}
          </span>
        </div>
        <Progress 
          value={isLifetimePremium ? 0 : typeof usageStats.rewrites.used === 'number' && typeof usageStats.rewrites.total === 'number' 
            ? (usageStats.rewrites.used / usageStats.rewrites.total) * 100
            : 0} 
          className="h-2 mb-2" 
        />
        {isPaid || isLifetimePremium ? (
          <p className="text-sm text-muted-foreground">
            {isLifetimePremium ? (
              "Unlimited rewrites — lifetime premium access"
            ) : (
              `${usageStats.rewrites.remaining} rewrites remaining this month`
            )}
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Lock className="h-3 w-3" /> Upgrade to unlock resume rewrites
            </p>
            <Button 
              onClick={handleUpgrade}
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Upgrade to Premium
            </Button>
          </>
        )}
      </Card>
    </div>
  );

  const renderSubmissionHistory = () => (
    <Card className="mt-8 overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <History className="h-5 w-5" />
          Submission History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading submissions...</TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">No submissions yet</TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id} className={selectedSubmission?.id === submission.id ? "bg-muted/50" : ""}>
                  <TableCell>{getSubmissionDate(submission.created_at)}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{submission.job_description.slice(0, 30)}...</TableCell>
                  <TableCell>{submission.selected_role || "-"}</TableCell>
                  <TableCell>{submission.feedback_results?.score || "-"}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewSubmission(submission)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );

  const renderSelectedSubmission = () => {
    if (!selectedSubmission) return (
      <Card className="p-6 mt-8">
        <p className="text-center text-muted-foreground">Select a submission to view details</p>
      </Card>
    );

    const feedbackResults = selectedSubmission.feedback_results || {};
    const hasRewrittenResume = !!feedbackResults.rewrittenResume;

    return (
      <Card className="mt-8">
        <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Submission Details
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadReport}
            disabled={!isPaid}
          >
            {!isPaid && <Lock className="h-3 w-3 mr-1" />}
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Submitted on {getSubmissionDate(selectedSubmission.created_at)}</p>
            {selectedSubmission.selected_role && (
              <p className="text-sm font-medium mt-1">Role: {selectedSubmission.selected_role}</p>
            )}
          </div>
          
          <Tabs defaultValue="feedback">
            <TabsList className="mb-4">
              <TabsTrigger value="feedback">Feedback Report</TabsTrigger>
              {hasRewrittenResume && <TabsTrigger value="rewrite" disabled={!isPaid}>
                {!isPaid && <Lock className="h-3 w-3 mr-1" />}
                Rewritten Resume
              </TabsTrigger>}
            </TabsList>
            
            <TabsContent value="feedback" className="space-y-4">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Resume Score</h4>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                    {feedbackResults.score || 0}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">Match Score</span>
                </div>
              </div>
              
              {feedbackResults.missingKeywords?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedbackResults.missingKeywords.map((keyword: string, index: number) => (
                      <span key={index} className="bg-muted px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {feedbackResults.sectionFeedback && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Section Feedback</h4>
                  <div className="space-y-4">
                    {Object.entries(feedbackResults.sectionFeedback).map(([section, feedback]) => (
                      <div key={section} className="rounded border p-3">
                        <h5 className="font-medium text-sm">{section}</h5>
                        <p className="text-sm mt-1">{String(feedback)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {feedbackResults.wouldInterview && (
                <div className="mt-4 p-4 rounded bg-muted">
                  <h4 className="font-semibold">Interview Verdict</h4>
                  <p className="text-sm mt-1">{feedbackResults.wouldInterview}</p>
                </div>
              )}
            </TabsContent>
            
            {hasRewrittenResume && (
              <TabsContent value="rewrite">
                {isPaid ? (
                  <div className="whitespace-pre-wrap border rounded p-4 bg-muted/30 text-sm max-h-[500px] overflow-y-auto">
                    {feedbackResults.rewrittenResume}
                  </div>
                ) : (
                  <UpgradeBanner
                    feature="Resume Rewrite"
                    limit="access to AI-powered resume rewrites"
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Card>
    );
  };

  const renderAiSuggestion = () => {
    const suggestion = generateSuggestion();
    if (!suggestion) return null;
    
    return (
      <Card className={`mt-8 p-6 border-l-4 ${isLifetimePremium ? 'border-l-green-500' : !isPaid ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <User className="h-5 w-5" />
          {isLifetimePremium ? "Lifetime Premium" : "AI Suggestion"}
        </h3>
        <p className="text-muted-foreground">{suggestion}</p>
        {!isPaid && !isLifetimePremium && (
          <Button 
            onClick={handleUpgrade}
            className="mt-4 cta-gradient"
          >
            Upgrade to Premium
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">
            {isPaid 
              ? "Manage your premium resume analyses and track your usage" 
              : "You're on the Free Plan. Upgrade to unlock premium features."}
          </p>
        </div>
        <div className="flex gap-2">
          {!isPaid && (
            <Button onClick={handleUpgrade} className="cta-gradient">
              Upgrade to Premium
            </Button>
          )}
          <Button onClick={handleNewAnalysis} variant={isPaid ? "default" : "outline"}>
            New Analysis
          </Button>
        </div>
      </div>

      {renderUsageStats()}
      {renderAiSuggestion()}
      {renderSubmissionHistory()}
      {renderSelectedSubmission()}
    </div>
  );
}
