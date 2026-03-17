import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Swish callback IP ranges (production)
// Source: Swish technical documentation
const SWISH_ALLOWED_CIDRS = [
  "213.132.115.",   // Swish production range
  "194.242.111.",   // Swish production range  
  "83.252.227.",    // Swish production range
];

function isSwishIP(ip: string | null): boolean {
  if (!ip) return false;
  // In production, validate against Swish's published IP ranges
  // Also allow local/proxy IPs for edge function environments
  if (ip === "127.0.0.1" || ip === "::1") return true;
  return SWISH_ALLOWED_CIDRS.some((cidr) => ip.startsWith(cidr));
}

interface SwishCallback {
  id: string;
  payeePaymentReference: string;
  paymentReference: string;
  callbackUrl: string;
  payerAlias: string;
  payeeAlias: string;
  amount: number;
  currency: string;
  message: string;
  status: "PAID" | "DECLINED" | "ERROR" | "CANCELLED";
  dateCreated: string;
  datePaid?: string;
  errorCode?: string;
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- IP allowlist check ---
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip");

    // Log the IP for monitoring; enforce in production
    console.log("Swish callback received from IP:", clientIP);

    // In production with known Swish IPs, enforce the allowlist.
    // For now, log a warning if the IP doesn't match known Swish ranges.
    if (!isSwishIP(clientIP)) {
      console.warn("WARNING: Callback from non-Swish IP:", clientIP);
      // Uncomment the following to enforce strict IP filtering once Swish IPs are confirmed:
      // return new Response(
      //   JSON.stringify({ error: "Forbidden" }),
      //   { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      // );
    }

    const callback = (await req.json()) as SwishCallback;

    console.log("Received Swish callback:", JSON.stringify(callback));

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the existing payment record to validate the callback
    const { data: existingPayment, error: fetchError } = await supabaseClient
      .from("swish_payments")
      .select("instruction_id, amount, payee_alias, status, order_id")
      .eq("instruction_id", callback.payeePaymentReference)
      .single();

    if (fetchError || !existingPayment) {
      console.error("Payment not found for instruction_id:", callback.payeePaymentReference);
      return new Response(
        JSON.stringify({ error: "Payment not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Validate amount matches what we expect (server-set amount, not client-controlled)
    if (callback.status === "PAID" && Number(callback.amount) !== Number(existingPayment.amount)) {
      console.error("Amount mismatch! Expected:", existingPayment.amount, "Got:", callback.amount);
      return new Response(
        JSON.stringify({ error: "Amount mismatch" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate payee alias matches
    if (callback.payeeAlias && callback.payeeAlias !== existingPayment.payee_alias) {
      console.error("Payee alias mismatch! Expected:", existingPayment.payee_alias, "Got:", callback.payeeAlias);
      return new Response(
        JSON.stringify({ error: "Payee alias mismatch" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Prevent replaying a callback on an already-paid payment
    if (existingPayment.status === "PAID" && callback.status === "PAID") {
      console.log("Payment already marked as PAID, ignoring duplicate callback");
      return new Response(
        JSON.stringify({ success: true, message: "Already processed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Also verify the order amount in the orders table to prevent the attack where
    // the swish-payment function was called with a manipulated amount
    if (callback.status === "PAID" && existingPayment.order_id) {
      const { data: order } = await supabaseClient
        .from("orders")
        .select("total_amount")
        .eq("id", existingPayment.order_id)
        .single();

      if (order) {
        const expectedTotal = Number(order.total_amount) * 1.06; // 6% service fee
        const callbackAmount = Number(callback.amount);
        // Allow a small tolerance for floating point
        if (Math.abs(callbackAmount - expectedTotal) > 0.5) {
          console.error("Order amount mismatch! Order expects:", expectedTotal, "Callback has:", callbackAmount);
          return new Response(
            JSON.stringify({ error: "Amount does not match order" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }
      }
    }

    // Update payment status in database
    const { error: updateError } = await supabaseClient
      .from("swish_payments")
      .update({
        status: callback.status,
        payment_reference: callback.paymentReference,
        date_paid: callback.datePaid,
        error_code: callback.errorCode,
        error_message: callback.errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("instruction_id", callback.payeePaymentReference);

    if (updateError) {
      console.error("Error updating payment status:", updateError);
      throw updateError;
    }

    // If payment was successful, update the order status
    if (callback.status === "PAID" && existingPayment.order_id) {
      await supabaseClient
        .from("orders")
        .update({ status: "paid" })
        .eq("id", existingPayment.order_id);

      console.log("Order marked as paid:", existingPayment.order_id);
    }

    console.log("Swish callback processed successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in swish-callback function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
