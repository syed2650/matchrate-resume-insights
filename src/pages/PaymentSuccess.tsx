
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { setUserPlan } from "@/pages/review/utils";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isLifetimePremium, setIsLifetimePremium] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        // First, check if the user is a lifetime premium user
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_lifetime_premium')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && profileData.is_lifetime_premium) {
            setIsLifetimePremium(true);
          }
        }
        
        // Activate the premium plan regardless
        setUserPlan('paid');
        setTimeout(() => {
          setIsProcessing(false);
        }, 1500);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsProcessing(false);
      }
    };

    if (sessionId || isLifetimePremium) {
      checkSubscriptionStatus();
    } else {
      setIsProcessing(false);
    }
  }, [sessionId, isLifetimePremium]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card className="p-8 md:p-12 flex flex-col items-center text-center">
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <h1 className="text-3xl font-bold mt-2">Processing your payment...</h1>
            <p className="text-gray-500">This will just take a moment.</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold mb-6">Payment Successful!</h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              {isLifetimePremium 
                ? "Thank you for being an early supporter! You have been granted lifetime premium access to all features." 
                : "Thank you for subscribing to our Premium Plan. Your account has been activated with all premium features."}
            </p>
            
            <div className="bg-slate-50 p-6 rounded-lg w-full mb-8">
              <h2 className="font-medium text-xl mb-4">Your Premium Benefits Include:</h2>
              <ul className="text-left space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{isLifetimePremium ? "Unlimited" : "30"} resume reviews{isLifetimePremium ? "" : " per month"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{isLifetimePremium ? "Unlimited" : "15"} resume rewrites{isLifetimePremium ? "" : " per month"}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Full STAR bullet suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Export reports in .docx format</span>
                </li>
                {isLifetimePremium && (
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Lifetime access to all future premium features</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="cta-gradient">
                <Link to="/review">
                  Analyze Your Resume Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PaymentSuccess;
