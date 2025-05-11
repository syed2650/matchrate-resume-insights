
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { plan } = await req.json();
    
    // Initialize Stripe with the secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a product and price programmatically (or use existing ones)
    // This ensures we always have valid price IDs
    
    // First try to see if our product already exists
    const productName = "Premium Subscription";
    let productId;
    let priceId;
    
    try {
      // Look for existing products with our name
      const products = await stripe.products.list({
        active: true,
        limit: 1
      });
      
      // Use existing product if available
      const existingProduct = products.data.find(p => p.name === productName);
      if (existingProduct) {
        productId = existingProduct.id;
        console.log(`Found existing product: ${productId}`);
        
        // Get prices for this product
        const prices = await stripe.prices.list({
          product: productId,
          active: true,
          limit: 1
        });
        
        if (prices.data.length > 0) {
          priceId = prices.data[0].id;
          console.log(`Found existing price: ${priceId}`);
        }
      }
    } catch (error) {
      console.log("Error finding existing products/prices:", error);
    }
    
    // Create new product and price if needed
    if (!productId) {
      const product = await stripe.products.create({
        name: productName,
        description: "Premium access to Matchrate.ai resume services",
      });
      productId = product.id;
      console.log(`Created new product: ${productId}`);
    }
    
    if (!priceId) {
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: 700, // $7.00
        currency: 'usd',
        recurring: { interval: 'month' }
      });
      priceId = price.id;
      console.log(`Created new price: ${priceId}`);
    }

    // Create or find a beta coupon for 50% off first month
    const couponName = "BETALAUNCH";
    let couponId;
    
    try {
      // Check if the coupon already exists
      const coupons = await stripe.coupons.list({
        limit: 100
      });
      
      const existingCoupon = coupons.data.find(c => c.name === couponName);
      if (existingCoupon) {
        couponId = existingCoupon.id;
        console.log(`Found existing coupon: ${couponId}`);
      }
    } catch (error) {
      console.log("Error finding existing coupons:", error);
    }
    
    // Create the coupon if it doesn't exist
    if (!couponId) {
      const coupon = await stripe.coupons.create({
        name: couponName,
        percent_off: 50,
        duration: 'repeating', // Fixed: changed from 'once' to 'repeating'
        duration_in_months: 1,
      });
      couponId = coupon.id;
      console.log(`Created new coupon: ${couponId}`);
    }

    // Create a checkout session - FIX: Don't use both allow_promotion_codes and discounts
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      // FIX: Remove allow_promotion_codes as we're using discounts
      // allow_promotion_codes: true,
      discounts: [{ coupon: couponId }],  // Automatically apply the 50% discount
      billing_address_collection: "auto",
    });

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
