import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if FIRST20 promotion code already exists
    const existingPromoCodes = await stripe.promotionCodes.list({
      code: "FIRST20",
      limit: 1,
    });

    if (existingPromoCodes.data.length > 0) {
      const promo = existingPromoCodes.data[0];
      return new Response(JSON.stringify({ 
        message: "FIRST20 promotion code already exists",
        promo_code_id: promo.id,
        coupon_id: promo.coupon.id,
        active: promo.active,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a 20% off coupon for first-time users
    const coupon = await stripe.coupons.create({
      percent_off: 20,
      duration: "once", // Only applies to the first payment
      name: "20% Off First Payment - FIRST20",
    });

    console.log(`Created coupon: ${coupon.id}`);

    // Create the promotion code "FIRST20" linked to the coupon
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "FIRST20",
      restrictions: {
        first_time_transaction: true, // Only for first-time customers
      },
    });

    console.log(`Created promotion code: ${promotionCode.id}`);

    return new Response(JSON.stringify({ 
      message: "FIRST20 promotion code created successfully",
      coupon_id: coupon.id,
      promo_code_id: promotionCode.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error setting up promo code:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
