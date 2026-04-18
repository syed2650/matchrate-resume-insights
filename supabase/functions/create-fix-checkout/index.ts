import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

const PRODUCT_NAME = "MatchRate AI Resume Fix";
const PRICE_AMOUNT = 499; // $4.99 in cents
const CURRENCY = "usd";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the analyzer session exists & user owns it
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Auth required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch session and claim ownership if it was anonymous
    const { data: analyzerSession, error: fetchErr } = await supabase
      .from("analyzer_sessions")
      .select("*")
      .eq("id", session_id)
      .maybeSingle();

    if (fetchErr || !analyzerSession) {
      return new Response(
        JSON.stringify({ error: "Analyzer session not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Claim anonymous session for this user
    if (!analyzerSession.user_id) {
      await supabase
        .from("analyzer_sessions")
        .update({ user_id: user.id })
        .eq("id", session_id);
    } else if (analyzerSession.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Not your session" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Test bypass: specific emails skip Stripe entirely
    const TEST_BYPASS_EMAILS = ["contactbloggertrial@gmail.com"];
    if (user.email && TEST_BYPASS_EMAILS.includes(user.email.toLowerCase())) {
      await supabase
        .from("analyzer_sessions")
        .update({ payment_status: "paid" })
        .eq("id", session_id);

      const origin = req.headers.get("origin") ?? "https://www.matchrate.co";
      const bypassUrl = `${origin}/fix?session_id=${session_id}&bypass=1`;
      return new Response(JSON.stringify({ url: bypassUrl, bypassed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // Get or create product
    const products = await stripe.products.list({ active: true, limit: 100 });
    let product = products.data.find((p) => p.name === PRODUCT_NAME);
    if (!product) {
      product = await stripe.products.create({
        name: PRODUCT_NAME,
        description:
          "AI-rewritten resume tailored to your target job. One-time payment, no subscription.",
      });
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 10,
    });
    let price = prices.data.find(
      (p) =>
        p.unit_amount === PRICE_AMOUNT && p.currency === CURRENCY && !p.recurring,
    );
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: PRICE_AMOUNT,
        currency: CURRENCY,
      });
    }

    const origin = req.headers.get("origin") ?? "https://www.matchrate.co";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: user.email,
      success_url: `${origin}/fix?session_id=${session_id}&stripe_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/analyzer?cancelled=1`,
      allow_promotion_codes: true,
      metadata: {
        analyzer_session_id: session_id,
        user_id: user.id,
      },
    });

    // Store stripe session id on the row
    await supabase
      .from("analyzer_sessions")
      .update({ stripe_session_id: checkoutSession.id })
      .eq("id", session_id);

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("create-fix-checkout error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
