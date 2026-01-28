import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Plan configurations - NEW PRICING MODEL
const PLANS = {
  weekly: {
    name: "Weekly Access",
    description: "Up to 5 job match checks, full Resume Strength fixes, ATS Safety analysis, Job Fit analysis, Roast Review, recheck after edits. Access valid for 7 days.",
    amount: 199, // £1.99 in pence
    currency: "gbp",
    mode: "subscription" as const,
    interval: "week" as const,
  },
  monthly: {
    name: "Monthly Access",
    description: "Up to 25 job match checks/month, everything in Weekly, saved resume & job history, PDF exports, priority usage limits.",
    amount: 699, // £6.99 in pence
    currency: "gbp",
    mode: "subscription" as const,
    interval: "month" as const,
  },
  // Legacy plans for existing customers
  premium: {
    name: "Premium Monthly (Legacy)",
    description: "Legacy plan - please use Monthly instead",
    amount: 399, // £3.99 in pence
    currency: "gbp",
    mode: "subscription" as const,
    interval: "month" as const,
  },
  lifetime: {
    name: "Lifetime Access (Legacy)",
    description: "Legacy plan - no longer available",
    amount: 2900, // £29 in pence
    currency: "gbp",
    mode: "payment" as const,
    interval: null,
  },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { plan } = await req.json();
    
    console.log(`Creating checkout for plan: ${plan}`);
    
    // Validate plan
    const planKey = plan?.toLowerCase();
    if (!planKey || !PLANS[planKey as keyof typeof PLANS]) {
      throw new Error(`Invalid plan: ${plan}. Valid plans are: weekly, monthly`);
    }
    
    const planConfig = PLANS[planKey as keyof typeof PLANS];
    
    // Initialize Stripe with the secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get or create product
    let productId;
    
    try {
      const products = await stripe.products.list({
        active: true,
        limit: 100
      });
      
      const existingProduct = products.data.find(p => p.name === planConfig.name);
      if (existingProduct) {
        productId = existingProduct.id;
        console.log(`Found existing product: ${productId}`);
      }
    } catch (error) {
      console.log("Error finding existing products:", error);
    }
    
    // Create new product if needed
    if (!productId) {
      const product = await stripe.products.create({
        name: planConfig.name,
        description: planConfig.description,
      });
      productId = product.id;
      console.log(`Created new product: ${productId}`);
    }
    
    // Get or create price
    let priceId;
    
    try {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 10
      });
      
      // Find matching price based on amount and recurring/one-time
      const existingPrice = prices.data.find(p => {
        const amountMatch = p.unit_amount === planConfig.amount;
        const currencyMatch = p.currency === planConfig.currency;
        const modeMatch = planConfig.mode === "subscription" 
          ? p.recurring?.interval === planConfig.interval
          : !p.recurring;
        return amountMatch && currencyMatch && modeMatch;
      });
      
      if (existingPrice) {
        priceId = existingPrice.id;
        console.log(`Found existing price: ${priceId}`);
      }
    } catch (error) {
      console.log("Error finding existing prices:", error);
    }
    
    // Create new price if needed
    if (!priceId) {
      const priceParams: Stripe.PriceCreateParams = {
        product: productId,
        unit_amount: planConfig.amount,
        currency: planConfig.currency,
      };
      
      if (planConfig.mode === "subscription" && planConfig.interval) {
        priceParams.recurring = { interval: planConfig.interval };
      }
      
      const price = await stripe.prices.create(priceParams);
      priceId = price.id;
      console.log(`Created new price: ${priceId}`);
    }

    // Create a checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: planConfig.mode,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&plan=${planKey}`,
      cancel_url: `${req.headers.get("origin")}/#pricing`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    };
    
    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(`Created checkout session: ${session.id}`);

    // Return the checkout session URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-checkout function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
