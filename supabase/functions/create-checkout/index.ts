import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
    const body = await req.json();
    const { priceId, quantity, dishName, items, totalAmount, successUrl, cancelUrl } = body;

    console.log("Creating checkout session:", body);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Create Supabase client with anon key for user auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Create Supabase client with service role for price validation
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Try to get authenticated user (optional for checkout)
    let customerId: string | undefined;
    let userEmail: string | undefined;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.email) {
          userEmail = data.user.email;
          
          // Check if customer exists
          const customers = await stripe.customers.list({ 
            email: userEmail, 
            limit: 1 
          });
          
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          }
        }
      } catch (error) {
        console.log("User not authenticated, proceeding as guest:", error);
      }
    }

    // Prepare line items with SERVER-SIDE PRICE VALIDATION
    let lineItems;
    let validatedTotalAmount = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      // Cart checkout with multiple items - VALIDATE EACH PRICE
      const validatedItems = [];
      
      for (const item of items) {
        if (!item.dishId) {
          console.error("Missing dishId in cart item:", item);
          throw new Error("Missing dishId in cart item - price validation required");
        }
        
        // Fetch actual price from database
        const { data: dish, error: dishError } = await supabaseService
          .from("dishes")
          .select("price, name, id, available")
          .eq("id", item.dishId)
          .single();
        
        if (dishError || !dish) {
          console.error("Invalid dish:", item.dishId, dishError);
          throw new Error(`Invalid dish: ${item.dishId}`);
        }

        if (!dish.available) {
          console.error("Dish not available:", item.dishId);
          throw new Error(`Dish not available: ${dish.name}`);
        }
        
        // Use SERVER price, not client price (price is in SEK, convert to öre)
        const serverPriceInOre = Math.round(dish.price * 100);
        const itemTotal = serverPriceInOre * (item.quantity || 1);
        validatedTotalAmount += itemTotal;
        
        console.log(`Validated dish ${dish.name}: server price ${serverPriceInOre} öre, quantity ${item.quantity}`);
        
        validatedItems.push({
          price_data: {
            currency: 'sek',
            product_data: {
              name: dish.name,
            },
            unit_amount: serverPriceInOre, // VALIDATED SERVER PRICE
          },
          quantity: item.quantity || 1,
        });
      }
      
      lineItems = validatedItems;
      console.log(`Total validated amount: ${validatedTotalAmount} öre`);
      
    } else if (priceId) {
      // Single item checkout with Stripe price ID (fallback for direct StripeCheckout component usage)
      // This uses pre-configured Stripe prices which are already server-controlled
      lineItems = [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ];
    } else {
      throw new Error("No items or priceId provided");
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        dish_name: dishName || 'Multiple items',
        platform_fee_percentage: "20", // 20% provision för Homechef
        total_amount: validatedTotalAmount > 0 ? String(validatedTotalAmount) : (totalAmount || ''),
      },
      payment_intent_data: {
        metadata: {
          dish_name: dishName || 'Multiple items',
          platform_fee_percentage: "20",
        },
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to create checkout session" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
