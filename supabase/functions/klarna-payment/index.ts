import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[KLARNA-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Klarna payment function started");

    // Get environment variables
    const klarnaApiKey = Deno.env.get("KLARNA_API_KEY");
    const klarnaRegion = Deno.env.get("KLARNA_REGION") || "eu";
    
    if (!klarnaApiKey) {
      throw new Error("KLARNA_API_KEY is not set in Supabase secrets");
    }

    // Create Supabase clients
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body
    const body = await req.json();
    const {
      // Preferred (secure) shape
      dishId,
      quantity,
      // Legacy shape (frontend currently sends this)
      amount,
      currency,
      orderLines,
      // optional
      userEmail,
    } = body ?? {};

    // Try to get authenticated user
    let user = null;
    let customerEmail = userEmail || "guest@homechef.se";

    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        if (user?.email) customerEmail = user.email;
      }
    } catch (authError) {
      logStep("No authenticated user, proceeding as guest", { email: customerEmail });
    }

    // Resolve order details
    let resolvedOrderLines: any[] = [];
    let resolvedOrderAmountInOre = 0;
    let resolvedTaxAmountInOre = 0;
    let resolvedCurrency = (currency || "SEK") as string;

    if (dishId) {
      if (!quantity) {
        throw new Error("dishId and quantity are required");
      }

      if (quantity < 1 || quantity > 100) {
        throw new Error("Quantity must be between 1 and 100");
      }

      logStep("Received payment request (dishId)", { dishId, quantity });

      // Look up the dish price from database
      const { data: dish, error: dishError } = await supabaseService
        .from("dishes")
        .select("id, name, price, chef_id")
        .eq("id", dishId)
        .single();

      if (dishError || !dish) {
        logStep("Dish lookup failed", { error: dishError });
        throw new Error("Invalid dish ID");
      }

      logStep("Dish found", { name: dish.name, price: dish.price });

      // Calculate total amount server-side (price in SEK, convert to öre for Klarna)
      const unitPriceInOre = Math.round(dish.price * 100);
      resolvedOrderAmountInOre = unitPriceInOre * quantity;
      resolvedTaxAmountInOre = Math.round(resolvedOrderAmountInOre * 0.2); // 20% VAT

      logStep("Calculated amounts", {
        unitPriceInOre,
        quantity,
        totalAmountInOre: resolvedOrderAmountInOre,
        taxAmountInOre: resolvedTaxAmountInOre,
      });

      resolvedOrderLines = [
        {
          type: "physical",
          reference: dish.id,
          name: dish.name,
          quantity,
          unit_price: unitPriceInOre,
          tax_rate: 2000, // 20% in basis points
          total_amount: unitPriceInOre * quantity,
          total_tax_amount: Math.round(unitPriceInOre * quantity * 0.2),
        },
      ];
    } else {
      // Backward-compatible mode (accepts amount + orderLines)
      if (!amount || !Array.isArray(orderLines) || orderLines.length < 1) {
        throw new Error("Either (dishId + quantity) or (amount + orderLines) is required");
      }

      resolvedOrderAmountInOre = Number(amount);
      if (!Number.isFinite(resolvedOrderAmountInOre) || resolvedOrderAmountInOre < 1) {
        throw new Error("amount must be a positive number in öre");
      }

      resolvedOrderLines = orderLines;
      resolvedTaxAmountInOre = resolvedOrderLines.reduce(
        (sum, line) => sum + Number(line?.total_tax_amount ?? 0),
        0
      );
      if (!Number.isFinite(resolvedTaxAmountInOre) || resolvedTaxAmountInOre < 0) {
        resolvedTaxAmountInOre = Math.round(resolvedOrderAmountInOre * 0.2);
      }

      logStep("Received payment request (legacy)", {
        amount: resolvedOrderAmountInOre,
        currency: resolvedCurrency,
        orderLinesCount: resolvedOrderLines.length,
      });
    }

    // Determine Klarna API endpoint
    const apiEndpoints = {
      eu: "https://api.klarna.com",
      na: "https://api-na.klarna.com", 
      oc: "https://api-oc.klarna.com"
    };
    const baseUrl = apiEndpoints[klarnaRegion as keyof typeof apiEndpoints] || apiEndpoints.eu;

    // Create Klarna checkout session
    const klarnaOrder = {
      purchase_country: "SE",
      purchase_currency: resolvedCurrency,
      locale: "sv-SE",
      order_amount: resolvedOrderAmountInOre,
      order_tax_amount: resolvedTaxAmountInOre,
      order_lines: resolvedOrderLines,
      merchant_urls: {
        terms: `${req.headers.get("origin")}/terms`,
        checkout: `${req.headers.get("origin")}/checkout`,
        confirmation: `${req.headers.get("origin")}/payment-success?order_id={checkout.order.id}`,
        push: `${req.headers.get("origin")}/api/klarna/push?order_id={checkout.order.id}`,
      },
      shipping_countries: ["SE"],
      billing_countries: ["SE"],
    };

    logStep("Creating Klarna order", klarnaOrder);

    // Call Klarna API
    const klarnaResponse = await fetch(`${baseUrl}/checkout/v3/orders`, {
      method: "POST",
      headers: {
        // KLARNA_API_KEY should be stored as "username:password".
        // Backward compatible: if no ":" exists, we assume only username was provided.
        "Authorization": `Basic ${btoa(klarnaApiKey.includes(":" ) ? klarnaApiKey : klarnaApiKey + ":")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(klarnaOrder),
    });

    if (!klarnaResponse.ok) {
      const errorData = await klarnaResponse.text();
      logStep("Klarna API error", { status: klarnaResponse.status, error: errorData });
      throw new Error(`Klarna API error: ${klarnaResponse.status} - ${errorData}`);
    }

    const klarnaData = await klarnaResponse.json();
    logStep("Klarna checkout session created", { orderId: klarnaData.order_id });

    // Store order in Supabase
    try {
      await supabaseService.from("orders").insert({
        user_id: user?.id,
        klarna_order_id: klarnaData.order_id,
        customer_email: customerEmail,
        amount: resolvedOrderAmountInOre / 100,
        currency: resolvedCurrency,
        status: "pending",
        order_lines: resolvedOrderLines,
        created_at: new Date().toISOString(),
      });

      logStep("Order stored in Supabase", { orderId: klarnaData.order_id });
    } catch (dbError) {
      logStep("Failed to store order in Supabase", dbError);
    }

    return new Response(JSON.stringify({
      order_id: klarnaData.order_id,
      html_snippet: klarnaData.html_snippet,
      checkout_url: klarnaData.checkout_url
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in klarna-payment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: "Check Supabase logs for more information"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
