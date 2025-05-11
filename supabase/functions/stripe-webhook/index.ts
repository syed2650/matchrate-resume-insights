
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This endpoint needs to be available without authentication
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Missing Stripe webhook secret");
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const body = await req.text();
    let event;

    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    console.log(`✅ Received Stripe webhook event: ${event.type}`);

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Get customer info from the session
        const customerId = session.customer;
        const customerEmail = session.customer_details?.email;
        
        if (!customerEmail) {
          console.error("No customer email found in session");
          break;
        }

        console.log(`Processing successful checkout for customer: ${customerEmail}`);

        // Update the user's usage stats in local storage via user's metadata
        // First, find the user by email
        const { data: users, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);

        if (userError) {
          console.error(`Error finding user: ${userError.message}`);
        } else if (users && users.length > 0) {
          const userId = users[0].id;
          
          // Store in subscribers table
          const { error: insertError } = await supabaseAdmin
            .from("subscribers")
            .upsert({
              user_id: userId,
              email: customerEmail,
              stripe_customer_id: customerId,
              subscribed: true,
              subscription_tier: "premium",
              // Set subscription end to 30 days from now
              subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

          if (insertError) {
            console.error(`Error updating subscriber: ${insertError.message}`);
          } else {
            console.log(`Successfully updated subscription for user: ${userId}`);
          }
        } else {
          console.log(`User with email ${customerEmail} not found`);
        }

        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId as string);
        if (!customer || customer.deleted) {
          console.error("Customer not found or deleted");
          break;
        }
        
        const customerEmail = customer.email;
        if (!customerEmail) {
          console.error("No customer email found");
          break;
        }

        console.log(`Processing paid invoice for customer: ${customerEmail}`);

        // Similar logic to checkout.session.completed
        const { data: users, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);

        if (userError) {
          console.error(`Error finding user: ${userError.message}`);
        } else if (users && users.length > 0) {
          const userId = users[0].id;
          
          // Calculate subscription end date (30 days from now for monthly subscriptions)
          let subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          
          // Check if invoice contains period_end
          if (invoice.lines && invoice.lines.data && invoice.lines.data[0]) {
            const periodEnd = invoice.lines.data[0].period?.end;
            if (periodEnd) {
              subscriptionEnd = new Date(periodEnd * 1000);
            }
          }
          
          // Store in subscribers table
          const { error: insertError } = await supabaseAdmin
            .from("subscribers")
            .upsert({
              user_id: userId,
              email: customerEmail,
              stripe_customer_id: customerId,
              subscribed: true,
              subscription_tier: "premium",
              subscription_end: subscriptionEnd.toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

          if (insertError) {
            console.error(`Error updating subscriber: ${insertError.message}`);
          } else {
            console.log(`Successfully extended subscription for user: ${userId} until ${subscriptionEnd.toISOString()}`);
          }
        }
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(customerId as string);
        if (!customer || customer.deleted) {
          console.error("Customer not found or deleted");
          break;
        }
        
        const customerEmail = customer.email;
        if (!customerEmail) {
          console.error("No customer email found");
          break;
        }

        console.log(`Processing subscription update for customer: ${customerEmail}`);
        
        // Handle status changes (active, trialing, past_due, canceled, unpaid)
        const status = subscription.status;
        const isActive = ["active", "trialing"].includes(status);
        
        const { data: users, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);

        if (userError) {
          console.error(`Error finding user: ${userError.message}`);
        } else if (users && users.length > 0) {
          const userId = users[0].id;
          
          // Store in subscribers table
          const { error: insertError } = await supabaseAdmin
            .from("subscribers")
            .upsert({
              user_id: userId,
              email: customerEmail,
              stripe_customer_id: customerId,
              subscribed: isActive,
              subscription_tier: isActive ? "premium" : null,
              subscription_end: isActive && subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

          if (insertError) {
            console.error(`Error updating subscriber status: ${insertError.message}`);
          } else {
            console.log(`Successfully updated subscription status to ${status} for user: ${userId}`);
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get customer email
        const customer = await stripe.customers.retrieve(customerId as string);
        if (!customer || customer.deleted) {
          console.error("Customer not found or deleted");
          break;
        }
        
        const customerEmail = customer.email;
        if (!customerEmail) {
          console.error("No customer email found");
          break;
        }

        console.log(`Processing subscription deletion for customer: ${customerEmail}`);
        
        // Update the user's subscription status to false
        const { data: users, error: userError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);

        if (userError) {
          console.error(`Error finding user: ${userError.message}`);
        } else if (users && users.length > 0) {
          const userId = users[0].id;
          
          // Store in subscribers table
          const { error: insertError } = await supabaseAdmin
            .from("subscribers")
            .upsert({
              user_id: userId,
              email: customerEmail,
              stripe_customer_id: customerId,
              subscribed: false,
              subscription_tier: null,
              subscription_end: null,
              updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });

          if (insertError) {
            console.error(`Error updating subscriber: ${insertError.message}`);
          } else {
            console.log(`Successfully marked subscription as canceled for user: ${userId}`);
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
