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
    const klarnaRegion = Deno.env.get("KLARNA_REGION") || "eu"; // eu, na, or oc
    
    if (!klarnaApiKey) {
      throw new Error("KLARNA_API_KEY is not set in Supabase secrets");
    }

    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Parse request body
    const { amount, currency = "SEK", orderLines, userEmail } = await req.json();
    
    if (!amount || !orderLines) {
      throw new Error("Amount and orderLines are required");
    }

    logStep("Received payment request", { amount, currency, orderLines });

    // Try to get authenticated user, but allow guest checkout
    let user = null;
    let customerEmail = userEmail || "guest@homechef.se";
    
    try {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        if (user?.email) {
          customerEmail = user.email;
        }
      }
    } catch (authError) {
      logStep("No authenticated user, proceeding as guest", { email: customerEmail });
    }

    // Determine Klarna API endpoint based on region
    const apiEndpoints = {
      eu: "https://api.klarna.com",
      na: "https://api-na.klarna.com", 
      oc: "https://api-oc.klarna.com"
    };
    const baseUrl = apiEndpoints[klarnaRegion as keyof typeof apiEndpoints] || apiEndpoints.eu;

    // Create Klarna checkout session
    const klarnaOrder = {
      purchase_country: "SE",
      purchase_currency: currency,
      locale: "sv-SE",
      order_amount: amount,
      order_tax_amount: Math.round(amount * 0.2), // 20% moms
      order_lines: orderLines,
      merchant_urls: {
        terms: `${req.headers.get("origin")}/terms`,
        checkout: `${req.headers.get("origin")}/checkout`,
        confirmation: `${req.headers.get("origin")}/payment-success?order_id={checkout.order.id}`,
        push: `${req.headers.get("origin")}/api/klarna/push?order_id={checkout.order.id}`
      },
      shipping_countries: ["SE"],
      billing_countries: ["SE"]
    };

    logStep("Creating Klarna order", klarnaOrder);

    // Call Klarna API to create checkout session
    const klarnaResponse = await fetch(`${baseUrl}/checkout/v3/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(klarnaApiKey + ":")}`,
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

    // Optional: Store order in Supabase for tracking
    try {
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabaseService.from("orders").insert({
        user_id: user?.id,
        klarna_order_id: klarnaData.order_id,
        customer_email: customerEmail,
        amount: amount,
        currency: currency,
        status: "pending",
        order_lines: orderLines,
        created_at: new Date().toISOString()
      });
      
      logStep("Order stored in Supabase", { orderId: klarnaData.order_id });
    } catch (dbError) {
      logStep("Failed to store order in Supabase", dbError);
      // Continue anyway - payment is more important than logging
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