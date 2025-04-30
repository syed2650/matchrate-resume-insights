
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { setUserPlan } from "@/pages/review/utils";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Activate the premium plan
    if (sessionId) {
      setUserPlan('paid');
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  }, [sessionId]);

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
              Thank you for subscribing to our Premium Plan. Your account has been activated with all premium features.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-lg w-full mb-8">
              <h2 className="font-medium text-xl mb-4">Your Premium Benefits Include:</h2>
              <ul className="text-left space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>30 resume reviews per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>15 resume rewrites per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Full STAR bullet suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Export reports in .docx format</span>
                </li>
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
