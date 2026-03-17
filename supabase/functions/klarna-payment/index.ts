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
    const merchantBaseUrl = Deno.env.get("KLARNA_MERCHANT_BASE_URL");
    
    if (!klarnaApiKey) {
      throw new Error("KLARNA_API_KEY is not set in Supabase secrets");
    }

    if (!merchantBaseUrl) {
      throw new Error("KLARNA_MERCHANT_BASE_URL is not set in Supabase secrets");
    }

    logStep("Using merchant base URL", { merchantBaseUrl });

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

    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = authData.user;
    const customerEmail = user.email || "guest@homechef.nu";
    logStep("Authenticated user", { userId: user.id });

    // Parse request body
    const body = await req.json();
    const { dishId, quantity } = body ?? {};

    if (!dishId || !quantity) {
      throw new Error("dishId and quantity are required");
    }

    if (quantity < 1 || quantity > 100) {
      throw new Error("Quantity must be between 1 and 100");
    }

    logStep("Received payment request", { dishId, quantity });

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
    // Include 6% service fee from customer
    const serviceFeeRate = 0.06;
    const unitPriceInOre = Math.round(dish.price * 100);
    const subtotalInOre = unitPriceInOre * quantity;
    const serviceFeeInOre = Math.round(subtotalInOre * serviceFeeRate);
    const resolvedOrderAmountInOre = subtotalInOre + serviceFeeInOre;
    const resolvedTaxAmountInOre = Math.round(resolvedOrderAmountInOre * 0.2);
    const resolvedCurrency = "SEK";

    logStep("Calculated amounts with service fee", {
      unitPriceInOre,
      quantity,
      subtotalInOre,
      serviceFeeInOre,
      totalAmountInOre: resolvedOrderAmountInOre,
      taxAmountInOre: resolvedTaxAmountInOre,
    });

    const resolvedOrderLines = [
      {
        type: "physical",
        reference: dish.id,
        name: dish.name,
        quantity,
        unit_price: unitPriceInOre,
        tax_rate: 2000,
        total_amount: subtotalInOre,
        total_tax_amount: Math.round(subtotalInOre * 0.2),
      },
      {
        type: "surcharge",
        reference: "service-fee",
        name: "Serviceavgift (6%)",
        quantity: 1,
        unit_price: serviceFeeInOre,
        tax_rate: 2000,
        total_amount: serviceFeeInOre,
        total_tax_amount: Math.round(serviceFeeInOre * 0.2),
      },
    ];

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
        terms: `${merchantBaseUrl}/terms`,
        checkout: `${merchantBaseUrl}/checkout`,
        confirmation: `${merchantBaseUrl}/payment-success?order_id={checkout.order.id}`,
        push: `${merchantBaseUrl}/api/klarna/push?order_id={checkout.order.id}`,
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
