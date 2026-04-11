import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { priceId, quantity, dishName, items, totalAmount, successUrl, cancelUrl, deliveryAddress, specialInstructions } = body;

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
      } catch {
        return false;
      }
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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const authenticatedUserId = authData.user.id;
    const userEmail = authData.user.email;

    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    let lineItems;
    let subtotalInOre = 0;
    let totalAmountInOre = 0;
    const orderItems: Array<{ dishId: string; chefId: string; quantity: number; unitPrice: number; name: string }> = [];

    if (items && Array.isArray(items) && items.length > 0) {
      const validatedItems = [];

      for (const item of items) {
        if (!item.dishId) {
          console.error("Missing dishId in cart item:", item);
          throw new Error("Missing dishId in cart item - price validation required");
        }

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

        const serverPriceInOre = Math.round(dish.price * 100);
        const itemTotal = serverPriceInOre * (item.quantity || 1);
        subtotalInOre += itemTotal;

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

      const serviceFeeInOre = Math.round(subtotalInOre * 0.06);
      totalAmountInOre = subtotalInOre + serviceFeeInOre;

      lineItems = [
        ...validatedItems,
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Serviceavgift (6%)',
              description: 'Homechef serviceavgift',
            },
            unit_amount: serviceFeeInOre,
          },
          quantity: 1,
        },
      ];

      console.log(`Total validated amount including service fee: ${totalAmountInOre} öre`);
    } else if (priceId) {
      lineItems = [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ];
      totalAmountInOre = typeof totalAmount === 'number' ? Math.round(totalAmount * 100) : 0;
    } else {
      throw new Error("No items or priceId provided");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        userId: authenticatedUserId,
        dish_name: dishName || 'Multiple items',
        customer_service_fee_percentage: "6",
        seller_commission_percentage: "19",
        total_amount: totalAmountInOre > 0 ? String(totalAmountInOre) : (totalAmount || ''),
        order_items: JSON.stringify(orderItems),
        delivery_address: deliveryAddress || 'Upphämtning',
        special_instructions: specialInstructions || '',
      },
      payment_intent_data: {
        metadata: {
          userId: authenticatedUserId,
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
        sessionId: session.id,
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
