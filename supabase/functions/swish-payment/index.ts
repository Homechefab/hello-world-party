import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SwishPaymentRequest {
  amount: number;
  payerAlias: string; // Customer's phone number (Swedish format: 46XXXXXXXXX)
  message?: string;
  orderId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, payerAlias, message, orderId } = await req.json() as SwishPaymentRequest;

    // Validate required fields
    if (!amount || !payerAlias) {
      throw new Error("Amount and payer phone number are required");
    }

    // Add 20% service fee to the amount
    const serviceFeeRate = 0.20;
    const totalAmount = amount * (1 + serviceFeeRate);

    console.log("Swish payment amount calculation:", {
      originalAmount: amount,
      serviceFee: amount * serviceFeeRate,
      totalAmount: totalAmount
    });

    // Validate Swedish phone number format
    const phoneRegex = /^46\d{9}$/;
    if (!phoneRegex.test(payerAlias.replace(/\D/g, ''))) {
      throw new Error("Invalid Swedish phone number format. Use format: 46XXXXXXXXX");
    }

    const payeeAlias = Deno.env.get("SWISH_PAYEE_ALIAS");
    const certificate = Deno.env.get("SWISH_CERTIFICATE");
    const privateKey = Deno.env.get("SWISH_PRIVATE_KEY");
    const callbackUrl = Deno.env.get("SWISH_CALLBACK_URL");

    if (!payeeAlias || !certificate || !privateKey) {
      throw new Error("Swish configuration is missing");
    }

    // Generate unique instruction ID (UUID format)
    const instructionId = crypto.randomUUID().replace(/-/g, '').toUpperCase();

    // Swish API endpoint (Production: https://cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests)
    // Test: https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests
    const swishApiUrl = "https://cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests";

    const paymentRequest = {
      payeePaymentReference: orderId || instructionId,
      callbackUrl: callbackUrl || `https://rkucenozpmaixfphpiub.supabase.co/functions/v1/swish-callback`,
      payerAlias: payerAlias.replace(/\D/g, ''),
      payeeAlias: payeeAlias,
      amount: totalAmount.toFixed(2),
      currency: "SEK",
      message: message || "Betalning via Homechef",
    };

    console.log("Creating Swish payment request:", JSON.stringify(paymentRequest));

    // Create HTTP client with mTLS (client certificate authentication)
    // Swish requires mutual TLS for API authentication
    let response: Response;
    
    try {
      // Use Deno's createHttpClient for mTLS support
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
      throw new Error(`Swish certificate authentication failed: ${tlsError.message}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Swish API error:", errorText);
      throw new Error(`Swish API error: ${response.status} - ${errorText}`);
    }

    // Swish returns 201 Created with Location header containing payment request URL
    const location = response.headers.get("Location");
    const paymentRequestToken = response.headers.get("PaymentRequestToken");

    console.log("Swish payment request created successfully:", { location, paymentRequestToken });

    // Store payment request in database for tracking
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseClient.from("swish_payments").insert({
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
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
