import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from pricing page
  const fromPricing = location.state?.fromPricing;
  const selectedPlan = location.state?.selectedPlan;

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (fromPricing && selectedPlan) {
          handleCheckout(selectedPlan);
        } else {
          navigate("/dashboard");
        }
      }
    };
    
    checkAuth();
  }, [navigate, fromPricing, selectedPlan]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    try {
      let res;
      if (isLogin) {
        res = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        res = await supabase.auth.signUp({
          email,
          password,
        });
      }
      if (res.error) {
        throw new Error(res.error.message);
      }
      
      toast({
        title: isLogin ? "Login successful" : "Signup successful",
        description: "Redirecting...",
      });
      
      // If user came from pricing, redirect to checkout
      if (fromPricing && selectedPlan) {
        setTimeout(() => handleCheckout(selectedPlan), 1000);
      } else {
        // Otherwise redirect to dashboard
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      toast({
        title: "Auth Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
      setPending(false);
    }
  }

  async function handleGoogle() {
    setPending(true);
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    if (error) {
      toast({
        title: "Google Login Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Google sign in...", description: "Check the popup." });
    }
    setPending(false);
  }

  async function handleCheckout(plan: string) {
    try {
      setPending(true);
      toast({
        title: "Preparing checkout...",
        description: "You'll be redirected to the payment page shortly.",
      });
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan }
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
      console.error("Checkout error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Could not initiate checkout",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] bg-slate-50 py-10">
      <Card className="p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Sign In to Matchrate.ai" : "Sign Up for Matchrate.ai"}
        </h2>
        <form className="space-y-4" onSubmit={handleAuth}>
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={pending}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={pending}
          />
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="my-3 text-center text-muted-foreground">or</div>
        <Button className="w-full" variant="outline" onClick={handleGoogle} disabled={pending}>
          Continue with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button className="underline" onClick={() => setIsLogin(false)} disabled={pending}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="underline" onClick={() => setIsLogin(true)} disabled={pending}>
                Sign in
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
