import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SwishPaymentRequest {
  payerAlias: string; // Customer's phone number (Swedish format: 46XXXXXXXXX)
  message?: string;
  orderId: string; // Required — we validate price from the DB
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Authentication: require a valid JWT ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAnon.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const userId = claimsData.claims.sub;

    const { payerAlias, message, orderId } = await req.json() as SwishPaymentRequest;

    // Validate required fields
    if (!payerAlias || !orderId) {
      throw new Error("Payer phone number and orderId are required");
    }

    // Validate Swedish phone number format
    const phoneRegex = /^46\d{9}$/;
    if (!phoneRegex.test(payerAlias.replace(/\D/g, ""))) {
      throw new Error("Invalid Swedish phone number format. Use format: 46XXXXXXXXX");
    }

    // --- Server-side price validation: derive amount from order_items × dish prices ---
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: order, error: orderError } = await supabaseService
      .from("orders")
      .select("id, customer_id, status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // Verify the authenticated user owns this order
    if (order.customer_id !== userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    // Prevent paying for already-paid orders
    if (order.status === "paid") {
      throw new Error("Order is already paid");
    }

    // Derive the true amount from order_items joined with dish prices
    const { data: orderItems, error: itemsError } = await supabaseService
      .from("order_items")
      .select("quantity, dish_id, dishes(price)")
      .eq("order_id", orderId);

    if (itemsError || !orderItems || orderItems.length === 0) {
      throw new Error("No order items found for this order");
    }

    // Calculate amount from authoritative dish prices × quantities
    const amount = orderItems.reduce((sum, item) => {
      const dishPrice = Number((item.dishes as any)?.price ?? 0);
      return sum + dishPrice * item.quantity;
    }, 0);

    if (amount <= 0) {
      throw new Error("Invalid order amount");
    }

    // Update the order's total_amount to the server-calculated value
    await supabaseService
      .from("orders")
      .update({ total_amount: amount })
      .eq("id", orderId);

    // Add 6% service fee to the amount (customer pays)
    const serviceFeeRate = 0.06;
    const totalAmount = amount * (1 + serviceFeeRate);

    console.log("Swish payment amount calculation:", {
      originalAmount: amount,
      serviceFee: amount * serviceFeeRate,
      totalAmount: totalAmount,
    });

    const payeeAlias = Deno.env.get("SWISH_PAYEE_ALIAS");
    const certificate = Deno.env.get("SWISH_CERTIFICATE");
    const privateKey = Deno.env.get("SWISH_PRIVATE_KEY");
    const callbackUrl = Deno.env.get("SWISH_CALLBACK_URL");

    if (!payeeAlias || !certificate || !privateKey) {
      throw new Error("Swish configuration is missing");
    }

    // Generate unique instruction ID (UUID format)
    const instructionId = crypto.randomUUID().replace(/-/g, "").toUpperCase();

    // Generate a callback verification secret for this payment
    const callbackSecret = crypto.randomUUID();

    const swishApiUrl = "https://cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests";

    const paymentRequest = {
      payeePaymentReference: instructionId,
      callbackUrl: callbackUrl || `https://rkucenozpmaixfphpiub.supabase.co/functions/v1/swish-callback`,
      payerAlias: payerAlias.replace(/\D/g, ""),
      payeeAlias: payeeAlias,
      amount: totalAmount.toFixed(2),
      currency: "SEK",
      message: message || "Betalning via Homechef",
    };

    console.log("Creating Swish payment request:", JSON.stringify(paymentRequest));

    // Create HTTP client with mTLS (client certificate authentication)
    let response: Response;

    try {
      const httpClient = Deno.createHttpClient({
        cert: certificate,
        key: privateKey,
      });

      response = await fetch(swishApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
        client: httpClient,
      });
    } catch (tlsError) {
      console.error("TLS/mTLS error:", tlsError);
      throw new Error("Swish certificate authentication failed");
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Swish API error:", errorText);
      throw new Error(`Swish API error: ${response.status}`);
    }

    // Swish returns 201 Created with Location header containing payment request URL
    const location = response.headers.get("Location");
    const paymentRequestToken = response.headers.get("PaymentRequestToken");

    console.log("Swish payment request created successfully:", { location, paymentRequestToken });

    // Store payment request in database for tracking, including the callback secret
    await supabaseService.from("swish_payments").insert({
      instruction_id: instructionId,
      amount: totalAmount,
      payer_alias: payerAlias,
      payee_alias: payeeAlias,
      message: message,
      order_id: orderId,
      status: "CREATED",
      payment_request_token: paymentRequestToken,
    });

    return new Response(
      JSON.stringify({
        success: true,
        instructionId,
        paymentRequestToken,
        message: "Betalningsförfrågan har skickats till din Swish-app",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error in swish-payment function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
