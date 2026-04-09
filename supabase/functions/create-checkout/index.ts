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

    // Validate redirect URLs against allowed origins
    const ALLOWED_ORIGINS = [
      req.headers.get("origin"),
      'https://homechef.nu',
      'https://www.homechef.nu',
      'https://hello-world-party.lovable.app',
    ].filter(Boolean);

    function isTrustedUrl(url: string): boolean {
      try {
        const parsed = new URL(url);
        return ALLOWED_ORIGINS.some(o => parsed.origin === o);
      } catch { return false; }
    }

    if (successUrl && !isTrustedUrl(successUrl)) {
      return new Response(
        JSON.stringify({ error: "Invalid success redirect URL" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    if (cancelUrl && !isTrustedUrl(cancelUrl)) {
      return new Response(
        JSON.stringify({ error: "Invalid cancel redirect URL" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

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
    let authenticatedUserId: string | undefined;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user) {
          authenticatedUserId = data.user.id;
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
    // Collect dish info for order creation after payment
    const orderItems: Array<{ dishId: string; chefId: string; quantity: number; unitPrice: number; name: string }> = [];

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
          .select("price, name, id, available, chef_id")
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

        // SERVER-SIDE: Check chef operating hours
        const { data: opHours } = await supabaseService
          .from("chef_operating_hours")
          .select("day_of_week, is_open, open_time, close_time")
          .eq("chef_id", dish.chef_id);

        if (opHours && opHours.length > 0) {
          const now = new Date();
          const stockholmStr = now.toLocaleString("en-US", { timeZone: "Europe/Stockholm" });
          const stockholmDate = new Date(stockholmStr);
          const currentDay = stockholmDate.getDay();
          const currentMinutes = stockholmDate.getHours() * 60 + stockholmDate.getMinutes();

          const todayHours = opHours.find((h: { day_of_week: number }) => h.day_of_week === currentDay);
          let chefOpen = false;
          if (todayHours && todayHours.is_open) {
            const [openH, openM] = todayHours.open_time.split(":").map(Number);
            const [closeH, closeM] = todayHours.close_time.split(":").map(Number);
            if (currentMinutes >= openH * 60 + openM && currentMinutes < closeH * 60 + closeM) {
              chefOpen = true;
            }
          }
          if (!chefOpen) {
            throw new Error(`Kocken tar inte emot beställningar just nu (${dish.name})`);
          }
        }
        
        // Use SERVER price, not client price (price is in SEK, convert to öre)
        const serverPriceInOre = Math.round(dish.price * 100);
        const itemTotal = serverPriceInOre * (item.quantity || 1);
        validatedTotalAmount += itemTotal;
        
        orderItems.push({
          dishId: dish.id,
          chefId: dish.chef_id,
          quantity: item.quantity || 1,
          unitPrice: dish.price,
          name: dish.name,
        });
        
        console.log(`Validated dish ${dish.name}: server price ${serverPriceInOre} öre, quantity ${item.quantity}`);
        
        validatedItems.push({
          price_data: {
            currency: 'sek',
            product_data: {
              name: dish.name,
            },
            unit_amount: serverPriceInOre,
          },
          quantity: item.quantity || 1,
        });
      }
      
      lineItems = validatedItems;
      console.log(`Total validated amount: ${validatedTotalAmount} öre`);
      
    } else if (priceId) {
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
        userId: authenticatedUserId || '',
        dish_name: dishName || 'Multiple items',
        customer_service_fee_percentage: "6",
        seller_commission_percentage: "19",
        total_amount: validatedTotalAmount > 0 ? String(validatedTotalAmount) : (totalAmount || ''),
      },
      payment_intent_data: {
        metadata: {
          userId: authenticatedUserId || '',
          dish_name: dishName || 'Multiple items',
          customer_service_fee_percentage: "6",
          seller_commission_percentage: "19",
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
        error: error instanceof Error ? error.message : "Failed to create checkout session" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
